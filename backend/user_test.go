package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"
)

type parsedResponse struct {
	status int
	body   []byte
}

func createRequester(t *testing.T) func(req *http.Request, err error) parsedResponse {
	return func(req *http.Request, err error) parsedResponse {
		if err != nil {
			t.Errorf("unexpected error: %v", err)
			return parsedResponse{}
		}

		res, httpErr := http.DefaultClient.Do(req)
		if httpErr != nil {
			t.Errorf("unexpected error: %v", httpErr)
			return parsedResponse{}
		}

		resp, ioErr := io.ReadAll(res.Body)
		closeErr := res.Body.Close()
		if closeErr != nil {
			return parsedResponse{}
		}
		if ioErr != nil {
			t.Errorf("unexpected error: %v", ioErr)
			return parsedResponse{}
		}

		return parsedResponse{res.StatusCode, resp}
	}
}

func prepareParams(t *testing.T, params map[string]interface{}) io.Reader {
	body, err := json.Marshal(params)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}
	return bytes.NewBuffer(body)
}

func newTestUserService() *UserService {
	return &UserService{
		repository: NewInMemoryUserStorage(),
	}
}

func assertStatus(t *testing.T, expected int, r parsedResponse) {
	if r.status != expected {
		t.Errorf("Unexpected response status. Expected: %d,actual: %d", expected, r.status)
	}
}

func assertBody(t *testing.T, expected string, r parsedResponse) {
	actual := string(r.body)
	if actual != expected {
		t.Errorf("Unexpected response body. Expected: %s,actual: %s", expected, actual)
	}
}

func getListIdStr(r parsedResponse) string {
	respListHead := &ListHead{}
	_ = json.Unmarshal(r.body, respListHead)

	return strconv.Itoa(int(respListHead.Id))
}

func TestUsers_JWT(t *testing.T) {
	doRequest := createRequester(t)
	t.Run("user does not exist", func(t *testing.T) {
		u := newTestUserService()
		j, err := NewJWTService("pubkey.rsa", "privkey.rsa")
		if err != nil {
			t.FailNow()
		}
		ts := httptest.NewServer(newLoggingRouter(u, j))
		defer ts.Close()
		params := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		resp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signin", prepareParams(t, params)))
		assertStatus(t, 422, resp)
		assertBody(t, "invalid login credentials", resp)
	})

	t.Run("registration", func(t *testing.T) {
		u := newTestUserService()
		ts := httptest.NewServer(http.HandlerFunc(u.Register))
		defer ts.Close()
		params := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		resp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, params)))
		assertStatus(t, 201, resp)
		assertBody(t, "registered", resp)
	})

	t.Run("adding already registered user", func(t *testing.T) {
		u := newTestUserService()
		ts := httptest.NewServer(http.HandlerFunc(u.Register))
		defer ts.Close()
		params := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, params)))

		resp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, params)))
		assertStatus(t, 422, resp)
		assertBody(t, "user already exists", resp)
	})

	t.Run("wrong password", func(t *testing.T) {
		u := newTestUserService()

		jwtService, jwtErr := NewJWTService("pubkey.rsa", "privkey.rsa")
		if jwtErr != nil {
			panic(jwtErr)
		}

		ts := httptest.NewServer(newRouter(u, jwtService))
		defer ts.Close()

		registerParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, registerParams)))

		jwtParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "wrongpass",
		}
		resp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signin", prepareParams(t, jwtParams)))
		assertStatus(t, 422, resp)
		assertBody(t, "invalid login credentials", resp)
	})

	t.Run("create list without jwt", func(t *testing.T) {
		u := newTestUserService()

		jwtService, jwtErr := NewJWTService("pubkey.rsa", "privkey.rsa")
		if jwtErr != nil {
			panic(jwtErr)
		}

		ts := httptest.NewServer(newRouter(u, jwtService))
		defer ts.Close()

		registerParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, registerParams)))

		newListParams := map[string]interface{}{
			"name": "newList",
		}

		resp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/todo/lists", prepareParams(t, newListParams)))
		assertStatus(t, 401, resp)
		assertBody(t, "unauthorized", resp)
	})

	t.Run("create list", func(t *testing.T) {
		u := newTestUserService()

		jwtService, jwtErr := NewJWTService("pubkey.rsa", "privkey.rsa")
		if jwtErr != nil {
			panic(jwtErr)
		}

		ts := httptest.NewServer(newRouter(u, jwtService))
		defer ts.Close()

		registerParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, registerParams)))

		jwtParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		jwtResp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signin", prepareParams(t, jwtParams)))

		newListParams := map[string]interface{}{
			"name": "newList",
		}

		req, _ := http.NewRequest(http.MethodPost, ts.URL+"/todo/lists", prepareParams(t, newListParams))
		req.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		resp := doRequest(req, nil)

		idStr := getListIdStr(resp)

		assertStatus(t, 201, resp)
		assertBody(t, "{\"name\":\"newList\",\"id\":"+idStr+"}", resp)
	})

	t.Run("get listHeaders", func(t *testing.T) {
		u := newTestUserService()

		jwtService, jwtErr := NewJWTService("pubkey.rsa", "privkey.rsa")
		if jwtErr != nil {
			panic(jwtErr)
		}

		ts := httptest.NewServer(newRouter(u, jwtService))
		defer ts.Close()

		registerParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, registerParams)))

		jwtParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		jwtResp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signin", prepareParams(t, jwtParams)))

		newList1Params := map[string]interface{}{
			"name": "List first",
		}

		req1, _ := http.NewRequest(http.MethodPost, ts.URL+"/todo/lists", prepareParams(t, newList1Params))
		req1.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		resp1 := doRequest(req1, nil)

		id1Str := getListIdStr(resp1)

		newList2Params := map[string]interface{}{
			"name": "List second",
		}

		req2, _ := http.NewRequest(http.MethodPost, ts.URL+"/todo/lists", prepareParams(t, newList2Params))
		req2.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		resp2 := doRequest(req2, nil)

		id2Str := getListIdStr(resp2)

		getReq, _ := http.NewRequest(http.MethodGet, ts.URL+"/todo/listHeads", nil)
		getReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		resp := doRequest(getReq, nil)

		assertStatus(t, 200, resp)
		assertBody(t, "[{\"name\":\"List first\",\"id\":"+id1Str+"},{\"name\":\"List second\",\"id\":"+id2Str+"}]", resp)
	})

	t.Run("get list", func(t *testing.T) {
		u := newTestUserService()

		jwtService, jwtErr := NewJWTService("pubkey.rsa", "privkey.rsa")
		if jwtErr != nil {
			panic(jwtErr)
		}

		ts := httptest.NewServer(newRouter(u, jwtService))
		defer ts.Close()

		registerParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, registerParams)))

		jwtParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		jwtResp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signin", prepareParams(t, jwtParams)))

		newListParams := map[string]interface{}{
			"name": "newList",
		}

		req, _ := http.NewRequest(http.MethodPost, ts.URL+"/todo/lists", prepareParams(t, newListParams))
		req.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		resp := doRequest(req, nil)

		idStr := getListIdStr(resp)

		getReq, _ := http.NewRequest(http.MethodGet, ts.URL+"/todo/lists/"+idStr, nil)
		getReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		resp = doRequest(getReq, nil)

		assertStatus(t, 200, resp)
		assertBody(t, "{\"name\":\"newList\",\"tasks\":[],\"completed\":[],\"id\":"+idStr+"}", resp)
	})

	t.Run("update list", func(t *testing.T) {
		u := newTestUserService()

		jwtService, jwtErr := NewJWTService("pubkey.rsa", "privkey.rsa")
		if jwtErr != nil {
			panic(jwtErr)
		}

		ts := httptest.NewServer(newRouter(u, jwtService))
		defer ts.Close()

		registerParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, registerParams)))

		jwtParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		jwtResp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signin", prepareParams(t, jwtParams)))

		newListParams := map[string]interface{}{
			"name": "newList",
		}

		createReq, _ := http.NewRequest(http.MethodPost, ts.URL+"/todo/lists", prepareParams(t, newListParams))
		createReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		resp := doRequest(createReq, nil)

		idStr := getListIdStr(resp)

		updateListParams := map[string]interface{}{
			"name": "Updated List",
		}

		updateReq, _ := http.NewRequest(http.MethodPut, ts.URL+"/todo/lists/"+idStr, prepareParams(t, updateListParams))
		updateReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		updateResp := doRequest(updateReq, nil)
		assertStatus(t, 200, updateResp)
		assertBody(t, "{\"name\":\"Updated List\",\"id\":"+idStr+"}", updateResp)

		getReq, _ := http.NewRequest(http.MethodGet, ts.URL+"/todo/lists/"+idStr, nil)
		getReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		getResp := doRequest(getReq, nil)

		assertStatus(t, 200, getResp)
		assertBody(t, "{\"name\":\"Updated List\",\"tasks\":[],\"completed\":[],\"id\":"+idStr+"}", getResp)
	})

	t.Run("delete list", func(t *testing.T) {
		u := newTestUserService()

		jwtService, jwtErr := NewJWTService("pubkey.rsa", "privkey.rsa")
		if jwtErr != nil {
			panic(jwtErr)
		}

		ts := httptest.NewServer(newRouter(u, jwtService))
		defer ts.Close()

		registerParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, registerParams)))

		jwtParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		jwtResp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signin", prepareParams(t, jwtParams)))

		newListParams := map[string]interface{}{
			"name": "newList",
		}

		createReq, _ := http.NewRequest(http.MethodPost, ts.URL+"/todo/lists", prepareParams(t, newListParams))
		createReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		resp := doRequest(createReq, nil)

		idStr := getListIdStr(resp)

		deleteReq, _ := http.NewRequest(http.MethodDelete, ts.URL+"/todo/lists/"+idStr, nil)
		deleteReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		deleteResp := doRequest(deleteReq, nil)
		assertStatus(t, 204, deleteResp)
		assertBody(t, "", deleteResp)

		getReq, _ := http.NewRequest(http.MethodGet, ts.URL+"/todo/lists/"+idStr, nil)
		getReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		getResp := doRequest(getReq, nil)

		assertStatus(t, 422, getResp)
	})

	t.Run("create task", func(t *testing.T) {
		u := newTestUserService()

		jwtService, jwtErr := NewJWTService("pubkey.rsa", "privkey.rsa")
		if jwtErr != nil {
			panic(jwtErr)
		}

		ts := httptest.NewServer(newRouter(u, jwtService))
		defer ts.Close()

		registerParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signup", prepareParams(t, registerParams)))

		jwtParams := map[string]interface{}{
			"email":    "test@mail.com",
			"password": "somepass",
		}
		jwtResp := doRequest(http.NewRequest(http.MethodPost, ts.URL+"/user/signin", prepareParams(t, jwtParams)))

		newListParams := map[string]interface{}{
			"name": "newList",
		}

		createReq, _ := http.NewRequest(http.MethodPost, ts.URL+"/todo/lists", prepareParams(t, newListParams))
		createReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		resp := doRequest(createReq, nil)

		idStr := getListIdStr(resp)

		newTaskParams := map[string]interface{}{
			"name":        "new task",
			"createdAt":   time.Now(),
			"description": "",
		}

		createTaskReq, _ := http.NewRequest(http.MethodPost, ts.URL+"/todo/lists/"+idStr+"/tasks", prepareParams(t, newTaskParams))
		createTaskReq.Header.Set("Authorization", "Bearer "+string(jwtResp.body))
		createTaskRes := doRequest(createTaskReq, nil)

		taskIdStr := getListIdStr(createTaskRes)

		assertStatus(t, 201, createTaskRes)
		assertBody(t, "{\"name\":\"new task\",\"id\":"+taskIdStr+",\"created_at\":\"0001-01-01T00:00:00Z\",\"description\":\"\"}", createTaskRes)
	})
}

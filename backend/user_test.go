package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
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
}

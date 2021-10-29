package main

import (
	"context"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

func wrapJwt(jwt *JWTService, f func(http.ResponseWriter, *http.Request, *JWTService)) http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		f(rw, r, jwt)
	}
}

func newRouter(u *UserService, jwtService *JWTService) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/user/signup", u.Register).Methods(http.MethodPost)
	r.HandleFunc("/user/signin", wrapJwt(jwtService, u.JWT)).Methods(http.MethodPost)
	r.HandleFunc("/todo/lists", jwtService.jwtAuth(u.repository, createListHandler)).Methods(http.MethodPost)
	r.HandleFunc("/todo/listHeads", jwtService.jwtAuth(u.repository, getListHeadsHandler)).Methods(http.MethodGet)
	r.HandleFunc("/todo/lists/{list_id}", jwtService.jwtAuth(u.repository, getListHandler)).Methods(http.MethodGet)
	r.HandleFunc("/todo/lists/{list_id}", jwtService.jwtAuth(u.repository, updateListHandler)).Methods(http.MethodPut)
	r.HandleFunc("/todo/lists/{list_id}", jwtService.jwtAuth(u.repository, deleteListHandler)).Methods(http.MethodDelete)
	r.HandleFunc("/todo/lists/{list_id}/tasks", jwtService.jwtAuth(u.repository, createTaskHandler)).Methods(http.MethodPost)
	r.HandleFunc("/todo/lists/{list_id}/tasks/{task_id}", jwtService.jwtAuth(u.repository, updateTaskHandler)).Methods(http.MethodPut)
	r.HandleFunc("/todo/lists/{list_id}/tasks/mark/{task_id}", jwtService.jwtAuth(u.repository, markTaskHandler)).Methods(http.MethodPut)
	r.HandleFunc("/todo/lists/{list_id}/tasks/{task_id}", jwtService.jwtAuth(u.repository, deleteTaskHandler)).Methods(http.MethodDelete)
	return r
}

func newLoggingRouter(u *UserService, jwtService *JWTService) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/user/signup", logRequest(u.Register)).Methods(http.MethodPost)
	r.HandleFunc("/user/signin", logRequest(wrapJwt(jwtService, u.JWT))).Methods(http.MethodPost)
	r.HandleFunc("/todo/lists", logRequest(jwtService.jwtAuth(u.repository, createListHandler))).Methods(http.MethodPost)
	r.HandleFunc("/todo/listHeads", logRequest(jwtService.jwtAuth(u.repository, getListHeadsHandler))).Methods(http.MethodGet)
	r.HandleFunc("/todo/lists/{list_id}", logRequest(jwtService.jwtAuth(u.repository, getListHandler))).Methods(http.MethodGet)
	r.HandleFunc("/todo/lists/{list_id}", logRequest(jwtService.jwtAuth(u.repository, updateListHandler))).Methods(http.MethodPut)
	r.HandleFunc("/todo/lists/{list_id}", logRequest(jwtService.jwtAuth(u.repository, deleteListHandler))).Methods(http.MethodDelete)
	r.HandleFunc("/todo/lists/{list_id}/tasks", logRequest(jwtService.jwtAuth(u.repository, createTaskHandler))).Methods(http.MethodPost)
	r.HandleFunc("/todo/lists/{list_id}/tasks/{task_id}", logRequest(jwtService.jwtAuth(u.repository, updateTaskHandler))).Methods(http.MethodPut)
	r.HandleFunc("/todo/lists/{list_id}/tasks/mark/{task_id}", logRequest(jwtService.jwtAuth(u.repository, markTaskHandler))).Methods(http.MethodPut)
	r.HandleFunc("/todo/lists/{list_id}/tasks/{task_id}", logRequest(jwtService.jwtAuth(u.repository, deleteTaskHandler))).Methods(http.MethodDelete)
	return r
}

func main() {
	users := NewInMemoryUserStorage()
	userService := UserService{repository: users}

	jwtService, jwtErr := NewJWTService("pubkey.rsa", "privkey.rsa")
	if jwtErr != nil {
		panic(jwtErr)
	}

	r := newLoggingRouter(&userService, jwtService)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods: []string{
			http.MethodGet, //http methods for your app
			http.MethodPost,
			http.MethodPut,
			http.MethodPatch,
			http.MethodDelete,
			http.MethodOptions,
			http.MethodHead,
		},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(r)

	srv := http.Server{
		Addr:    ":8080",
		Handler: handler,
	}

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)
	go func() {
		<-interrupt
		ctx, cancel := context.WithTimeout(context.Background(),
			5*time.Second)
		defer cancel()
		err := srv.Shutdown(ctx)
		if err != nil {
			return
		}
	}()
	log.Println("Server started, hit Ctrl+C to stop")
	err := srv.ListenAndServe()
	if err != nil {
		log.Println("Server exited with error:", err)
	}
	log.Println("Good bye :)")
}

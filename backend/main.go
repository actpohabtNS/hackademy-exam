package main

import (
	"context"
	"crypto/md5"
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

func createEnvVars() {
	_ = os.Setenv("CAKE_SUPERADMIN_EMAIL", "supadmin@mail.com")
	_ = os.Setenv("CAKE_SUPERADMIN_PASSWORD", "IamSuperadmin")
	_ = os.Setenv("CAKE_SUPERADMIN_CAKE", "bestManCake")
}

func processEnvVars(u *UserService) {
	passwordDigest := md5.New().Sum([]byte(os.Getenv("CAKE_SUPERADMIN_PASSWORD")))
	supadmin := User{
		Email:          os.Getenv("CAKE_SUPERADMIN_EMAIL"),
		PasswordDigest: string(passwordDigest),
		FavoriteCake:   os.Getenv("CAKE_SUPERADMIN_CAKE"),
	}
	_ = u.repository.Add(supadmin.Email, supadmin)
}

func newRouter(u *UserService, jwtService *JWTService) *mux.Router {
	createEnvVars()
	r := mux.NewRouter()

	r.HandleFunc("/user/signup", u.Register).Methods(http.MethodPost)
	r.HandleFunc("/user/signin", wrapJwt(jwtService, u.JWT)).Methods(http.MethodPost)
	processEnvVars(u)
	return r
}

func newLoggingRouter(u *UserService, jwtService *JWTService) *mux.Router {
	createEnvVars()
	r := mux.NewRouter()

	r.HandleFunc("/user/signup", logRequest(u.Register)).Methods(http.MethodPost)
	r.HandleFunc("/user/signin", logRequest(wrapJwt(jwtService, u.JWT))).Methods(http.MethodPost)
	processEnvVars(u)
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

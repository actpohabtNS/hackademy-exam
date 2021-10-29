package main

import (
	"crypto/md5"
	"encoding/json"
	"errors"
	"net/http"
	"net/mail"
)

type User struct {
	Email          string
	Banned         bool
	PasswordDigest string
	FavoriteCake   string
}
type UserRepository interface {
	Add(string, User) error
	Get(string) (User, error)
	Update(string, User) error
	Delete(string) (User, error)
}

type UserService struct {
	repository UserRepository
}
type UserRegisterParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func validateEmail(email string) error {
	if _, err := mail.ParseAddress(email); err != nil {
		return errors.New("must provide an email")
	}
	return nil
}

func validatePassword(password string) error {
	// 2. Password at least 8 symbols
	if len(password) < 8 {
		return errors.New("password must be at least 8 symbols")
	}
	return nil
}

func validateRegisterParams(p *UserRegisterParams) error {
	var err = validatePassword(p.Password)
	if err != nil {
		return err
	}

	err = validateEmail(p.Email)
	return err
}

func (u *UserService) Register(w http.ResponseWriter, r *http.Request) {
	params := &UserRegisterParams{}
	err := json.NewDecoder(r.Body).Decode(params)
	if err != nil {
		handleUnprocError(errors.New("could not read params"), w)
		return
	}

	if err := validateRegisterParams(params); err != nil {
		handleUnprocError(err, w)
		return
	}

	passwordDigest := md5.New().Sum([]byte(params.Password))
	newUser := User{
		Email:          params.Email,
		PasswordDigest: string(passwordDigest),
	}

	err = u.repository.Add(params.Email, newUser)
	if err != nil {
		handleUnprocError(err, w)
		return
	}
	w.WriteHeader(http.StatusCreated)
	_, _ = w.Write([]byte("registered"))
}

func handleUnprocError(err error, w http.ResponseWriter) {
	handleError(err, 422, w)
}

func handleUnauthError(err error, w http.ResponseWriter) {
	handleError(err, 401, w)
}

func handleError(err error, status int, w http.ResponseWriter) {
	w.WriteHeader(status)
	_, _ = w.Write([]byte(err.Error()))
}

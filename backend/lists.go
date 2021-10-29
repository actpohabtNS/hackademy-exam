package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
	"time"
)

type Task struct {
	Name        string    `json:"name"`
	Id          uint32    `json:"id"`
	CreatedAt   time.Time `json:"created_at"`
	Description string    `json:"description"`
}

type ListHead struct {
	Name string `json:"name"`
	Id   uint32 `json:"id"`
}

type List struct {
	Name      string `json:"name"`
	Tasks     []Task `json:"tasks"`
	Completed []Task `json:"completed"`
}

type listNameParams struct {
	Name string `json:"name"`
}

func createListHandler(w http.ResponseWriter, r *http.Request, u User, users UserRepository) {
	params := &listNameParams{}
	err := json.NewDecoder(r.Body).Decode(params)
	if err != nil {
		handleUnprocError(errors.New("could not read params"), w)
		return
	}

	newListId := uuid.New().ID()
	newListHead := ListHead{params.Name, newListId}
	newList := List{params.Name, []Task{}, []Task{}}

	u.IdToListHead[newListId] = &newListHead
	u.IdToList[newListId] = &newList

	err = users.Update(u.Email, u)
	if err != nil {
		handleUnprocError(err, w)
		return
	}

	w.WriteHeader(http.StatusCreated)
	bytes, _ := json.Marshal(newListHead)
	_, _ = w.Write(bytes)
}

func getListHandler(w http.ResponseWriter, r *http.Request, u User, _ UserRepository) {
	vars := mux.Vars(r)
	listIdStr, ok := vars["list_id"]
	if !ok {
		fmt.Println("list_id is missing in parameters")
	}
	u64, _ := strconv.ParseUint(listIdStr, 10, 32)
	listId := uint32(u64)

	list, exists := u.IdToList[listId]
	if !exists {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}

	w.WriteHeader(http.StatusOK)
	bytes, _ := json.Marshal(*list)
	_, _ = w.Write(bytes)
}

func updateListHandler(w http.ResponseWriter, r *http.Request, u User, users UserRepository) {
	params := &listNameParams{}
	err := json.NewDecoder(r.Body).Decode(params)
	if err != nil {
		handleUnprocError(errors.New("could not read params"), w)
		return
	}

	vars := mux.Vars(r)
	listIdStr, ok := vars["list_id"]
	if !ok {
		fmt.Println("list_id is missing in parameters")
	}
	u64, _ := strconv.ParseUint(listIdStr, 10, 32)
	listId := uint32(u64)

	_, exists := u.IdToList[listId]
	if !exists {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}

	u.IdToListHead[listId].Name = params.Name
	u.IdToList[listId].Name = params.Name

	err = users.Update(u.Email, u)
	if err != nil {
		handleUnprocError(err, w)
		return
	}

	w.WriteHeader(http.StatusOK)
	bytes, _ := json.Marshal(*u.IdToListHead[listId])
	_, _ = w.Write(bytes)
}

func deleteListHandler(w http.ResponseWriter, r *http.Request, u User, users UserRepository) {
	vars := mux.Vars(r)
	listIdStr, ok := vars["list_id"]
	if !ok {
		fmt.Println("list_id is missing in parameters")
	}
	u64, _ := strconv.ParseUint(listIdStr, 10, 32)
	listId := uint32(u64)

	_, exists := u.IdToList[listId]
	if !exists {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}

	delete(u.IdToListHead, listId)
	delete(u.IdToList, listId)

	err := users.Update(u.Email, u)
	if err != nil {
		handleUnprocError(err, w)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	_, _ = w.Write([]byte(""))
}

func getListHeadsHandler(w http.ResponseWriter, _ *http.Request, u User, _ UserRepository) {
	var listHeads []ListHead

	for _, listHead := range u.IdToListHead {
		listHeads = append(listHeads, *listHead)
	}

	w.WriteHeader(http.StatusOK)
	bytes, _ := json.Marshal(listHeads)
	_, _ = w.Write(bytes)
}

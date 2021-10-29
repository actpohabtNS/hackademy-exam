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

type taskParams struct {
	Name        string    `json:"name"`
	CreatedAt   time.Time `json:"created_at"`
	Description string    `json:"description"`
}

func createTaskHandler(w http.ResponseWriter, r *http.Request, u User, users UserRepository) {
	params := &taskParams{}
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

	newTaskId := uuid.New().ID()

	newTask := Task{
		Name:        params.Name,
		Id:          newTaskId,
		CreatedAt:   params.CreatedAt,
		Description: params.Description,
	}

	_, exists := u.IdToList[listId]
	if !exists {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}

	u.IdToList[listId].Tasks[newTaskId] = &newTask

	err = users.Update(u.Email, u)
	if err != nil {
		handleUnprocError(err, w)
		return
	}

	w.WriteHeader(http.StatusCreated)
	bytes, _ := json.Marshal(newTask)
	_, _ = w.Write(bytes)
}

type updateParams struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

func updateTaskHandler(w http.ResponseWriter, r *http.Request, u User, users UserRepository) {
	params := &updateParams{}
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
	u64l, _ := strconv.ParseUint(listIdStr, 10, 32)
	listId := uint32(u64l)

	list, lExists := u.IdToList[listId]
	if !lExists {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}

	taskIdStr, ok2 := vars["task_id"]
	if !ok2 {
		fmt.Println("list_id is missing in parameters")
	}
	u64t, _ := strconv.ParseUint(taskIdStr, 10, 32)
	taskId := uint32(u64t)

	task, tExists := &Task{}, false
	if params.Completed {
		task, tExists = list.Completed[taskId]
	} else {
		task, tExists = list.Tasks[taskId]
	}

	if !tExists {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}

	task.Name = params.Name
	task.Description = params.Description

	if params.Completed {
		list.Completed[taskId] = task
	} else {
		list.Tasks[taskId] = task
	}

	err = users.Update(u.Email, u)
	if err != nil {
		handleUnprocError(err, w)
		return
	}

	w.WriteHeader(http.StatusOK)
	bytes, _ := json.Marshal(*task)
	_, _ = w.Write(bytes)
}

type markParams struct {
	Completed bool `json:"completed"`
}

func markTaskHandler(w http.ResponseWriter, r *http.Request, u User, users UserRepository) {
	params := &markParams{}
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
	u64l, _ := strconv.ParseUint(listIdStr, 10, 32)
	listId := uint32(u64l)

	list, lExists := u.IdToList[listId]
	if !lExists {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}

	taskIdStr, ok2 := vars["task_id"]
	if !ok2 {
		fmt.Println("list_id is missing in parameters")
	}
	u64t, _ := strconv.ParseUint(taskIdStr, 10, 32)
	taskId := uint32(u64t)

	task, tExists := &Task{}, false
	if params.Completed { //task has been marked complete
		task, tExists = list.Tasks[taskId]

		if !tExists {
			w.WriteHeader(http.StatusUnprocessableEntity)
			return
		}

		list.Completed[taskId] = task
		delete(list.Tasks, taskId)
	} else { //task has been marked incomplete
		task, tExists = list.Completed[taskId]

		if !tExists {
			w.WriteHeader(http.StatusUnprocessableEntity)
			return
		}

		list.Tasks[taskId] = task
		delete(list.Completed, taskId)
	}

	err = users.Update(u.Email, u)
	if err != nil {
		handleUnprocError(err, w)
		return
	}

	w.WriteHeader(http.StatusOK)
	bytes, _ := json.Marshal(*task)
	_, _ = w.Write(bytes)
}
func deleteTaskHandler(w http.ResponseWriter, r *http.Request, u User, users UserRepository) {
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

	taskIdStr, ok2 := vars["task_id"]
	if !ok2 {
		fmt.Println("list_id is missing in parameters")
	}
	u64t, _ := strconv.ParseUint(taskIdStr, 10, 32)
	taskId := uint32(u64t)

	_, tExists := list.Completed[taskId]
	if !tExists {
		_, tExists = list.Tasks[taskId]
	}

	if !tExists {
		w.WriteHeader(http.StatusUnprocessableEntity)
		return
	}

	delete(list.Tasks, listId)
	delete(list.Completed, listId)

	err := users.Update(u.Email, u)
	if err != nil {
		handleUnprocError(err, w)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	_, _ = w.Write([]byte(""))
}

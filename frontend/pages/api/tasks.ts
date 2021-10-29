import axios from './axios';

import { setUpBearerHeader } from './auth';
import { task_T } from './taskTypes';

export async function createTask(listId: number, name: string, createdAt: number, description: string) {
  setUpBearerHeader(axios);

  try {
    const response = await axios.post(`/todo/lists/${listId}/tasks`, {
      name,
      createdAt,
      description
    });
    return response.data;

  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteTask(listId: number, taskId: number) {
  setUpBearerHeader(axios);

  try {
    const response = await axios.delete(`/todo/lists/${listId}/tasks/${taskId}`);
    return response.status;

  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateTask(listId: number, updatedTask: task_T, completed: boolean) {
  setUpBearerHeader(axios);

  try {
    const response = await axios.put(`/todo/lists/${listId}/tasks/${updatedTask.id}`, {
      name: updatedTask.name,
      description: updatedTask.description,
      completed
    });
    return response.status;

  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function markTask(listId: number, taskId: number, markCompleted: boolean) {
  setUpBearerHeader(axios);

  try {
    const response = await axios.put(`/todo/lists/${listId}/tasks/mark/${taskId}`, {
      completed: markCompleted
    });
    return response.status;

  } catch (error) {
    console.log(error);
    return false;
  }
}

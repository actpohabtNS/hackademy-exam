import axios from './axios';

import { setUpBearerHeader } from './auth';

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

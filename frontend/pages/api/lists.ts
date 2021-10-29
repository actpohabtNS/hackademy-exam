import axios from './axios';

import { setUpBearerHeader } from './auth';

export async function loadListHeads() {
  setUpBearerHeader(axios);

  try {
    const response = await axios.get('/todo/listHeads');
    return { status: response.status, data: response.data };

  } catch (error) {
    console.log(error);
    return { status: 401, data: null };
  }
}

export async function createList(name: string) {
  setUpBearerHeader(axios);

  try {
    const response = await axios.post('/todo/lists', {
      name
    });
    return response.data;

  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteList(id: number) {
  setUpBearerHeader(axios);

  try {
    const response = await axios.delete(`/todo/lists/${id}`);
    return response.status;

  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getList(id: number) {
  setUpBearerHeader(axios);

  try {
    const response = await axios.get(`/todo/lists/${id}`);
    return response.data;

  } catch (error) {
    console.log(error);
    return false;
  }
}

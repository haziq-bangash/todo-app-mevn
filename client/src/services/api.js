import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api";
const API_BASE_URL = 'https://todo-app-server-eosin.vercel.app/api';

export async function registerUser(userData) {
  return axios.post(`${API_BASE_URL}/users/register`, userData)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export async function loginUser(userData) {
  return axios.post(`${API_BASE_URL}/users/login`, userData)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export async function getTodos(token, userId) {
  return axios.get(`${API_BASE_URL}/todos`, {
      headers: {
        "x-access-token": token,
      },
      params: {
        userId: userId,
      },
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export async function createTodo(todo, token, userId) {
  return axios.post(`${API_BASE_URL}/todos`, todo, {
      headers: {
        "x-access-token": token,
      },
      params: {
        userId: userId,
      },
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export async function updateTodo(todo, token) {
  if (todo.completed) {
    todo.completed_time = Date.now();
  } else {
    todo.completed_time = null;
  }

  return axios.put(`${API_BASE_URL}/todos/${todo._id}`, todo, {
      headers: {
        "x-access-token": token,
      },
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export async function deleteTodo(id, token) {
  return axios.delete(`${API_BASE_URL}/todos/${id}`, {
      headers: {
        "x-access-token": token,
      },
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export async function deleteAllTodos(token, userId) {
  return axios.delete(`${API_BASE_URL}/todos/delete/all`, {
      headers: {
        "x-access-token": token,
      },
      params: {
        userId: userId,
      },
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

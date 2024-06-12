import axios from "axios";
import {
  CREATE_TODO,
  DELETE_TODO,
  LOGIN,
  MARK_TODO,
  REGISTER,
  TODO_LIST,
  EDIT_TODO,
  PATCH_TODO,
} from "./apiConstants.js";

export const login = async (data) => {
  try {
    return await axios.post(LOGIN, data);
  } catch (error) {
    console.error("API error during login:", error);
    throw error;
  }
};

export const register = async (data) => {
  try {
    return await axios.post(REGISTER, data);
  } catch (error) {
    console.error("API error during registration:", error);
    throw error;
  }
};

export const createTodoApi = async (data) => {
  let token = getToken();

  return axios.post(CREATE_TODO, data, {
    headers: {
      auth: token,
    },
  });
};

export const getTodoListApi = async (data) => {
  let token = getToken();

  return axios.get(TODO_LIST, {
    headers: {
      auth: token,
    },
  });
};

export const deleteTodoApi = async (data) => {
  let token = getToken();

  return axios.post(DELETE_TODO, data, {
    headers: {
      auth: token,
    },
  });
};

export const MarkTodoApi = async (data) => {
  let token = getToken();

  return axios.post(MARK_TODO, data, {
    headers: {
      auth: token,
    },
  });
};

export const EditTodoApi = async (data) => {
  let token = getToken();

  return axios.post(EDIT_TODO, data, {
    headers: {
      auth: token,
    },
  });
};

export const patchTodoApi = async (data) => {
  let token = getToken();

  return axios.patch(PATCH_TODO, data, {
    headers: {
      auth: token,
    },
  });
};

export function getToken() {
  let user = localStorage.getItem("user");
  if (!user) return;
  const userObj = JSON.parse(user);
  return userObj.token;
}

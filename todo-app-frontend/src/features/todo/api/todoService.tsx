import axios from "axios";
import { Task } from "../todoTypes";

const API_URL = "http://localhost:5000/api";

export const fetchTasks = async () => {
  const response = await axios.get<Task[]>(`${API_URL}/tasks`);
  return response.data;
};

export const createTask = async (task: Task) => {
  const response = await axios.post<Task>(`${API_URL}/tasks`, task);
  return response.data;
};

export const updateTaskStatus = async (task: Task) => {
  const response = await axios.patch<Task>(`${API_URL}/tasks/${task.id}`, task);
  return response.data;
};

export const fetchAssignees = async (apiKey: string) => {
  const response = await axios.get(`${API_URL}/assignees`, {
    params: { apiKey },
  });
  return response.data;
};

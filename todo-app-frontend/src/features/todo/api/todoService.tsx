import axios from "axios";
import { Assignee, Task } from "../todoTypes";

const API_URL = "http://localhost:5000/api";

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (
  taskId: number,
  updatedTask: Partial<Task>
): Promise<Task> => {
  const response = await axios.patch(`${API_URL}/tasks/${taskId}`, updatedTask);
  return response.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await axios.delete(`${API_URL}/tasks/${taskId}`);
};

export const fetchAssignees = async (apiKey: string): Promise<Assignee[]> => {
  const response = await axios.get(`${API_URL}/assignees`, {
    params: { apiKey },
  });
  return response.data;
};

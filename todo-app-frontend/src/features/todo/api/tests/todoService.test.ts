import axios from 'axios';
import { Assignee, Task } from '../../todoTypes';
import { createTask, deleteTask, fetchAssignees, fetchTasks, updateTask } from '../todoService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Todo API Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tasks successfully', async () => {
    const tasks: Task[] = [{ id: 1, title: 'Task 1', assigneeId: '1', estimate: 5, status: 'TODO' }];
    mockedAxios.get.mockResolvedValue({ data: tasks });

    const result = await fetchTasks();
    expect(result).toEqual(tasks);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/tasks');
  });

  it('should create a new task successfully', async () => {
    const task: Partial<Task> = { title: 'New Task', assigneeId: '1', estimate: 5, status: 'TODO' };
    const createdTask: Task = { id: 1, title: task.title as string, assigneeId: task.assigneeId as string, estimate: task.estimate as number, status: task.status as 'TODO' | 'DONE' };
    mockedAxios.post.mockResolvedValue({ data: createdTask });

    const result = await createTask(task);
    expect(result).toEqual(createdTask);
    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/api/tasks', task);
  });

  it('should update a task successfully', async () => {
    const taskId = 1;
    const updatedTask: Partial<Task> = { title: 'Updated Task' };
    const responseTask: Task = { id: taskId, title: updatedTask.title as string, assigneeId: '1', estimate: 5, status: 'TODO' };
    mockedAxios.patch.mockResolvedValue({ data: responseTask });

    const result = await updateTask(taskId, updatedTask);
    expect(result).toEqual(responseTask);
    expect(mockedAxios.patch).toHaveBeenCalledWith(`http://localhost:5000/api/tasks/${taskId}`, updatedTask);
  });

  it('should delete a task successfully', async () => {
    const taskId = 1;
    mockedAxios.delete.mockResolvedValue({});

    await deleteTask(taskId);
    expect(mockedAxios.delete).toHaveBeenCalledWith(`http://localhost:5000/api/tasks/${taskId}`);
  });

  it('should fetch assignees successfully', async () => {
    const apiKey = 'test';
    const assignees: Assignee[] = [{ id: '1', name: 'John Doe' }];
    mockedAxios.get.mockResolvedValue({ data: assignees });

    const result = await fetchAssignees(apiKey);
    expect(result).toEqual(assignees);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/assignees', { params: { apiKey } });
  });
});

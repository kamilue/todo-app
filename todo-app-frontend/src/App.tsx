import React, { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchAssignees,
  fetchTasks,
  updateTaskStatus,
} from "./features/todo/api/todoService";
import TaskForm from "./features/todo/components/TaskForm";
import TaskList from "./features/todo/components/TaskList";
import { Assignee, Task } from "./features/todo/todoTypes";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [apiKey, setApiKey] = useState("your-api-key");

  useEffect(() => {
    const loadTasks = async () => {
      const tasks = await fetchTasks();
      setTasks(tasks);
    };
    const loadAssignees = async () => {
      const assignees = await fetchAssignees(apiKey);
      setAssignees(assignees);
    };
    loadTasks();
    loadAssignees();
  }, [apiKey]);

  const handleTaskSubmit = async (task: Partial<Task>) => {
    const newTask = await createTask(task);
    setTasks([...tasks, newTask]);
  };

  const handleStatusChange = async (
    taskId: number,
    status: "TODO" | "DONE"
  ) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status };
      const newTask = await updateTaskStatus(taskId, updatedTask);
      setTasks(tasks.map((task) => (task.id === taskId ? newTask : task)));
    }
  };

  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div>
      <TaskForm onTaskSubmit={handleTaskSubmit} assignees={assignees} />
      <TaskList
        tasks={tasks}
        assignees={assignees}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;

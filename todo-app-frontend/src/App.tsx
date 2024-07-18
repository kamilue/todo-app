import React, { useEffect, useState } from "react";
import {
  createTask,
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

  const handleTaskSubmit = async (task: Task) => {
    const newTask = await createTask(task);
    setTasks([...tasks, newTask]);
  };

  const handleStatusChange = async (task: Task) => {
    const updatedTask = await updateTaskStatus(task);
    setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
  };

  return (
    <div>
      <TaskForm onTaskSubmit={handleTaskSubmit} />
      <TaskList tasks={tasks} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default App;

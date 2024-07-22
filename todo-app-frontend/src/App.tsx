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
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [completionDate, setCompletionDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      const tasks = await fetchTasks();
      setTasks(tasks);
      calculateCompletionDate(tasks);
    };
    const loadAssignees = async () => {
      const assignees = await fetchAssignees(apiKey);
      setAssignees(assignees);
    };
    loadTasks();
    loadAssignees();
  }, [apiKey]);

  const calculateCompletionDate = (tasks: Task[]) => {
    let totalHours = 0;
    tasks.forEach((task) => {
      totalHours += task.estimate;
    });

    const now = new Date();
    const completionDate = new Date(now.setHours(now.getHours() + totalHours));
    setCompletionDate(completionDate);
  };

  const handleTaskSubmit = async (task: Partial<Task>) => {
    if (taskToEdit) {
      const updatedTask = { ...taskToEdit, ...task };
      const newTask = await updateTaskStatus(taskToEdit.id!, updatedTask);
      setTasks(tasks.map((t) => (t.id === newTask.id ? newTask : t)));
      setTaskToEdit(null);
    } else {
      const newTask = await createTask(task);
      setTasks([...tasks, newTask]);
    }
    calculateCompletionDate(tasks);
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
    calculateCompletionDate(tasks);
  };

  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
    calculateCompletionDate(tasks);
  };

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
  };

  return (
    <div>
      <TaskForm
        onTaskSubmit={handleTaskSubmit}
        assignees={assignees}
        taskToEdit={taskToEdit}
      />
      <TaskList
        tasks={tasks}
        assignees={assignees}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <div>
        <h2>Estimation Summary</h2>
        {completionDate ? (
          <p>Estimated completion date: {completionDate.toLocaleString()}</p>
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default App;

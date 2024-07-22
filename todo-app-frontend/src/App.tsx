import { Global } from "@emotion/react";
import { Box, Container, CssBaseline, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchAssignees,
  fetchTasks,
  updateTaskStatus,
} from "./features/todo/api/todoService";
import { TaskForm, TaskList } from "./features/todo/components";
import { Assignee, Task } from "./features/todo/todoTypes";
import globalStyles from "./styles/globalStyles";
import theme from "./styles/theme";

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
      if (task.status === "TODO") {
        totalHours += task.estimate;
      }
    });

    const now = new Date();
    const completionDate = new Date(now.setHours(now.getHours() + totalHours));
    setCompletionDate(completionDate);
  };

  const handleTaskSubmit = async (task: Partial<Task>) => {
    if (taskToEdit) {
      const updatedTask = { ...taskToEdit, ...task };
      await updateTaskStatus(taskToEdit.id!, updatedTask);
    } else {
      await createTask(task);
    }
    const updatedTasks = await fetchTasks();
    setTasks(updatedTasks);
    calculateCompletionDate(updatedTasks);
    setTaskToEdit(null);
  };

  const handleStatusChange = async (
    taskId: number,
    status: "TODO" | "DONE"
  ) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status };
      await updateTaskStatus(taskId, updatedTask);
    }
    const updatedTasks = await fetchTasks();
    setTasks(updatedTasks);
    calculateCompletionDate(updatedTasks);
  };

  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
    const updatedTasks = await fetchTasks();
    setTasks(updatedTasks);
    calculateCompletionDate(updatedTasks);
  };

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
  };

  const handleCancelEdit = () => {
    setTaskToEdit(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <CssBaseline />
      <Container>
        <Box sx={{ marginTop: 4 }}>
          <TaskForm
            onTaskSubmit={handleTaskSubmit}
            assignees={assignees}
            taskToEdit={taskToEdit}
            onCancelEdit={handleCancelEdit}
          />
          <TaskList
            tasks={tasks}
            assignees={assignees}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isEditing={!!taskToEdit}
          />
          {tasks.some((task) => task.status === "TODO") && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h4">Estimation Summary</Typography>
              {completionDate ? (
                <Typography>
                  Estimated completion date: {completionDate.toLocaleString()}
                </Typography>
              ) : (
                <Typography>No tasks available</Typography>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;

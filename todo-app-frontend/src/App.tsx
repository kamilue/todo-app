import { Global } from "@emotion/react";
import {
  Box,
  Button,
  Collapse,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createTask,
  deleteTask,
  fetchAssignees,
  fetchTasks,
  updateTask,
} from "./features/todo/api/todoService";
import { TaskForm, TaskList } from "./features/todo/components";
import { Assignee, Task } from "./features/todo/todoTypes";
import globalStyles from "./styles/globalStyles";
import theme from "./styles/theme";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [apiKey, setApiKey] = useState("test");
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [completionDate, setCompletionDate] = useState<Date | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);

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
    try {
      if (taskToEdit) {
        const updatedTask = { ...taskToEdit, ...task };
        await updateTask(taskToEdit.id!, updatedTask);
      } else {
        await createTask(task);
      }
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
      calculateCompletionDate(updatedTasks);
      setTaskToEdit(null);
      setFormOpen(false);
    } catch (error: any) {
      toast.error(
        `Error: ${error.response.data.message} Assignee has only ${error.response.data.availableHours} available hours`
      );
    }
  };

  const handleStatusChange = async (
    taskId: number,
    status: "TODO" | "DONE"
  ) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, status };
      await updateTask(taskId, updatedTask);
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
    setFormOpen(true);
  };

  const handleCancelEdit = () => {
    setTaskToEdit(null);
    setFormOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container className="app-container">
        {tasks.some((task) => task.status === "TODO") ? (
          <Box sx={{ marginTop: 4, textAlign: "center" }}>
            <Typography variant="h4">Estimation Summary</Typography>
            {completionDate ? (
              <Typography>
                Estimated completion date: {completionDate.toLocaleString()}
              </Typography>
            ) : (
              <Typography>No tasks available</Typography>
            )}
            {!formOpen && (
              <Button
                variant="contained"
                sx={{ marginTop: 2 }}
                onClick={() => setFormOpen(true)}
              >
                Open Add Task Form
              </Button>
            )}
          </Box>
        ) : (
          !formOpen && (
            <Box sx={{ marginTop: 4, textAlign: "center" }}>
              <Button
                variant="contained"
                sx={{ marginTop: 2 }}
                onClick={() => setFormOpen(true)}
              >
                Open Add Task Form
              </Button>
            </Box>
          )
        )}
        <Collapse in={formOpen}>
          <TaskForm
            onTaskSubmit={handleTaskSubmit}
            assignees={assignees}
            taskToEdit={taskToEdit}
            onCancelEdit={handleCancelEdit}
          />
        </Collapse>
        <Box className="main-content" sx={{ marginTop: 4 }}>
          <Box className="tasks-container">
            <TaskList
              tasks={tasks}
              assignees={assignees}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isEditing={!!taskToEdit}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;

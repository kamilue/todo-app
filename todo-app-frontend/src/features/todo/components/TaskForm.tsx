import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Assignee, Task } from "../todoTypes";

interface TaskFormProps {
  onTaskSubmit: (task: Partial<Task>) => void;
  assignees: Assignee[];
  taskToEdit: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onTaskSubmit,
  assignees,
  taskToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [estimate, setEstimate] = useState("");
  const [status, setStatus] = useState<"TODO" | "DONE">("TODO");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setAssigneeId(
        taskToEdit.assigneeId ? taskToEdit.assigneeId.toString() : ""
      );
      setEstimate(taskToEdit.estimate.toString());
      setStatus(taskToEdit.status);
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTaskSubmit({
      title,
      assigneeId: assigneeId ? parseInt(assigneeId) : undefined,
      estimate: Number(estimate),
      status,
    });
    setTitle("");
    setAssigneeId("");
    setEstimate("");
    setStatus("TODO");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="assignee-label">Select Assignee</InputLabel>
        <Select
          labelId="assignee-label"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          label="Select Assignee"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {assignees.map((assignee) => (
            <MenuItem key={assignee.id} value={assignee.id}>
              {assignee.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Estimate (hours)"
        type="number"
        value={estimate}
        onChange={(e) => setEstimate(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          value={status}
          onChange={(e) => setStatus(e.target.value as "TODO" | "DONE")}
          label="Status"
        >
          <MenuItem value="TODO">TODO</MenuItem>
          <MenuItem value="DONE">DONE</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        {taskToEdit ? "Edit Task" : "Add Task"}
      </Button>
    </Box>
  );
};

export default TaskForm;

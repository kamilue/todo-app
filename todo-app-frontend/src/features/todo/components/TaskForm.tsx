import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as yup from "yup";
import { Assignee, Task } from "../todoTypes";

interface TaskFormProps {
  onTaskSubmit: (task: Partial<Task>) => void;
  assignees: Assignee[];
  taskToEdit: Task | null;
  onCancelEdit: () => void;
}

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  estimate: yup.number().required("Estimate is required").min(0),
  status: yup.string().required("Status is required"),
});

const TaskForm: React.FC<TaskFormProps> = ({
  onTaskSubmit,
  assignees,
  taskToEdit,
  onCancelEdit,
}) => {
  const formik = useFormik({
    initialValues: {
      title: "",
      assigneeId: "",
      estimate: "",
      status: "TODO",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onTaskSubmit({
        title: values.title,
        assigneeId: values.assigneeId ? parseInt(values.assigneeId) : undefined,
        estimate: Number(values.estimate),
        status: values.status as "TODO" | "DONE",
      });
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      formik.setValues({
        title: taskToEdit.title,
        assigneeId: taskToEdit.assigneeId?.toString() || "",
        estimate: taskToEdit.estimate.toString(),
        status: taskToEdit.status,
      });
    } else {
      formik.resetForm();
    }
  }, [taskToEdit]);

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: "15px", mt: 3 }}>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="Task Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          fullWidth
          margin="normal"
        />
        <FormControl
          fullWidth
          margin="normal"
          error={formik.touched.assigneeId && Boolean(formik.errors.assigneeId)}
        >
          <InputLabel id="assignee-label">Select Assignee</InputLabel>
          <Select
            labelId="assignee-label"
            name="assigneeId"
            value={formik.values.assigneeId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
          name="estimate"
          value={formik.values.estimate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.estimate && Boolean(formik.errors.estimate)}
          helperText={formik.touched.estimate && formik.errors.estimate}
          fullWidth
          margin="normal"
        />
        <FormControl
          fullWidth
          margin="normal"
          error={formik.touched.status && Boolean(formik.errors.status)}
        >
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Status"
          >
            <MenuItem value="TODO">TODO</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="submit" variant="contained" color="primary">
            {taskToEdit ? "Edit Task" : "Add Task"}
          </Button>
          <IconButton
            size="small"
            sx={{
              background: "linear-gradient(45deg, #8e2de2 30%, #4a00e0 90%)",
              color: "#fff",
            }}
            onClick={onCancelEdit}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskForm;

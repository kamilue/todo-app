import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { Assignee, Task } from "../todoTypes";

interface TaskListProps {
  tasks: Task[];
  assignees: Assignee[];
  onStatusChange: (taskId: number, status: "TODO" | "DONE") => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  isEditing: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  assignees,
  onStatusChange,
  onDelete,
  onEdit,
  isEditing,
}) => {
  const getAssigneeName = (assigneeId: string) => {
    const assignee = assignees.find((a) => a.id === assigneeId);
    return assignee ? assignee.name : "Unassigned";
  };

  const tasksByStatus = (status: "TODO" | "DONE") => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <Card key={task.id} sx={{ marginBottom: 2, position: "relative" }}>
          <CardContent>
            <Typography variant="h5">{task.title}</Typography>
            <Typography>Status: {task.status}</Typography>
            <Typography>Estimate: {task.estimate} hours</Typography>
            <Typography>
              Assignee: {getAssigneeName(task.assigneeId)}
            </Typography>
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <IconButton
                size="small"
                sx={{
                  mr: 0.5,
                  background:
                    "linear-gradient(45deg, #8e2de2 30%, #4a00e0 90%)",
                  color: "#fff",
                }}
                onClick={() =>
                  onStatusChange(
                    task.id!,
                    task.status === "TODO" ? "DONE" : "TODO"
                  )
                }
                disabled={isEditing}
              >
                {task.status === "TODO" ? (
                  <CheckBoxOutlineBlankIcon />
                ) : (
                  <CheckBoxIcon />
                )}
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  mr: 0.5,
                  ml: 0.5,
                  background:
                    "linear-gradient(45deg, #8e2de2 30%, #4a00e0 90%)",
                  color: "#fff",
                }}
                onClick={() => onEdit(task)}
                disabled={isEditing}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                id="delete"
                size="small"
                sx={{
                  ml: 0.5,
                  background:
                    "linear-gradient(45deg, #8e2de2 30%, #4a00e0 90%)",
                  color: "#fff",
                }}
                onClick={() => onDelete(task.id!)}
                disabled={isEditing}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} className="tasks-list">
        {tasksByStatus("TODO")}
      </Grid>
      <Grid item xs={6} className="tasks-list">
        {tasksByStatus("DONE")}
      </Grid>
    </Grid>
  );
};

export default TaskList;

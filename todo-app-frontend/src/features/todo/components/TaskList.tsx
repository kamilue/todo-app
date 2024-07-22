import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { Assignee, Task } from "../todoTypes";

interface TaskListProps {
  tasks: Task[];
  assignees: Assignee[];
  onStatusChange: (taskId: number, status: "TODO" | "DONE") => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  assignees,
  onStatusChange,
  onDelete,
  onEdit,
}) => {
  const getAssigneeName = (assigneeId: number | undefined) => {
    const assignee = assignees.find((a) => parseInt(a.id) === assigneeId);
    return assignee ? assignee.name : "Unassigned";
  };

  const tasksByStatus = (status: "TODO" | "DONE") => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <Card key={task.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h5">{task.title}</Typography>
            <Typography>Status: {task.status}</Typography>
            <Typography>Estimate: {task.estimate} hours</Typography>
            <Typography>
              Assignee: {getAssigneeName(task.assigneeId)}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
              <Button
                variant="contained"
                onClick={() =>
                  onStatusChange(
                    task.id!,
                    task.status === "TODO" ? "DONE" : "TODO"
                  )
                }
              >
                {task.status === "TODO" ? "Mark as Done" : "Mark as TODO"}
              </Button>
              <Button variant="contained" onClick={() => onEdit(task)}>
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onDelete(task.id!)}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ));
  };

  return (
    <Box>
      <Typography variant="h4">
        TODO Tasks ({tasks.filter((task) => task.status === "TODO").length})
      </Typography>
      {tasksByStatus("TODO")}
      <Typography variant="h4">
        DONE Tasks ({tasks.filter((task) => task.status === "DONE").length})
      </Typography>
      {tasksByStatus("DONE")}
    </Box>
  );
};

export default TaskList;

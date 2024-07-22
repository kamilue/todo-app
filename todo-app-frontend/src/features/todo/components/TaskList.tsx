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
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>Status: {task.status}</p>
          <p>Estimate: {task.estimate} hours</p>
          <p>Assignee: {getAssigneeName(task.assigneeId)}</p>
          <button
            onClick={() => {
              if (task.id !== undefined) {
                onStatusChange(
                  task.id,
                  task.status === "TODO" ? "DONE" : "TODO"
                );
              }
            }}
          >
            {task.status === "TODO" ? "Mark as Done" : "Mark as TODO"}
          </button>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button
            onClick={() => {
              if (task.id !== undefined) {
                onDelete(task.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      ));
  };

  return (
    <div>
      <h2>
        TODO Tasks ({tasks.filter((task) => task.status === "TODO").length})
      </h2>
      {tasksByStatus("TODO")}
      <h2>
        DONE Tasks ({tasks.filter((task) => task.status === "DONE").length})
      </h2>
      {tasksByStatus("DONE")}
    </div>
  );
};

export default TaskList;

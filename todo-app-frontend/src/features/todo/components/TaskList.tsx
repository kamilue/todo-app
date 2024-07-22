import React from "react";
import { Assignee, Task } from "../todoTypes";

interface TaskListProps {
  tasks: Task[];
  assignees: Assignee[];
  onStatusChange: (taskId: number, status: "TODO" | "DONE") => void;
  onDelete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  assignees,
  onStatusChange,
  onDelete,
}) => {
  const getAssigneeName = (assigneeId: number | undefined) => {
    const assignee = assignees.find((a) => parseInt(a.id) === assigneeId);
    return assignee ? assignee.name : "Unassigned";
  };

  return (
    <div>
      <h2>Tasks</h2>
      {tasks.map((task) => (
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
      ))}
    </div>
  );
};

export default TaskList;

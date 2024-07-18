import React, { useState } from "react";
import { Task } from "../todoTypes";

interface TaskFormProps {
  onTaskSubmit: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskSubmit }) => {
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState<number | string>("");
  const [estimate, setEstimate] = useState<number | string>("");
  const [status, setStatus] = useState<"TODO" | "DONE">("TODO");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTaskSubmit({
      title,
      assigneeId: Number(assigneeId),
      estimate: Number(estimate),
      status,
    });
    setTitle("");
    setAssigneeId("");
    setEstimate("");
    setStatus("TODO");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Assignee ID"
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Estimate (hours)"
        value={estimate}
        onChange={(e) => setEstimate(e.target.value)}
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "TODO" | "DONE")}
      >
        <option value="TODO">TODO</option>
        <option value="DONE">DONE</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;

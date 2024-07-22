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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.target.value)}
      >
        <option value="">Select Assignee</option>
        {assignees.map((assignee) => (
          <option key={assignee.id} value={assignee.id}>
            {assignee.name}
          </option>
        ))}
      </select>
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
      <button type="submit">{taskToEdit ? "Edit Task" : "Add Task"}</button>
    </form>
  );
};

export default TaskForm;

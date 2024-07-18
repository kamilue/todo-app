import React from "react";
import { Task } from "../todoTypes";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onStatusChange }) => {
  return (
    <div>
      <h2>Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.status}</p>
          {task.id !== undefined && (
            <button onClick={() => onStatusChange({ ...task, status: "DONE" })}>
              Mark as Done
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;

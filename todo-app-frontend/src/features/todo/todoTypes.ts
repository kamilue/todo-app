export interface Task {
  id?: number;
  title: string;
  assigneeId: string;
  estimate: number;
  status: 'TODO' | 'DONE';
}

export interface Assignee {
  id: string;
  name: string;
}

export interface Timesheet {
  assigneeId: number;
  availableHours: TimeRange[];
}

export interface TimeRange {
  start: string;
  end: string;
}

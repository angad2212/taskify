
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  members: User[];
  tasks: Task[];
  createdBy: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'reviewed';
  assignedTo: string;
  projectId: string;
  deadline: Date;
  skills: string[];
  score?: number;
  reviewedBy?: string;
  createdAt: Date;
}

export interface Analytics {
  userId: string;
  userName: string;
  tasksCompleted: number;
  tasksReviewed: number;
  averageScore: number;
}

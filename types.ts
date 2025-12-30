export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  createdAt: string;
}

export interface AppState {
  users: User[];
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  currentUser: User | null;
}

// Responses for AI
export interface AIPlanResponse {
  tasks: {
    title: string;
    description: string;
    status: TaskStatus;
  }[];
}
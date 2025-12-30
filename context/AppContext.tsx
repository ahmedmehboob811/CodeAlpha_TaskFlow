import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, User, Project, Task, Comment, TaskStatus } from '../types';

// Initial Mock Data to seed the "DB"
const SEED_USERS = [
  { id: 'u1', name: 'Alice Engineer', email: 'alice@tech.com', password: 'password123', avatar: 'https://ui-avatars.com/api/?name=Alice+Engineer&background=0D8ABC&color=fff' },
  { id: 'u2', name: 'Bob Manager', email: 'bob@tech.com', password: 'password123', avatar: 'https://ui-avatars.com/api/?name=Bob+Manager&background=random' },
];

const MOCK_PROJECTS: Project[] = [
  { id: 'p1', title: 'Website Redesign', description: 'Overhaul the company homepage with new branding.', ownerId: 'u2', createdAt: new Date().toISOString() },
];

const MOCK_TASKS: Task[] = [
  { id: 't1', projectId: 'p1', title: 'Setup React Repo', description: 'Initialize project with Vite and Tailwind.', status: TaskStatus.DONE, assigneeId: 'u1', createdAt: new Date().toISOString() },
  { id: 't2', projectId: 'p1', title: 'Design Homepage', description: 'Create Figma mockups for the landing page.', status: TaskStatus.IN_PROGRESS, assigneeId: 'u2', createdAt: new Date().toISOString() },
  { id: 't3', projectId: 'p1', title: 'Implement Header', description: 'Build responsive header component.', status: TaskStatus.TODO, assigneeId: 'u1', createdAt: new Date().toISOString() },
];

const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', taskId: 't2', userId: 'u2', text: 'Make sure to use the new logo assets.', createdAt: new Date().toISOString() }
];

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthLoading: boolean;
  authError: string | null;
  addProject: (title: string, description: string) => Project;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'projectId'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskAssignee: (taskId: string, assigneeId: string) => void;
  updateTaskDescription: (taskId: string, description: string) => void;
  addComment: (taskId: string, text: string) => void;
  deleteTask: (taskId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tf_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // --- Data State ---
  const [users, setUsers] = useState<User[]>([]);
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('tf_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tf_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('tf_comments');
    return saved ? JSON.parse(saved) : MOCK_COMMENTS;
  });

  // --- Initialization & Persistence ---
  
  // Init "DB" for users
  useEffect(() => {
    const storedUsers = localStorage.getItem('tf_users_db');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Seed DB
      localStorage.setItem('tf_users_db', JSON.stringify(SEED_USERS));
      setUsers(SEED_USERS);
    }
  }, []);

  useEffect(() => localStorage.setItem('tf_projects', JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem('tf_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('tf_comments', JSON.stringify(comments)), [comments]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('tf_user', JSON.stringify(currentUser));
    else localStorage.removeItem('tf_user');
  }, [currentUser]);

  // --- Auth Actions ---

  const login = async (email: string, pass: string) => {
    setIsAuthLoading(true);
    setAuthError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const storedUsers = JSON.parse(localStorage.getItem('tf_users_db') || '[]');
      const user = storedUsers.find((u: any) => u.email === email && u.password === pass);

      if (user) {
        // Remove password before setting state
        const { password, ...safeUser } = user;
        setCurrentUser(safeUser);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsAuthLoading(true);
    setAuthError(null);

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const storedUsers = JSON.parse(localStorage.getItem('tf_users_db') || '[]');
      if (storedUsers.some((u: any) => u.email === email)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password: pass, // In a real app, never store plain text
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };

      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem('tf_users_db', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      const { password, ...safeUser } = newUser;
      setCurrentUser(safeUser);

    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- Data Actions ---

  const addProject = (title: string, description: string) => {
    if (!currentUser) throw new Error("Must be logged in");
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      ownerId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const addTask = (projectId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'projectId'>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      projectId,
      createdAt: new Date().toISOString(),
      ...taskData
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const updateTaskAssignee = (taskId: string, assigneeId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assigneeId } : t));
  };
  
  const updateTaskDescription = (taskId: string, description: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, description } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addComment = (taskId: string, text: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      userId: currentUser.id,
      text,
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
  };

  return (
    <AppContext.Provider value={{
      users,
      projects,
      tasks,
      comments,
      currentUser,
      isAuthLoading,
      authError,
      login,
      register,
      logout,
      addProject,
      addTask,
      updateTaskStatus,
      updateTaskAssignee,
      updateTaskDescription,
      addComment,
      deleteTask
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
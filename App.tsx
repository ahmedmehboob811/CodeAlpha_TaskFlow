import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { 
  Plus, 
  Kanban, 
  LogOut, 
  Search, 
  Bell
} from 'lucide-react';
import { TaskStatus, Task } from './types';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import Button from './components/Button';
import AuthPage from './components/AuthPage';

const App: React.FC = () => {
  const { 
    users,
    projects, 
    tasks, 
    comments, 
    currentUser, 
    logout,
    addProject,
    addTask,
    updateTaskStatus,
    updateTaskAssignee,
    updateTaskDescription,
    addComment,
    deleteTask
  } = useApp();

  // State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // New Project Form State
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Auth Guard
  if (!currentUser) {
    return <AuthPage />;
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);

  // Handlers
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle) return;

    try {
      // Create project
      const project = addProject(newProjectTitle, newProjectDesc);
      
      setSelectedProjectId(project.id);
      setIsProjectModalOpen(false);
      setNewProjectTitle('');
      setNewProjectDesc('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = (status: TaskStatus) => {
    if (!selectedProjectId) return;
    addTask(selectedProjectId, {
      title: 'New Task',
      description: 'Click to edit details...',
      status,
      assigneeId: currentUser.id
    });
  };

  const columns = [
    { id: TaskStatus.TODO, label: 'To Do', color: 'bg-gray-100', dot: 'bg-gray-400' },
    { id: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-50', dot: 'bg-blue-500' },
    { id: TaskStatus.DONE, label: 'Done', color: 'bg-green-50', dot: 'bg-green-500' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-4 flex items-center gap-2 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Kanban size={18} />
          </div>
          <span className="font-bold text-gray-800 tracking-tight">TaskFlow</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</h3>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-0.5 px-2">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedProjectId === project.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="truncate">{project.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
             <div className="md:hidden">
                <Kanban size={24} className="text-blue-600" />
             </div>
            <h1 className="text-xl font-bold text-gray-900 truncate">{selectedProject?.title}</h1>
            <div className="hidden md:block h-4 w-px bg-gray-300 mx-2"></div>
            <div className="hidden md:flex -space-x-2">
              {users.slice(0, 5).map(u => (
                <img 
                  key={u.id} 
                  src={u.avatar} 
                  className="w-8 h-8 rounded-full border-2 border-white" 
                  title={u.name}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
               <Search size={20} />
             </button>
             <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </header>

        {/* Board Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          <div className="h-full flex gap-6 min-w-[1000px]">
            {columns.map(col => (
              <div key={col.id} className="w-80 flex flex-col h-full bg-gray-100/50 rounded-xl border border-gray-200/60">
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`}></div>
                    <span className="font-semibold text-gray-700">{col.label}</span>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {projectTasks.filter(t => t.status === col.id).length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleCreateTask(col.id)}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {projectTasks
                    .filter(t => t.status === col.id)
                    .map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        assignee={users.find(u => u.id === task.assigneeId)}
                        commentCount={comments.filter(c => c.taskId === task.id).length}
                        onClick={() => setActiveTask(task)}
                      />
                    ))
                  }
                  
                  {projectTasks.filter(t => t.status === col.id).length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm">
                      <p>No tasks yet</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      {activeTask && (
        <TaskModal
          task={activeTask}
          users={users}
          currentUser={currentUser}
          comments={comments.filter(c => c.taskId === activeTask.id)}
          onClose={() => setActiveTask(null)}
          onUpdateStatus={(status) => updateTaskStatus(activeTask.id, status)}
          onUpdateAssignee={(uid) => updateTaskAssignee(activeTask.id, uid)}
          onUpdateDescription={(desc) => updateTaskDescription(activeTask.id, desc)}
          onAddComment={(text) => addComment(activeTask.id, text)}
          onDelete={() => {
            deleteTask(activeTask.id);
            setActiveTask(null);
          }}
        />
      )}

      {/* New Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    autoFocus
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Q4 Marketing Campaign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                    placeholder="Briefly describe the goals..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsProjectModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!newProjectTitle}
                >
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
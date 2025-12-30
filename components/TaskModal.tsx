import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Comment, User } from '../types';
import { X, Trash2, User as UserIcon, Calendar, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface TaskModalProps {
  task: Task;
  users: User[];
  comments: Comment[];
  currentUser: User | null;
  onClose: () => void;
  onUpdateStatus: (status: TaskStatus) => void;
  onUpdateAssignee: (userId: string) => void;
  onUpdateDescription: (desc: string) => void;
  onAddComment: (text: string) => void;
  onDelete: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  users,
  comments,
  currentUser,
  onClose,
  onUpdateStatus,
  onUpdateAssignee,
  onUpdateDescription,
  onAddComment,
  onDelete,
}) => {
  const [commentText, setCommentText] = useState('');
  const [description, setDescription] = useState(task.description);

  // Sync description if task changes externally
  useEffect(() => {
    setDescription(task.description);
  }, [task.description]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  const statusColors = {
    [TaskStatus.TODO]: 'bg-gray-100 text-gray-700',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
    [TaskStatus.DONE]: 'bg-green-100 text-green-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
             <select 
               value={task.status}
               onChange={(e) => onUpdateStatus(e.target.value as TaskStatus)}
               className={`px-3 py-1.5 rounded-md text-sm font-medium border-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer ${statusColors[task.status]}`}
             >
               <option value={TaskStatus.TODO}>To Do</option>
               <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
               <option value={TaskStatus.DONE}>Done</option>
             </select>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{task.title}</h2>
                <div className="relative group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={() => onUpdateDescription(description)}
                    className="w-full min-h-[120px] p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-y text-gray-700 text-sm leading-relaxed"
                    placeholder="Add a more detailed description..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-gray-100 p-1 rounded-md">
                    <CheckCircle2 size={14} className="text-gray-500" />
                  </span>
                  Activity
                </h3>
                
                <div className="space-y-4 mb-6">
                  {comments.map(comment => {
                    const user = users.find(u => u.id === comment.userId);
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <img 
                          src={user?.avatar || `https://ui-avatars.com/api/?name=User`} 
                          alt="avatar" 
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{user?.name || 'Unknown User'}</span>
                            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg rounded-tl-none inline-block">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSubmitComment} className="flex gap-3 items-start">
                  <img 
                    src={currentUser?.avatar || `https://ui-avatars.com/api/?name=Me`} 
                    alt="Current User" 
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!commentText.trim()}
                      className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Assignee
                </label>
                <div className="space-y-2">
                  {users.map(user => (
                    <button
                      key={user.id}
                      onClick={() => onUpdateAssignee(user.id)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                        task.assigneeId === user.id 
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <img src={user.avatar} className="w-6 h-6 rounded-full" />
                      <span>{user.name}</span>
                      {task.assigneeId === user.id && <CheckCircle2 size={14} className="ml-auto" />}
                    </button>
                  ))}
                  <button
                    onClick={() => onUpdateAssignee('')}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                      !task.assigneeId
                        ? 'bg-gray-100 text-gray-700' 
                        : 'hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center">
                      <UserIcon size={12} />
                    </div>
                    <span>Unassigned</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Metadata
                </label>
                <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar size={12} /> Created
                    </span>
                    <span className="text-gray-700 font-medium">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                       <Clock size={12} /> ID
                    </span>
                    <span className="text-gray-700 font-mono">
                      {task.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
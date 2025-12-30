import React from 'react';
import { Task, User } from '../types';
import { MessageSquare, User as UserIcon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  commentCount: number;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, commentCount, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow group"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-2">
          {assignee ? (
            <img 
              src={assignee.avatar} 
              alt={assignee.name} 
              className="w-6 h-6 rounded-full object-cover"
              title={`Assigned to ${assignee.name}`}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <UserIcon size={14} />
            </div>
          )}
        </div>
        
        {commentCount > 0 && (
          <div className="flex items-center text-gray-400 text-xs">
            <MessageSquare size={14} className="mr-1" />
            {commentCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
import React from 'react';
import { Task, TaskStatus } from '../types/task';
import {
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    ArrowRightCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: TaskStatus) => void;
}

const statusConfig: Record<TaskStatus, {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    label: string;
}> = {
    PENDING: {
        icon: ClockIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        label: 'Pending'
    },
    IN_PROGRESS: {
        icon: ArrowRightCircleIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        label: 'In Progress'
    },
    COMPLETED: {
        icon: CheckCircleIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        label: 'Completed'
    },
    BLOCKED: {
        icon: ExclamationTriangleIcon,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        label: 'Blocked'
    },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
    const StatusIcon = statusConfig[task.status].icon;

    const getStatusOptions = (): TaskStatus[] => {
        const allStatuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'];
        return allStatuses.filter(status => status !== task.status);
    };

    return (
        <div className="group relative bg-white rounded-2xl shadow-elevated border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${statusConfig[task.status].bgColor} ${statusConfig[task.status].color} text-sm font-medium`}>
                    <StatusIcon className="w-4 h-4 mr-1.5" />
                    {statusConfig[task.status].label}
                </div>
            </div>

            {/* Task Content */}
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-20">{task.title}</h3>
                {task.description && (
                    <p className="text-gray-600 line-clamp-3">{task.description}</p>
                )}
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1.5" />
                        <span>Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    {task.dueDate && (
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1.5" />
                            <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                    <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                        className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                        {getStatusOptions().map((status) => (
                            <option key={status} value={status}>
                                Change to {statusConfig[status].label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        title="Edit task"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete task"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
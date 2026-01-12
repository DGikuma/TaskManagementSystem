import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Task, TaskStatus, CreateTaskData, UpdateTaskData } from '../types/task';
import { taskApi } from '../services/api';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import {
    PlusIcon,
    FunnelIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const TaskDashboard: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>();
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const queryClient = useQueryClient();

    // Fetch tasks
    const { data: tasks = [], isLoading, error } = useQuery({
        queryKey: ['tasks', statusFilter],
        queryFn: () => taskApi.getTasks(
            statusFilter !== 'ALL' ? { status: statusFilter } : undefined
        ),
    });

    // Create task mutation
    const createMutation = useMutation({
        mutationFn: taskApi.createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task created successfully!');
            setIsFormOpen(false);
        },
        onError: () => {
            toast.error('Failed to create task. Please try again.');
        },
    });

    // Update task mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
            taskApi.updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task updated successfully!');
            setEditingTask(undefined);
        },
        onError: () => {
            toast.error('Failed to update task. Please try again.');
        },
    });

    // Delete task mutation
    const deleteMutation = useMutation({
        mutationFn: taskApi.deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete task. Please try again.');
        },
    });

    // Calculate status counts
    const statusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {} as Record<TaskStatus, number>);

    const totalTasks = tasks.length;
    const completedTasks = statusCounts.COMPLETED || 0;
    const inProgressTasks = statusCounts.IN_PROGRESS || 0;
    const blockedTasks = statusCounts.BLOCKED || 0;

    const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
        updateMutation.mutate({ id: taskId, data: { status: newStatus } });
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Tasks</h2>
                    <p className="text-gray-600 mb-4">Please try refreshing the page.</p>
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
                        className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors duration-200"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Manager Pro</h1>
                        <p className="text-gray-600">Enterprise-grade task management for modern teams</p>
                    </div>

                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        New Task
                    </button>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-elevated border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-50 rounded-xl mr-4">
                                <ChartBarIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Tasks</p>
                                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-elevated border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-50 rounded-xl mr-4">
                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-elevated border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-50 rounded-xl mr-4">
                                <ArrowPathIcon className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-elevated border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-50 rounded-xl mr-4">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Blocked</p>
                                <p className="text-2xl font-bold text-gray-900">{blockedTasks}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <FunnelIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filter by:</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${statusFilter === status
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {status === 'ALL' ? 'All Tasks' : status.charAt(0) + status.slice(1).toLowerCase()}
                                {status !== 'ALL' && (
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === status ? 'bg-white/30' : 'bg-gray-100'
                                        }`}>
                                        {statusCounts[status as TaskStatus] || 0}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                            <ChartBarIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
                        <p className="text-gray-600 mb-6">Get started by creating your first task!</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors duration-200"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Create First Task
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={setEditingTask}
                                onDelete={(id) => {
                                    if (window.confirm('Are you sure you want to delete this task?')) {
                                        deleteMutation.mutate(id);
                                    }
                                }}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Task Form Modal */}
            {(isFormOpen || editingTask) && (
                <TaskForm
                    task={editingTask}
                    onSubmit={async (data) => {
                        if (editingTask) {
                            // Update accepts partials — CreateTaskData is valid here
                            await updateMutation.mutateAsync({
                                id: editingTask.id,
                                data,
                            });
                        } else {
                            // Create REQUIRES full CreateTaskData
                            await createMutation.mutateAsync(data);
                        }
                    }}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingTask(undefined);
                    }}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </div>
    );
};

export default TaskDashboard;
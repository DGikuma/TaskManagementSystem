import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Task,
    CreateTaskData,
    UpdateTaskData,
    TaskStatus,
} from '../types/task';
import { XMarkIcon } from '@heroicons/react/24/outline';

/* ------------------------------------------------------------------ */
/* Validation Schema                                                    */
/* ------------------------------------------------------------------ */

const taskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters'),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']),
    dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

/* ------------------------------------------------------------------ */
/* Props                                                                */
/* ------------------------------------------------------------------ */

interface TaskFormProps {
    task?: Task;
    onSubmit: (data: CreateTaskData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

const TaskForm: React.FC<TaskFormProps> = ({
    task,
    onSubmit,
    onCancel,
    isSubmitting,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task?.title ?? '',
            description: task?.description ?? '',
            status: task?.status ?? 'PENDING',
            dueDate: task?.dueDate?.split('T')[0] ?? '',
        },
    });

    /* ------------------------------------------------------------------ */
    /* Sanitized Submit Handler                                            */
    /* ------------------------------------------------------------------ */

    const submitHandler = async (data: TaskFormData) => {
        const payload: CreateTaskData = {
            title: data.title.trim(),
            description: data.description?.trim() || undefined,
            status: data.status,
            dueDate: data.dueDate
                ? new Date(data.dueDate).toISOString()
                : undefined,
        };

        await onSubmit(payload);
    };

    /* ------------------------------------------------------------------ */
    /* UI                                                                  */
    /* ------------------------------------------------------------------ */

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {task ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="p-6 space-y-6"
                >
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            {...register('title')}
                            type="text"
                            className="w-full px-4 py-3 border rounded-xl"
                        />
                        {errors.title && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows={4}
                            className="w-full px-4 py-3 border rounded-xl resize-none"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            {...register('status')}
                            className="w-full px-4 py-3 border rounded-xl bg-white"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="BLOCKED">Blocked</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Due Date
                        </label>
                        <input
                            {...register('dueDate')}
                            type="date"
                            className="w-full px-4 py-3 border rounded-xl"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-6 py-3 border rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-primary-600 text-white rounded-xl disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;

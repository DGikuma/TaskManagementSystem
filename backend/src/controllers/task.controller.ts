import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Status } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

interface TaskRequest {
    title: string;
    description?: string;
    status?: Status;
    dueDate?: string;
}

export const createTask = async (
    req: Request<{}, {}, TaskRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, description, status, dueDate } = req.body;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || Status.PENDING,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });

        res.status(201).json({
            success: true,
            data: task,
            message: 'Task created successfully'
        });
    } catch (error) {
        console.error('Create task error:', error);
        next(new AppError('Failed to create task', 500));
    }
};

export const getTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const where = status ? { status: status as Status } : {};

        const tasks = await prisma.task.findMany({
            where,
            orderBy: {
                [sortBy as string]: sortOrder as 'asc' | 'desc',
            },
        });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        next(new AppError('Failed to fetch tasks', 500));
    }
};

export const getTaskById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return next(new AppError('Task not found', 404));
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error('Get task by ID error:', error);
        next(new AppError('Failed to fetch task', 500));
    }
};

export const updateTask = async (
    req: Request<{ id: string }, {}, TaskRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate } = req.body;

        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return next(new AppError('Task not found', 404));
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                dueDate: dueDate ? new Date(dueDate) : task.dueDate,
            },
        });

        res.status(200).json({
            success: true,
            data: updatedTask,
            message: 'Task updated successfully'
        });
    } catch (error) {
        console.error('Update task error:', error);
        next(new AppError('Failed to update task', 500));
    }
};

export const deleteTask = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            return next(new AppError('Task not found', 404));
        }

        await prisma.task.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        next(new AppError('Failed to delete task', 500));
    }
};
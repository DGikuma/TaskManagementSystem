"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const prisma = new client_1.PrismaClient();
const createTask = async (req, res, next) => {
    try {
        const { title, description, status, dueDate } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || client_1.Status.PENDING,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });
        res.status(201).json({
            success: true,
            data: task,
            message: 'Task created successfully'
        });
    }
    catch (error) {
        console.error('Create task error:', error);
        next(new AppError_1.AppError('Failed to create task', 500));
    }
};
exports.createTask = createTask;
const getTasks = async (req, res, next) => {
    try {
        const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const where = status ? { status: status } : {};
        const tasks = await prisma.task.findMany({
            where,
            orderBy: {
                [sortBy]: sortOrder,
            },
        });
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    }
    catch (error) {
        console.error('Get tasks error:', error);
        next(new AppError_1.AppError('Failed to fetch tasks', 500));
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            return next(new AppError_1.AppError('Task not found', 404));
        }
        res.status(200).json({
            success: true,
            data: task,
        });
    }
    catch (error) {
        console.error('Get task by ID error:', error);
        next(new AppError_1.AppError('Failed to fetch task', 500));
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate } = req.body;
        const task = await prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            return next(new AppError_1.AppError('Task not found', 404));
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
    }
    catch (error) {
        console.error('Update task error:', error);
        next(new AppError_1.AppError('Failed to update task', 500));
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            return next(new AppError_1.AppError('Task not found', 404));
        }
        await prisma.task.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete task error:', error);
        next(new AppError_1.AppError('Failed to delete task', 500));
    }
};
exports.deleteTask = deleteTask;

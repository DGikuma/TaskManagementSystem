import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const taskSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters'),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).optional().default('PENDING'),
    dueDate: z.string().optional().nullable(),
});

export const validateTask = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        console.log('📝 Validating task data:', req.body);
        taskSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Validation error:', error.errors);
            res.status(400).json({
                success: false,
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                })),
            });
        } else {
            next(error);
        }
    }
};
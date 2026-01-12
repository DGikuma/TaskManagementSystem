"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTask = void 0;
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
const taskSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters')
        .transform(str => str.trim()),
    description: zod_1.z.string().optional().transform(str => str?.trim()),
    status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).optional(),
    dueDate: zod_1.z.string().datetime().optional().nullable(),
});
const validateTask = (req, res, next) => {
    try {
        const validatedData = taskSchema.parse(req.body);
        req.body = validatedData; // Replace with validated data
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
            next(new AppError_1.ValidationError(errorMessage));
        }
        else {
            next(error);
        }
    }
};
exports.validateTask = validateTask;

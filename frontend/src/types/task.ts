export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    createdAt: string;
    dueDate: string | null;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> { }
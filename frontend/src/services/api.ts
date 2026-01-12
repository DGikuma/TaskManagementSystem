import axios, { AxiosError } from 'axios';
import { Task, CreateTaskData, UpdateTaskData } from '../types/task';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error('API Error:', {
            status: error.response?.status,
            message: error.message,
            url: error.config?.url,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Test API connection
export const testApiConnection = async (): Promise<boolean> => {
    try {
        const response = await axios.get('http://localhost:5000/api/test');
        console.log('✅ API Connection Test:', response.data);
        return true;
    } catch (error) {
        console.error('❌ API Connection Failed:', error);
        return false;
    }
};

export const taskApi = {
    // Create task
    createTask: async (data: CreateTaskData): Promise<Task> => {
        const response = await api.post<Task>('/tasks', data);
        return response.data;
    },

    // Get all tasks - Updated response type
    getTasks: async (filters?: { status?: Task['status'] }): Promise<Task[]> => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);

        const response = await api.get('/tasks', { params });

        // Handle different response formats
        if (response.data && response.data.data) {
            return response.data.data as Task[];
        }
        return response.data as Task[];
    },

    // Get single task
    getTaskById: async (id: string): Promise<Task> => {
        const response = await api.get(`/tasks/${id}`);

        if (response.data && response.data.data) {
            return response.data.data as Task;
        }
        return response.data as Task;
    },

    // Update task
    updateTask: async (id: string, data: UpdateTaskData): Promise<Task> => {
        const response = await api.put(`/tasks/${id}`, data);

        if (response.data && response.data.data) {
            return response.data.data as Task;
        }
        return response.data as Task;
    },

    // Delete task
    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },
};
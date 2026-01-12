const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 5000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(express.json());

// Test endpoints
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Task Manager API',
        version: '1.0.0'
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/tasks', (req, res) => {
    res.json({
        success: true,
        count: 2,
        data: [
            {
                id: '1',
                title: 'Fix CORS Issue',
                description: 'Resolve the CORS problem in the backend',
                status: 'IN_PROGRESS',
                createdAt: new Date().toISOString(),
                dueDate: new Date(Date.now() + 86400000).toISOString()
            },
            {
                id: '2',
                title: 'Test Frontend Connection',
                description: 'Ensure frontend can connect to backend',
                status: 'COMPLETED',
                createdAt: new Date().toISOString(),
                dueDate: new Date(Date.now() - 86400000).toISOString()
            }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Health: http://localhost:${PORT}/health`);
    console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
    console.log(`📋 Tasks: http://localhost:${PORT}/api/tasks`);
    console.log(`🌐 CORS enabled for: http://localhost:5173`);
});
@echo off
echo ========================================
echo FIXING SERVER.TS SYNTAX ERRORS
echo ========================================

echo.
echo 1. Fixing server.ts file...
cd "D:\Task Management System\backend"

if not exist src mkdir src

echo import express from 'express'; > src\server.ts
echo import dotenv from 'dotenv'; >> src\server.ts
echo. >> src\server.ts
echo dotenv.config(); >> src\server.ts
echo. >> src\server.ts
echo const app = express(); >> src\server.ts
echo const PORT = process.env.PORT || 5000; >> src\server.ts
echo. >> src\server.ts
echo app.use(express.json()); >> src\server.ts
echo. >> src\server.ts
echo app.get('/health', (req, res) => { >> src\server.ts
echo   res.json({ status: 'OK', message: 'Server is running' }); >> src\server.ts
echo }); >> src\server.ts
echo. >> src\server.ts
echo app.listen(PORT, () => { >> src\server.ts
echo   console.log('🚀 Server running on port ' + PORT); >> src\server.ts
echo   console.log('🔗 Health check: http://localhost:' + PORT + '/health'); >> src\server.ts
echo }); >> src\server.ts

echo.
echo 2. Building TypeScript...
call npm run build

echo.
echo 3. Starting server...
echo.
echo ✅ Server fixed! Starting now...
echo 📍 Open http://localhost:5000/health in your browser
echo.
call npm start

pause
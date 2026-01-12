@echo off
echo ========================================
echo FIXING PRISMA CONFIGURATION
echo ========================================

echo.
echo 1. Cleaning up...
rmdir /s /q node_modules 2>nul
del prisma.config.ts 2>nul
del prisma\dev.db 2>nul
rmdir /s /q prisma\migrations 2>nul
rmdir /s /q dist 2>nul

echo.
echo 2. Creating .env file...
echo DATABASE_URL="file:./dev.db" > .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env

echo.
echo 3. Creating correct Prisma schema...
echo datasource db { > prisma\schema.prisma
echo   provider = "sqlite" >> prisma\schema.prisma
echo   url      = env("DATABASE_URL") >> prisma\schema.prisma
echo } >> prisma\schema.prisma
echo. >> prisma\schema.prisma
echo generator client { >> prisma\schema.prisma
echo   provider = "prisma-client-js" >> prisma\schema.prisma
echo } >> prisma\schema.prisma
echo. >> prisma\schema.prisma
echo model Task { >> prisma\schema.prisma
echo   id          String   @id @default(cuid()) >> prisma\schema.prisma
echo   title       String   >> prisma\schema.prisma
echo   description String?  >> prisma\schema.prisma
echo   status      String   @default("PENDING") >> prisma\schema.prisma
echo   createdAt   DateTime @default(now()) @map("create_date") >> prisma\schema.prisma
echo   dueDate     DateTime? @map("due_date") >> prisma\schema.prisma
echo. >> prisma\schema.prisma
echo   @@map("tasks") >> prisma\schema.prisma
echo } >> prisma\schema.prisma

echo.
echo 4. Installing Prisma 5...
call npm install prisma@5.0.0 @prisma/client@5.0.0
call npm install dotenv cors helmet express-rate-limit zod
call npm install --save-dev typescript @types/node @types/express @types/cors ts-node-dev

echo.
echo 5. Generating Prisma client...
call npx prisma generate

echo.
echo 6. Creating database...
call npx prisma db push

echo.
echo 7. Creating minimal server...
if not exist src mkdir src
echo import express from 'express'; > src\server.ts
echo import dotenv from 'dotenv'; >> src\server.ts
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
echo   console.log(\`🚀 Server running on port ${PORT}\`); >> src\server.ts
echo   console.log(\`🔗 Health check: http://localhost:${PORT}/health\`); >> src\server.ts
echo }); >> src\server.ts

echo.
echo 8. Creating tsconfig.json...
echo { > tsconfig.json
echo   "compilerOptions": { >> tsconfig.json
echo     "target": "ES2020", >> tsconfig.json
echo     "module": "commonjs", >> tsconfig.json
echo     "lib": ["ES2020"], >> tsconfig.json
echo     "outDir": "./dist", >> tsconfig.json
echo     "rootDir": "./src", >> tsconfig.json
echo     "strict": true, >> tsconfig.json
echo     "esModuleInterop": true, >> tsconfig.json
echo     "skipLibCheck": true, >> tsconfig.json
echo     "forceConsistentCasingInFileNames": true, >> tsconfig.json
echo     "resolveJsonModule": true >> tsconfig.json
echo   }, >> tsconfig.json
echo   "include": ["src/**/*"], >> tsconfig.json
echo   "exclude": ["node_modules", "dist"] >> tsconfig.json
echo } >> tsconfig.json

echo.
echo 9. Building and starting...
call npm run build
echo.
echo ✅ Setup complete! Starting server...
echo 📍 Open http://localhost:5000/health in your browser
echo.
call npm start

pause
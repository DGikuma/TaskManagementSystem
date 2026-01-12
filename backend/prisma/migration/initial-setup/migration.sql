CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status "Status" DEFAULT 'PENDING',
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP
);

CREATE INDEX idx_tasks_status ON tasks (status);

CREATE INDEX idx_tasks_due_date ON tasks (due_date);
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import TaskDashboard from './components/TaskDashboard';
import ApiTest from './components/ApiTest';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
    },
});

function App() {
    const [showTest, setShowTest] = useState(import.meta.env.DEV);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <TaskDashboard />

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#fff',
                            color: '#333',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            padding: '16px',
                            fontSize: '14px',
                            fontWeight: '500',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </div>
        </QueryClientProvider>
    );
}

export default App;
import React, { useState, useEffect } from 'react';
import { taskApi } from '../services/api';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const BackendTest: React.FC = () => {
    const [status, setStatus] = useState < 'loading' | 'success' | 'error' > ('loading');
    const [message, setMessage] = useState < string > ('Testing backend connection...');
    const [url, setUrl] = useState < string > ('');

    useEffect(() => {
        testBackendConnection();
    }, []);

    const testBackendConnection = async () => {
        try {
            setStatus('loading');
            setMessage('Testing backend connection...');

            // Get the API URL from environment
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            setUrl(apiUrl);

            console.log('Testing backend at:', apiUrl);

            // Try health endpoint first
            const healthResponse = await fetch(`${apiUrl.replace('/api', '')}/api/health`);

            if (healthResponse.ok) {
                const healthData = await healthResponse.json();
                console.log('Health check response:', healthData);

                // Try tasks endpoint
                const tasksResponse = await fetch(`${apiUrl}/tasks`);

                if (tasksResponse.ok) {
                    setStatus('success');
                    setMessage('✅ Backend is connected and working perfectly!');
                } else {
                    setStatus('error');
                    setMessage(`⚠️ Backend is running but tasks endpoint returned ${tasksResponse.status}. This might be normal if no tasks exist.`);
                }
            } else {
                setStatus('error');
                setMessage(`❌ Backend health check failed with status ${healthResponse.status}`);
            }
        } catch (error: any) {
            console.error('Connection test failed:', error);
            setStatus('error');
            setMessage(`❌ Cannot connect to backend at ${url}. Make sure backend is running on port 5000.`);
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`rounded-xl p-4 shadow-lg ${status === 'loading' ? 'bg-yellow-50 border border-yellow-200' :
                    status === 'success' ? 'bg-green-50 border border-green-200' :
                        'bg-red-50 border border-red-200'
                }`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {status === 'loading' && (
                            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                        )}
                        {status === 'success' && (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        )}
                        {status === 'error' && (
                            <XCircleIcon className="w-5 h-5 text-red-600" />
                        )}
                    </div>
                    <div className="ml-3">
                        <h3 className={`text-sm font-medium ${status === 'loading' ? 'text-yellow-800' :
                                status === 'success' ? 'text-green-800' :
                                    'text-red-800'
                            }`}>
                            Backend Connection
                        </h3>
                        <div className={`mt-1 text-sm ${status === 'loading' ? 'text-yellow-700' :
                                status === 'success' ? 'text-green-700' :
                                    'text-red-700'
                            }`}>
                            <p>{message}</p>
                            <p className="mt-1 text-xs opacity-75">URL: {url}</p>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={testBackendConnection}
                                className="text-xs font-medium underline hover:no-underline"
                            >
                                Test Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackendTest;
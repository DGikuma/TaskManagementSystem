import React, { useEffect, useState } from 'react';
import { testApiConnection } from '../services/api';

const ApiTest: React.FC = () => {
    const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
    const [backendUrl, setBackendUrl] = useState('');

    useEffect(() => {
        checkApiConnection();
    }, []);

    const checkApiConnection = async () => {
        setApiStatus('checking');
        const isConnected = await testApiConnection();
        setApiStatus(isConnected ? 'connected' : 'failed');
        setBackendUrl(import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white rounded-xl shadow-lg p-4 max-w-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">API Status</h3>
                    <button
                        onClick={checkApiConnection}
                        className="text-sm text-primary-600 hover:text-primary-800"
                    >
                        Retry
                    </button>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${apiStatus === 'connected' ? 'bg-green-500' :
                            apiStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                    <span className="text-sm font-medium">
                        {apiStatus === 'connected' && 'Connected to Backend'}
                        {apiStatus === 'failed' && 'Connection Failed'}
                        {apiStatus === 'checking' && 'Checking Connection...'}
                    </span>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                    Backend URL: {backendUrl}
                </div>

                {apiStatus === 'failed' && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        <p className="font-medium">Troubleshooting:</p>
                        <ul className="list-disc pl-4 mt-1 space-y-1">
                            <li>Ensure backend server is running</li>
                            <li>Check if port 5000 is available</li>
                            <li>Verify CORS configuration</li>
                            <li>Test with: curl http://localhost:5000/api/test</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiTest;
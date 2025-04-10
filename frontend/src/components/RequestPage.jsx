import React, { useState } from 'react';
import sampleData from '../data/sampleData.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom toast styles
const toastStyles = {
  success: {
    style: {
      background: '#f8fafc',
      borderLeft: '4px solid #3b82f6',
      borderRadius: '2px 16px 16px 2px',
      color: '#1e40af',
      padding: '12px 16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      width: '360px',
      marginBottom: '10px',
      cursor: 'pointer'
    }
  },
  error: {
    style: {
      background: '#fef2f2',
      borderLeft: '4px solid #ef4444',
      borderRadius: '2px 16px 16px 2px',
      color: '#b91c1c',
      padding: '12px 16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      width: '360px',
      marginBottom: '10px',
      cursor: 'pointer'
    }
  },
  processing: {
    style: {
      background: '#f8fafc',
      borderLeft: '4px solid #3b82f6',
      borderRadius: '2px 16px 16px 2px',
      color: '#1e40af',
      padding: '12px 16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      width: '360px',
      marginBottom: '10px'
    }
  }
};

const RequestPage = () => {
  const [keyValue, setKeyValue] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState('development');

  const environments = [
    { id: 'development', name: 'Development', baseUrl: 'https://dev-api.example.com' },
    { id: 'staging', name: 'Staging', baseUrl: 'https://staging-api.example.com' },
    { id: 'uat', name: 'UAT', baseUrl: 'https://uat-api.example.com' },
    { id: 'production', name: 'Production', baseUrl: 'https://api.example.com' }
  ];

  const showNotification = (type, method, requestId = '') => {
    const options = {
      position: "bottom-right",  // All notifications in bottom-right
      autoClose: type === 'processing' ? false : 3000,
      hideProgressBar: true,
      closeOnClick: type !== 'processing',
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      onClick: type !== 'processing' ? () => toast.dismiss() : undefined,
      ...toastStyles[type]
    };

    const content = (
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {type === 'success' && (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
          )}
          {type === 'error' && (
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
          )}
          {type === 'processing' && (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <div className="flex-1">
          {type === 'processing' ? (
            <div>
              <p className="text-base font-semibold text-blue-700">
                {method} request processing
              </p>
              <p className="text-sm mt-0.5 text-blue-600 opacity-80">
                Request will be saved in API logs
              </p>
            </div>
          ) : (
            <div>
              <p className="text-base font-semibold text-blue-700">
                {method} request {type === 'success' ? 'completed' : 'failed'}
              </p>
              {requestId && (
                <p className="text-sm mt-0.5 text-blue-600 opacity-80">
                  ID: {requestId}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );

    return toast(content, options);
  };

  const logApiRequest = (method, key, status, endpoint) => {
    // Generate a model name based on the key
    const models = [
      'GPT-4',
      'GPT-3.5-Turbo',
      'DALL-E-3',
      'Claude-2',
      'Stable-Diffusion-XL',
      'Llama-2-70B',
      'PaLM-2',
      'Gemini-Pro'
    ];
    
    // Use the last two digits of the key to select a model
    const lastTwoDigits = key.slice(-2);
    const modelIndex = Math.abs(parseInt(lastTwoDigits)) % models.length;
    const selectedModel = models[modelIndex] || models[0]; // Fallback to first model if calculation fails

    const log = {
      id: Date.now(),
      domain_id: `dom_${Date.now()}`,
      model: selectedModel,
      method: method,
      status: status,
      endpoint: endpoint,
      time: new Date().toISOString(),
      value: key,
      request_id: `req_${key}_${Date.now()}`
    };

    // Get existing logs from localStorage or initialize empty array
    const existingLogs = JSON.parse(localStorage.getItem('apiLogs') || '[]');
    existingLogs.unshift(log); // Add new log at the beginning
    localStorage.setItem('apiLogs', JSON.stringify(existingLogs));
    
    // Force a refresh of the logs display
    window.dispatchEvent(new Event('storage'));

    // Updated notification calls
    const requestId = `req_${key}_${Date.now()}`;
    showNotification(status === 'success' ? 'success' : 'error', method, requestId);
  };

  const handleSubmit = async (method) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    // Show processing notification in top-left
    const processingToast = showNotification('processing', method);

    try {
      if (keyValue.length !== 13) {
        toast.dismiss(processingToast);
        throw new Error('Key must be exactly 13 digits');
      }

      console.log('Environment:', selectedEnv);
      console.log('Searching for key:', keyValue);
      console.log('Available keys:', Object.keys(sampleData));
      console.log('Found data:', sampleData[keyValue]);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (method === 'GET') {
        if (sampleData[keyValue]) {
          console.log('GET Response:', sampleData[keyValue]);
          setResponse({
            environment: selectedEnv,
            baseUrl: environments.find(env => env.id === selectedEnv).baseUrl,
            data: sampleData[keyValue]
          });
          logApiRequest('GET', keyValue, 'success', '/api/validate');
        } else {
          logApiRequest('GET', keyValue, 'error', '/api/validate');
          throw new Error('Key not found');
        }
      } else if (method === 'POST') {
        if (sampleData[keyValue]) {
          const responseData = { 
            environment: selectedEnv,
            baseUrl: environments.find(env => env.id === selectedEnv).baseUrl,
            message: 'Data updated successfully', 
            data: sampleData[keyValue],
            timestamp: new Date().toISOString()
          };
          console.log('POST Response:', responseData);
          setResponse(responseData);
          logApiRequest('POST', keyValue, 'success', '/api/validate');
        } else {
          logApiRequest('POST', keyValue, 'error', '/api/validate');
          throw new Error('Invalid key');
        }
      }

      // Dismiss processing notification on success
      toast.dismiss(processingToast);

    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message);
      // Dismiss processing notification before showing error
      toast.dismiss(processingToast);
      showNotification('error', method);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer
        position="bottom-right"
        closeButton={false}
        limit={2}
        className="!-translate-y-4"
        style={{ width: '360px' }}
      />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Validation</h1>
        
        {/* Environment Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Environment Settings</h2>
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Select Environment:</label>
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {environments.map(env => (
                <option key={env.id} value={env.id}>
                  {env.name} - {env.baseUrl}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Request Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Validate Request</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                13-Digit Key
              </label>
              <input
                type="text"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 13-digit key"
                maxLength={13}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleSubmit('GET')}
                disabled={loading}
                className={`flex-1 font-bold py-2 px-4 rounded-md transition duration-200 ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-700'
                } ${
                  error ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600'
                } text-white`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : null}
                  <span>{loading ? 'Processing...' : 'GET Request'}</span>
                </div>
              </button>
              
              <button
                onClick={() => handleSubmit('POST')}
                disabled={loading}
                className={`flex-1 font-bold py-2 px-4 rounded-md transition duration-200 ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-700'
                } ${
                  error ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600'
                } text-white`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : null}
                  <span>{loading ? 'Processing...' : 'POST Request'}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Response Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Validation Result</h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            ) : response ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                <p className="font-medium">Success</p>
                <pre className="mt-2 overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Make a request to see the response
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPage; 
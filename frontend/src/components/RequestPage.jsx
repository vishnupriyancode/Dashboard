import React, { useState } from 'react';
import sampleData from '../data/sampleData.json';

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

  const logApiRequest = (method, key, status, endpoint) => {
    const log = {
      id: Date.now(),
      domain_id: `dom_${Date.now()}`,
      model: 'Validation',
      status: status,
      endpoint: endpoint,
      time: new Date().toISOString(),
      value: key,
    };

    // Get existing logs from localStorage or initialize empty array
    const existingLogs = JSON.parse(localStorage.getItem('apiLogs') || '[]');
    existingLogs.unshift(log); // Add new log at the beginning
    localStorage.setItem('apiLogs', JSON.stringify(existingLogs));
  };

  const handleSubmit = async (method) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Validate key length
      if (keyValue.length !== 13) {
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
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'GET Request'}
              </button>
              <button
                onClick={() => handleSubmit('POST')}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'POST Request'}
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
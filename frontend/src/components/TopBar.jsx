import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">API Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
          <div className="text-sm">
            <p className="font-medium text-gray-900">user</p>
            <p className="text-gray-500">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar; 
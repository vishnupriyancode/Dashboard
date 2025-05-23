import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ApiLogsTable from './components/ApiLogsTable';
import Login from './components/Login'; 
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import RequestPage from './components/RequestPage';
import Devlogs from './pages/Devlogs';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col"> 
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ApiLogsTable />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dev-logs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Devlogs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/request"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RequestPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Settings Content</div>
              </DashboardLayout> 
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 
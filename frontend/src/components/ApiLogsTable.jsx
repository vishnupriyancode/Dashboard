import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { payloadData } from '../data/payloadData';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ApiLogsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Load logs from localStorage
    const loadLogs = () => {
      const storedLogs = JSON.parse(localStorage.getItem('apiLogs') || '[]');
      setLogs(storedLogs);
    };

    // Load initial logs
    loadLogs();

    // Set up event listener for storage changes
    window.addEventListener('storage', loadLogs);

    // Cleanup
    return () => {
      window.removeEventListener('storage', loadLogs);
    };
  }, []);

  const copyToClipboard = (value) => {
    const jsonPayload = payloadData[value];
    if (jsonPayload) {
      navigator.clipboard.writeText(JSON.stringify(jsonPayload, null, 2));
    } else {
      // Fallback to copying just the key if no JSON payload exists
      navigator.clipboard.writeText(value);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.endpoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const exportData = filteredLogs.map(log => ({
      'Domain ID': log.domain_id,
      'Model': log.model,
      'Status': log.status,
      'Endpoint': log.endpoint,
      'Time': log.time,
      'State': log.status === 'success' ? 'Completed' : log.status === 'error' ? 'Failed' : 'In Progress',
      'Value': log.value
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'API Logs');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'api_logs.xlsx');
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-6">API Records</h1>
      <div className="mb-4 flex items-center space-x-4">
        <div className="relative w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search endpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Export to Excel
        </button>
        <select
          className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="error">Failed</option>
          <option value="pending">pending</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Domain ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Endpoint
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredLogs.map((log) => (
              <tr key={log.id} className={log.status === 'error' ? 'bg-red-50' : ''}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {log.domain_id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {log.model}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {log.endpoint}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {log.time}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {log.status === 'success' ? 'Completed' : log.status === 'error' ? 'Failed' : 'In Progress'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {log.value}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="inline-flex items-center rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
                      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => copyToClipboard(log.value)}
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } flex w-full px-4 py-2 text-sm`}
                            >
                              Copy JSON Payload
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiLogsTable; 
import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin-specific cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-600">Manage all users in the system</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <p className="text-gray-600">Configure system-wide settings</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Reports</h2>
            <p className="text-gray-600">View system reports and analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
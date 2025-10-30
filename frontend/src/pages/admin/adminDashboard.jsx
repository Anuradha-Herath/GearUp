import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalCustomers: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    activeAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    // Load dashboard data
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Dummy employees data
    const employees = [
      { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johndoe', role: 'Mechanic', phone: '123-456-7890', department: 'Service', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', username: 'janesmith', role: 'Receptionist', phone: '123-456-7891', department: 'Front Desk', status: 'Active' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', username: 'bobjohnson', role: 'Manager', phone: '123-456-7892', department: 'Management', status: 'Inactive' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', username: 'alicebrown', role: 'Technician', phone: '123-456-7893', department: 'Service', status: 'Active' },
    ];

    // Dummy customers data
    const customers = [
      { id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '555-0101', totalAppointments: 5, status: 'Active', joinDate: '2024-01-15' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '555-0102', totalAppointments: 3, status: 'Active', joinDate: '2024-02-20' },
      { id: 3, name: 'Mike Davis', email: 'mike.davis@email.com', phone: '555-0103', totalAppointments: 8, status: 'Active', joinDate: '2023-11-10' },
      { id: 4, name: 'Emily Wilson', email: 'emily.w@email.com', phone: '555-0104', totalAppointments: 2, status: 'Inactive', joinDate: '2024-03-05' },
      { id: 5, name: 'David Brown', email: 'david.brown@email.com', phone: '555-0105', totalAppointments: 6, status: 'Active', joinDate: '2023-12-18' },
      { id: 6, name: 'Lisa Garcia', email: 'lisa.garcia@email.com', phone: '555-0106', totalAppointments: 4, status: 'Active', joinDate: '2024-01-08' },
      { id: 7, name: 'Tom Anderson', email: 'tom.anderson@email.com', phone: '555-0107', totalAppointments: 1, status: 'Inactive', joinDate: '2024-04-12' },
      { id: 8, name: 'Jennifer Lee', email: 'jennifer.lee@email.com', phone: '555-0108', totalAppointments: 7, status: 'Active', joinDate: '2023-10-25' },
    ];

    // Dummy appointments data
    const appointments = [
      { id: 1, customerName: 'John Smith', service: 'Oil Change', date: '2024-10-28', time: '10:00', status: 'Scheduled', mechanic: 'Mike Johnson', notes: 'Regular maintenance' },
      { id: 2, customerName: 'Sarah Johnson', service: 'Brake Inspection', date: '2024-10-28', time: '11:30', status: 'In Progress', mechanic: 'Tom Wilson', notes: 'Customer reported squeaking' },
      { id: 3, customerName: 'Mike Davis', service: 'Tire Replacement', date: '2024-10-27', time: '14:00', status: 'Completed', mechanic: 'Lisa Chen', notes: 'Replaced all 4 tires' },
      { id: 4, customerName: 'Emily Wilson', service: 'Engine Tune-up', date: '2024-10-27', time: '09:00', status: 'Completed', mechanic: 'Mike Johnson', notes: 'Full engine diagnostic' },
      { id: 5, customerName: 'David Brown', service: 'Battery Replacement', date: '2024-10-26', time: '16:00', status: 'Cancelled', mechanic: 'Tom Wilson', notes: 'Customer cancelled' },
      { id: 6, customerName: 'Lisa Garcia', service: 'AC Repair', date: '2024-10-26', time: '13:00', status: 'Completed', mechanic: 'Lisa Chen', notes: 'Recharged AC system' },
      { id: 7, customerName: 'Tom Anderson', service: 'Transmission Service', date: '2024-10-25', time: '11:00', status: 'Scheduled', mechanic: 'Mike Johnson', notes: 'Fluid change and filter' },
      { id: 8, customerName: 'Jennifer Lee', service: 'Wheel Alignment', date: '2024-10-25', time: '15:30', status: 'In Progress', mechanic: 'Tom Wilson', notes: 'After tire replacement' },
    ];

    const completedCount = appointments.filter(a => a.status === 'Completed').length;
    const activeCount = appointments.filter(a => a.status === 'In Progress').length;

    setStats({
      totalEmployees: employees.length,
      totalCustomers: customers.length,
      totalAppointments: appointments.length,
      completedAppointments: completedCount,
      activeAppointments: activeCount,
    });

    // Get recent appointments (last 5)
    setRecentAppointments(appointments.slice(0, 5));

    // Get recent customers (last 4)
    setRecentCustomers(customers.slice(0, 4));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-lg shadow-md border-l-4 cursor-pointer transform hover:scale-105 transition duration-300 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your system overview.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard 
            title="Total Employees" 
            value={stats.totalEmployees}
            icon="👥"
            color="border-blue-500"
            onClick={() => navigate('/admin/employees')}
          />
          <StatCard 
            title="Total Customers" 
            value={stats.totalCustomers}
            icon="🧑"
            color="border-green-500"
            onClick={() => navigate('/admin/customers')}
          />
          <StatCard 
            title="Total Appointments" 
            value={stats.totalAppointments}
            icon="📅"
            color="border-purple-500"
            onClick={() => navigate('/admin/appointments')}
          />
          <StatCard 
            title="Active Jobs" 
            value={stats.activeAppointments}
            icon="⚙️"
            color="border-yellow-500"
            onClick={() => navigate('/admin/appointments')}
          />
          <StatCard 
            title="Completed" 
            value={stats.completedAppointments}
            icon="✅"
            color="border-emerald-500"
            onClick={() => navigate('/admin/appointments')}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin/employees')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
              >
                Manage Employees
              </button>
              <button 
                onClick={() => navigate('/admin/customers')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition"
              >
                Manage Customers
              </button>
              <button 
                onClick={() => navigate('/admin/appointments')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition"
              >
                Manage Appointments
              </button>
              <button 
                onClick={() => navigate('/admin/reports')}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition"
              >
                View Reports
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users:</span>
                <span className="font-semibold">{stats.totalEmployees + stats.totalCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Appointments:</span>
                <span className="font-semibold">{stats.activeAppointments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed This Month:</span>
                <span className="font-semibold">{stats.completedAppointments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">System Status:</span>
                <span className="font-semibold text-green-600">Operational</span>
              </div>
              <hr className="my-3" />
              <p className="text-gray-500 text-xs">Last updated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Appointments</h2>
              <button 
                onClick={() => navigate('/admin/appointments')}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded p-3 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.customerName}</p>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                        <p className="text-xs text-gray-500 mt-1">{appointment.date} at {appointment.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No appointments available</p>
              )}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Customers</h2>
              <button 
                onClick={() => navigate('/admin/customers')}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentCustomers.length > 0 ? (
                recentCustomers.map((customer) => (
                  <div key={customer.id} className="border rounded p-3 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Appointments: {customer.totalAppointments}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No customers available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
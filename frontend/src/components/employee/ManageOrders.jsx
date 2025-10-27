import React, { useState } from 'react';

const ManageOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-101',
      customerName: 'Sarah Connor',
      vehicle: 'Tesla Model 3 - TES 1234',
      serviceType: 'Battery Check',
      date: '2025-10-27',
      assignedTo: 'Tech-A',
      status: 'In Progress',
      estimatedCost: '$150',
      progress: 60
    },
    {
      id: 'ORD-102',
      customerName: 'Robert Brown',
      vehicle: 'BMW X5 - BMW 5678',
      serviceType: 'Engine Diagnostic',
      date: '2025-10-26',
      assignedTo: 'Tech-B',
      status: 'Pending',
      estimatedCost: '$200',
      progress: 0
    },
    {
      id: 'ORD-103',
      customerName: 'Emily Davis',
      vehicle: 'Audi A4 - AUD 9012',
      serviceType: 'Transmission Service',
      date: '2025-10-27',
      assignedTo: 'Tech-C',
      status: 'In Progress',
      estimatedCost: '$350',
      progress: 30
    },
    {
      id: 'ORD-104',
      customerName: 'David Wilson',
      vehicle: 'Nissan Altima - NIS 3456',
      serviceType: 'AC Repair',
      date: '2025-10-25',
      assignedTo: 'Tech-A',
      status: 'Completed',
      estimatedCost: '$180',
      progress: 100
    },
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              Manage Orders
            </h2>
            <p className="text-gray-600 mt-1">Update order status and track progress</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by customer, order ID, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Pending</p>
            <p className="text-xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">In Progress</p>
            <p className="text-xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'In Progress').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Completed</p>
            <p className="text-xl font-bold text-green-600">
              {orders.filter(o => o.status === 'Completed').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Cancelled</p>
            <p className="text-xl font-bold text-red-600">
              {orders.filter(o => o.status === 'Cancelled').length}
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Order Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{order.customerName}</h3>
                        <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">🚗</span>
                        <span className="text-gray-700">{order.vehicle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">🔧</span>
                        <span className="text-gray-700">{order.serviceType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">📅</span>
                        <span className="text-gray-700">{order.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">👨‍🔧</span>
                        <span className="text-gray-700">{order.assignedTo}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {order.status === 'In Progress' && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-primary">{order.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm">💰</span>
                      <span className="text-lg font-semibold text-primary">{order.estimatedCost}</span>
                    </div>
                  </div>

                  {/* Status Change */}
                  <div className="lg:w-64 space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Change Status:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageOrders;

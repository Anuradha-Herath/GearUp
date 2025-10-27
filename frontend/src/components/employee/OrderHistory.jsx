import React, { useState } from 'react';

const OrderHistory = () => {
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data
  const orderHistory = [
    {
      id: 'ORD-201',
      customerName: 'Alice Johnson',
      vehicle: 'Mercedes C-Class - MER 1111',
      serviceType: 'Full Service + Oil Change',
      date: '2025-10-20',
      completedDate: '2025-10-21',
      status: 'Completed',
      totalCost: '$380',
      technician: 'Tech-A',
      notes: 'Customer satisfied. Recommended tire rotation in 3 months.'
    },
    {
      id: 'ORD-202',
      customerName: 'Bob Martinez',
      vehicle: 'Chevrolet Silverado - CHV 2222',
      serviceType: 'Brake Replacement',
      date: '2025-10-18',
      completedDate: '2025-10-18',
      status: 'Completed',
      totalCost: '$450',
      technician: 'Tech-B',
      notes: 'Replaced front brake pads and rotors. Test drive completed.'
    },
    {
      id: 'ORD-203',
      customerName: 'Carol White',
      vehicle: 'Hyundai Sonata - HYU 3333',
      serviceType: 'AC Repair',
      date: '2025-10-15',
      completedDate: null,
      status: 'Cancelled',
      totalCost: '$0',
      technician: 'N/A',
      notes: 'Customer cancelled due to scheduling conflict.'
    },
    {
      id: 'ORD-204',
      customerName: 'Daniel Lee',
      vehicle: 'Mazda CX-5 - MAZ 4444',
      serviceType: 'Tire Rotation + Alignment',
      date: '2025-10-22',
      completedDate: '2025-10-22',
      status: 'Completed',
      totalCost: '$120',
      technician: 'Tech-C',
      notes: 'All tires in good condition. Next rotation in 6 months.'
    },
    {
      id: 'ORD-205',
      customerName: 'Eva Green',
      vehicle: 'Subaru Outback - SUB 5555',
      serviceType: 'Engine Diagnostic',
      date: '2025-10-19',
      completedDate: '2025-10-20',
      status: 'Completed',
      totalCost: '$220',
      technician: 'Tech-A',
      notes: 'Found and fixed sensor issue. No further problems detected.'
    },
  ];

  const filteredHistory = orderHistory.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = dateFilter === 'all' || (
      dateFilter === 'week' ? new Date(order.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) :
      dateFilter === 'month' ? new Date(order.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) :
      true
    );
    return matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    return status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">🧾</span>
              Order History
            </h2>
            <p className="text-gray-600 mt-1">View completed and cancelled orders</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range:</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {orderHistory.filter(o => o.status === 'Completed').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Cancelled</p>
            <p className="text-2xl font-bold text-red-600">
              {orderHistory.filter(o => o.status === 'Cancelled').length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Revenue (Completed)</p>
            <p className="text-2xl font-bold text-purple-600">$1,170</p>
          </div>
        </div>
      </div>

      {/* Order History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No History Found</h3>
            <p className="text-gray-600">No orders match your filter criteria.</p>
          </div>
        ) : (
          filteredHistory.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Order Details */}
                  <div className="flex-1 space-y-3">
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
                        <span className="text-gray-700">Ordered: {order.date}</span>
                      </div>
                      {order.completedDate && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">✅</span>
                          <span className="text-gray-700">Completed: {order.completedDate}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">👨‍🔧</span>
                        <span className="text-gray-700">{order.technician}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">💰</span>
                        <span className="text-lg font-semibold text-primary">{order.totalCost}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                      <p className="text-sm text-gray-600">{order.notes}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 lg:flex-none px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      View Details
                    </button>
                    <button className="flex-1 lg:flex-none px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal (simplified) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Vehicle:</strong> {selectedOrder.vehicle}</p>
                <p><strong>Service:</strong> {selectedOrder.serviceType}</p>
                <p><strong>Total Cost:</strong> {selectedOrder.totalCost}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Notes:</strong> {selectedOrder.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

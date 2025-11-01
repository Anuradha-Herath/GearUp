import React, { useState } from 'react';

const ManageOrders = () => {
  // Mock data for confirmed orders
  const [orders, setOrders] = useState([
    {
      id: 1,
      vehicleCompany: 'BMW',
      model: 'X5',
      year: 2021,
      vehicleNumber: 'BMW-7890',
      serviceCategory: 'Engine Diagnostics',
      date: '2025-11-03',
      time: '9:30 AM',
      estimatedPrice: 250.00,
      status: 'confirmed',
      customerName: 'Robert Brown',
      customerPhone: '+1-234-567-8904'
    },
    {
      id: 2,
      vehicleCompany: 'Mercedes',
      model: 'C-Class',
      year: 2020,
      vehicleNumber: 'MER-4567',
      serviceCategory: 'Transmission Service',
      date: '2025-11-04',
      time: '1:00 PM',
      estimatedPrice: 350.00,
      status: 'started',
      customerName: 'Emily Davis',
      customerPhone: '+1-234-567-8905'
    },
    {
      id: 3,
      vehicleCompany: 'Audi',
      model: 'A4',
      year: 2019,
      vehicleNumber: 'AUD-1234',
      serviceCategory: 'AC Repair',
      date: '2025-11-02',
      time: '3:00 PM',
      estimatedPrice: 180.00,
      status: 'ongoing',
      customerName: 'David Wilson',
      customerPhone: '+1-234-567-8906'
    },
    {
      id: 4,
      vehicleCompany: 'Lexus',
      model: 'RX 350',
      year: 2022,
      vehicleNumber: 'LEX-8901',
      serviceCategory: 'Wheel Alignment',
      date: '2025-11-01',
      time: '10:00 AM',
      estimatedPrice: 90.00,
      status: 'confirmed',
      customerName: 'Lisa Anderson',
      customerPhone: '+1-234-567-8907'
    }
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800',
      started: 'bg-yellow-100 text-yellow-800',
      ongoing: 'bg-purple-100 text-purple-800',
      finished: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      confirmed: ['started'],
      started: ['ongoing'],
      ongoing: ['finished'],
      finished: []
    };
    return statusFlow[currentStatus] || [];
  };

  const confirmedOrders = orders.filter(o => ['confirmed', 'started', 'ongoing'].includes(o.status));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
        <p className="text-gray-600 mt-2">Track and update the status of confirmed orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'confirmed').length}
              </p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => ['started', 'ongoing'].includes(o.status)).length}
              </p>
            </div>
            <div className="text-3xl">⚙️</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'finished').length}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {confirmedOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Orders</h3>
          <p className="text-gray-600">There are no orders to manage at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {confirmedOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              {/* Card Header */}
              <div className="bg-primary/10 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {order.vehicleCompany} {order.model}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{order.vehicleNumber}</p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="font-medium text-gray-900">{order.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Service</p>
                    <p className="font-medium text-gray-900">{order.serviceCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{order.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900 text-xs">{order.customerPhone}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-gray-500 text-sm">Estimated Price</p>
                  <p className="text-2xl font-bold text-primary">${order.estimatedPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50">
                <p className="text-xs text-gray-600 mb-2">Update Status:</p>
                <div className="flex gap-2">
                  {getNextStatuses(order.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(order.id, status)}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                  {getNextStatuses(order.status).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No further actions available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;

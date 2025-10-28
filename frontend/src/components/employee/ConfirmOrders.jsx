import React, { useState } from 'react';

const ConfirmOrders = () => {
  const [filter, setFilter] = useState('all');
  
  // Mock data - replace with actual API call
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      vehicle: 'Toyota Camry - ABC 1234',
      serviceType: 'Oil Change',
      date: '2025-10-27',
      time: '10:00 AM',
      status: 'Not Confirmed',
      estimatedCost: '$80'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      vehicle: 'Honda Civic - XYZ 5678',
      serviceType: 'Brake Inspection',
      date: '2025-10-28',
      time: '2:00 PM',
      status: 'Not Confirmed',
      estimatedCost: '$120'
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson',
      vehicle: 'Ford F-150 - DEF 9012',
      serviceType: 'Full Service',
      date: '2025-10-27',
      time: '3:30 PM',
      status: 'Not Confirmed',
      estimatedCost: '$250'
    },
  ]);

  const handleConfirm = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'Pending' } : order
    ));
    // Here you would make an API call to update the order status
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return order.status === 'Not Confirmed';
    return order.serviceType.toLowerCase().includes(filter.toLowerCase()) && order.status === 'Not Confirmed';
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">🧩</span>
              Confirm Orders
            </h2>
            <p className="text-gray-600 mt-1">Review and confirm new incoming orders</p>
          </div>
          
          {/* Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Services</option>
              <option value="oil">Oil Change</option>
              <option value="brake">Brake Service</option>
              <option value="full">Full Service</option>
              <option value="tire">Tire Service</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Pending Confirmation</p>
            <p className="text-2xl font-bold text-primary">{filteredOrders.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Today's Appointments</p>
            <p className="text-2xl font-bold text-green-600">5</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Awaiting Action</p>
            <p className="text-2xl font-bold text-yellow-600">3</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No orders pending confirmation at the moment.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{order.customerName}</h3>
                        <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
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
                        <span className="text-gray-600">🕐</span>
                        <span className="text-gray-700">{order.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm">💰</span>
                      <span className="text-lg font-semibold text-primary">{order.estimatedCost}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex lg:flex-col gap-3">
                    <button
                      onClick={() => handleConfirm(order.id)}
                      className="flex-1 lg:flex-none px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg"
                    >
                      ✓ Confirm Order
                    </button>
                    <button className="flex-1 lg:flex-none px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      View Details
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

export default ConfirmOrders;

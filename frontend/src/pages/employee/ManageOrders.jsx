import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('confirmed');

  // Fetch confirmed appointments from backend
  useEffect(() => {
    fetchConfirmedAppointments();
  }, []);

  const fetchConfirmedAppointments = async () => {
    try {
      setLoading(true);
      // Get all appointments, not just confirmed ones, so we can manage all statuses
      const appointments = await employeeService.getAllAppointmentsForManagement();
      console.log('All appointments for management:', appointments);
      
      // Filter to only show confirmed and subsequent statuses
      const relevantAppointments = appointments.filter(appointment => 
        ['CONFIRMED', 'PENDING', 'ONGOING', 'FINISHED'].includes(appointment.status.toUpperCase())
      );
      console.log('Filtered relevant appointments:', relevantAppointments);
      
      // Transform the data to match the expected format
      const transformedOrders = relevantAppointments.map(appointment => ({
        id: appointment.id,
        vehicleCompany: appointment.vehicle?.company || 'Unknown',
        model: appointment.vehicle?.model || 'Unknown',
        year: appointment.vehicle?.year || 'Unknown',
        vehicleNumber: appointment.vehicle?.vehicleNumber || 'Unknown',
        serviceCategory: appointment.service?.title || 'Unknown Service',
        date: appointment.date,
        time: appointment.time,
        estimatedPrice: appointment.estimatedCost || appointment.service?.estimatedPrice || 0,
        status: appointment.status.toLowerCase(),
        customerName: appointment.customer?.name || appointment.customer?.username || 'Unknown Customer',
        customerPhone: appointment.customer?.phone || 'Not provided',
        additionalNote: appointment.additionalNote || '',
        serviceDescription: appointment.service?.shortDescription || '',
        assignedEmployee: appointment.employee?.name || appointment.employee?.username || 'Not Assigned'
      }));

      console.log('Transformed orders:', transformedOrders);
      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error fetching confirmed appointments:', err);
      setError(`Failed to load confirmed appointments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log(`Attempting to change order ${orderId} status to ${newStatus}`);
      await employeeService.updateAppointmentStatus(orderId, newStatus.toUpperCase());
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      alert(`Order status updated to ${newStatus} successfully!`);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert(`Failed to update order status: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-yellow-100 text-yellow-800',
      finished: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      confirmed: ['ongoing'],
      ongoing: ['finished'],
      finished: []
    };
    return statusFlow[currentStatus] || [];
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-600 mt-2">Track and update the status of confirmed orders</p>
        </div>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading confirmed appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-600 mt-2">Track and update the status of confirmed orders</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button 
                onClick={fetchConfirmedAppointments}
                className="mt-2 text-sm text-red-800 underline hover:no-underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
        <p className="text-gray-600 mt-2">Track and update the status of confirmed orders</p>
      </div>

      {/* Status Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${
              activeTab === 'confirmed'
                ? 'bg-[#7A85C1] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Confirmed ({orders.filter(o => o.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${
              activeTab === 'ongoing'
                ? 'bg-[#7A85C1] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ongoing ({orders.filter(o => o.status === 'ongoing').length})
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${
              activeTab === 'finished'
                ? 'bg-[#7A85C1] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Finished ({orders.filter(o => o.status === 'finished').length})
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">
            {activeTab === 'confirmed' && '📋'}
            {activeTab === 'ongoing' && '⚙️'}
            {activeTab === 'finished' && '✅'}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === 'confirmed' && 'No Confirmed Orders'}
            {activeTab === 'ongoing' && 'No Ongoing Orders'}
            {activeTab === 'finished' && 'No Finished Orders'}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'confirmed' && 'There are no confirmed orders at the moment.'}
            {activeTab === 'ongoing' && 'There are no ongoing orders at the moment.'}
            {activeTab === 'finished' && 'There are no finished orders yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              {/* Card Header */}
              <div className="bg-primary/10 p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {order.vehicleCompany} {order.model}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">{order.vehicleNumber}</p>
              </div>

              {/* Card Body */}
              <div className="p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="font-medium text-gray-900">{order.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Service</p>
                    <p className="font-medium text-gray-900 truncate">{order.serviceCategory}</p>
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
                    <p className="font-medium text-gray-900 truncate">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900 text-xs truncate">{order.customerPhone}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-gray-500 text-xs">Estimated Price</p>
                  <p className="text-lg font-bold text-primary">${order.estimatedPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-3 bg-gray-50">
                <p className="text-xs text-gray-600 mb-2">Update Status:</p>
                <div className="flex gap-2">
                  {getNextStatuses(order.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(order.id, status)}
                      className="flex-1 bg-[#7A85C1] hover:bg-[#6a75a8] text-white font-medium py-2 px-3 rounded-lg transition-colors text-xs"
                    >
                      {status === 'ongoing' ? 'Start Work' : 'Mark Finished'}
                    </button>
                  ))}
                  {getNextStatuses(order.status).length === 0 && (
                    <p className="text-xs text-gray-500 italic text-center w-full">No further actions</p>
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
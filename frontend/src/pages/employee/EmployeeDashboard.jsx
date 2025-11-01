import React, { useState } from 'react';
import ConfirmOrders from '../../components/employee/ConfirmOrders';
import ManageOrders from '../../components/employee/ManageOrders';
import OrderHistory from '../../components/employee/OrderHistory';
import CustomerDetails from '../../components/employee/CustomerDetails';
import VehicleRecords from '../../components/employee/VehicleRecords';
import ServiceList from '../../components/employee/ServiceList';
import ScheduleAppointments from '../../components/employee/ScheduleAppointments';
import FeedBacks from '../../components/employee/FeedBacks'; // Added

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('confirm');

  const tabs = [
    { id: 'confirm', label: 'Confirm Orders', icon: '🧩' },
    { id: 'manage', label: 'Manage Orders', icon: '⚙️' },
    { id: 'history', label: 'Order History', icon: '🧾' },
    { id: 'customers', label: 'Customers', icon: '👤' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
    { id: 'services', label: 'Services', icon: '🧰' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'appointments', label: 'Feedback', icon: '💬' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'confirm':
        return <ConfirmOrders />;
      case 'manage':
        return <ManageOrders />;
      case 'history':
        return <OrderHistory />;
      case 'customers':
        return <CustomerDetails />;
      case 'vehicles':
        return <VehicleRecords />;
      case 'services':
        return <ServiceList />;
      case 'schedule':
        return <ScheduleAppointments />;
      case 'appointments': // Added
        return <FeedBacks />;
      default:
        return <ConfirmOrders />;
        
    }
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleConfirmOrder = (bookingId) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'confirmed' }
        : booking
    ));
    alert('Order confirmed successfully!');
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending_confirmation');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Confirm Orders</h1>
        <p className="text-gray-600 mt-2">Review and confirm pending service bookings</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Pending Confirmations</p>
            <p className="text-3xl font-bold text-gray-900">{pendingBookings.length}</p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </div>

      {/* Bookings Grid */}
      {pendingBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending bookings to confirm at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              {/* Card Header */}
              <div className="bg-primary/10 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.vehicleCompany} {booking.model}
                  </h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{booking.vehicleNumber}</p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="font-medium text-gray-900">{booking.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Service</p>
                    <p className="font-medium text-gray-900">{booking.serviceCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{booking.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{booking.time}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-gray-500 text-sm">Estimated Price</p>
                  <p className="text-2xl font-bold text-primary">${booking.estimatedPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50 flex gap-3">
                <button
                  onClick={() => handleConfirmOrder(booking.id)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Confirm Order
                </button>
                <button
                  onClick={() => handleViewDetails(booking)}
                  className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-primary text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Booking Details</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">{selectedBooking.vehicleCompany}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Model</p>
                    <p className="font-medium text-gray-900">{selectedBooking.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="font-medium text-gray-900">{selectedBooking.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vehicle Number</p>
                    <p className="font-medium text-gray-900">{selectedBooking.vehicleNumber}</p>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Service Category</p>
                    <p className="font-medium text-gray-900">{selectedBooking.serviceCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      {selectedBooking.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated Price</p>
                    <p className="text-xl font-bold text-primary">${selectedBooking.estimatedPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedBooking.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 rounded-b-lg flex gap-3">
              <button
                onClick={() => {
                  handleConfirmOrder(selectedBooking.id);
                  closeModal();
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Confirm Order
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Car, Wrench, FileText, DollarSign, MapPin, Phone } from 'lucide-react';
import adminService from '../../services/adminService';

const AppointmentDetailView = ({ appointmentId, onClose }) => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAppointmentById(appointmentId);
      setAppointment(data);
    } catch (err) {
      setError('Failed to fetch appointment details');
      console.error('Error fetching appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'REQUESTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PENDING': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ONGOING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FINISHED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A85C1]"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-[#7A85C1] text-white px-4 py-2 rounded-lg hover:bg-[#6B76B2]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#7A85C1] text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Appointment Details</h2>
              <p className="text-blue-100">ID: #{appointment.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full border-2 ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Appointment Info */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Time:</span>
                    <span className="ml-2">{formatTime(appointment.time)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span className="ml-2">{appointment.customer?.firstName} {appointment.customer?.lastName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{appointment.customer?.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Address:</span>
                    <span className="ml-2">{appointment.customer?.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {appointment.employee && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Assigned Mechanic
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{appointment.employee.firstName} {appointment.employee.lastName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{appointment.employee.phoneNumber || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Vehicle & Service Info */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Vehicle Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium">Make & Model:</span>
                    <span className="ml-2">{appointment.vehicle?.make} {appointment.vehicle?.model}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Year:</span>
                    <span className="ml-2">{appointment.vehicle?.year}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">License Plate:</span>
                    <span className="ml-2">{appointment.vehicle?.licensePlate}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Mileage:</span>
                    <span className="ml-2">{appointment.vehicle?.mileage || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Wrench className="w-5 h-5 mr-2" />
                  Service Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium">Service:</span>
                    <span className="ml-2">{appointment.service?.title}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Category:</span>
                    <span className="ml-2">{appointment.service?.category}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Estimated Cost:</span>
                    <span className="ml-2 text-green-600 font-semibold">
                      ${appointment.estimatedCost?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  {appointment.service?.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="ml-2 mt-1 text-gray-600 text-sm">{appointment.service.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {(appointment.additionalNote || appointment.serviceNotes) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Notes
              </h3>
              {appointment.additionalNote && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Customer Notes:</span>
                  <p className="mt-1 text-gray-600 bg-white p-3 rounded border">{appointment.additionalNote}</p>
                </div>
              )}
              {appointment.serviceNotes && (
                <div>
                  <span className="font-medium text-gray-700">Service Notes:</span>
                  <p className="mt-1 text-gray-600 bg-white p-3 rounded border">{appointment.serviceNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#7A85C1] text-white px-6 py-2 rounded-lg hover:bg-[#6B76B2] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailView;
import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Clock, User, DollarSign, Filter } from 'lucide-react';
import adminService from '../../services/adminService';
import AppointmentDetailView from '../../components/appointment/AppointmentDetailView';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Fetch appointments from API
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllAppointments();
      
      // Sort by date and time (newest first)
      const sortedAppointments = data.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeB - dateTimeA;
      });
      
      setAppointments(sortedAppointments);
    } catch (err) {
      setError('Failed to fetch appointments. Please try again.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (statusFilter === 'all') return true;
    return appointment.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      await adminService.updateAppointmentStatus(id, newStatus);
      setAppointments(prev => prev.map(appointment =>
        appointment.id === id
          ? { ...appointment, status: newStatus.toUpperCase() }
          : appointment
      ));
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  const handleViewAppointment = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowDetailView(true);
  };

  const handleCloseDetailView = () => {
    setShowDetailView(false);
    setSelectedAppointmentId(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'REQUESTED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-purple-100 text-purple-800';
      case 'PENDING': return 'bg-orange-100 text-orange-800';
      case 'ONGOING': return 'bg-yellow-100 text-yellow-800';
      case 'FINISHED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Manage Appointments</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A85C1]"></div>
          <span className="ml-3 text-gray-600">Loading appointments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Manage Appointments</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-[#7A85C1] text-white px-4 py-2 rounded-lg hover:bg-[#6B76B2]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Manage Appointments</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Total: {appointments.length} appointments</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1]"
            >
              <option value="all">All Status</option>
              <option value="requested">Requested</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Appointment List ({filteredAppointments.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mechanic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{appointment.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{formatDate(appointment.date)}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(appointment.time)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.customer?.firstName} {appointment.customer?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.customer?.phoneNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.vehicle?.make} {appointment.vehicle?.model}
                    </div>
                    <div className="text-sm text-gray-500">{appointment.vehicle?.licensePlate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.service?.title}</div>
                    <div className="text-sm text-gray-500">{appointment.service?.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {appointment.employee ? 
                        `${appointment.employee.firstName} ${appointment.employee.lastName}` : 
                        'Not assigned'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {appointment.estimatedCost?.toFixed(2) || '0.00'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewAppointment(appointment.id)}
                      className="inline-flex items-center px-3 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                    
                    {appointment.status === 'REQUESTED' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')}
                        className="px-3 py-1 rounded text-xs bg-purple-100 text-purple-800 hover:bg-purple-200"
                      >
                        Confirm
                      </button>
                    )}
                    
                    {appointment.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'ONGOING')}
                        className="px-3 py-1 rounded text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      >
                        Start
                      </button>
                    )}
                    
                    {appointment.status === 'ONGOING' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'FINISHED')}
                        className="px-3 py-1 rounded text-xs bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        Complete
                      </button>
                    )}
                    
                    {!['FINISHED', 'CANCELLED'].includes(appointment.status) && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                        className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900 mb-2">No appointments found</p>
            <p>No appointments match your current filter criteria.</p>
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      {showDetailView && (
        <AppointmentDetailView
          appointmentId={selectedAppointmentId}
          onClose={handleCloseDetailView}
        />
      )}
    </div>
  );
};

export default ManageAppointments;
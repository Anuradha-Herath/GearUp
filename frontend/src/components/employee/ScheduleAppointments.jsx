import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';

const ScheduleAppointments = () => {
  const [viewMode, setViewMode] = useState('today'); // today, tomorrow, week
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all appointments
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Fetch only confirmed appointments from the backend
      const confirmedAppointments = await employeeService.getConfirmedAppointments();
      
      // Transform appointments to the format expected by this component
      const transformedAppointments = confirmedAppointments.map(apt => ({
        id: apt.id,
        date: apt.date,
        time: apt.time,
        customer: apt.customer?.username || 'Unknown Customer',
        vehicle: `${apt.vehicle?.company || ''} ${apt.vehicle?.model || ''} (${apt.vehicle?.vehicleNumber || ''})`.trim(),
        service: apt.service?.title || 'Unknown Service',
        technician: apt.employee?.username || 'Unassigned',
        status: apt.status === 'CONFIRMED' ? 'Confirmed' : apt.status === 'PENDING' ? 'Pending' : apt.status,
        priority: 'Normal', // You can add priority logic based on service type or date
        duration: '1-2 hrs', // You can calculate this based on service type
        notes: apt.additionalNote || ''
      }));
      
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get dates for the current week
  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday
    
    const weekDates = [];
    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
      weekDates.push(d.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  const getFilteredAppointments = () => {
    const today = getTodayDate();
    const tomorrow = getTomorrowDate();
    const weekDates = getWeekDates();
    
    switch (viewMode) {
      case 'today':
        return appointments.filter(apt => apt.date === today);
      case 'tomorrow':
        return appointments.filter(apt => apt.date === tomorrow);
      case 'week':
        return appointments.filter(apt => weekDates.includes(apt.date));
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  const getPriorityColor = (priority) => {
    return priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (status) => {
    return status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const groupByTechnician = (appointments) => {
    const grouped = {};
    appointments.forEach(apt => {
      if (!grouped[apt.technician]) {
        grouped[apt.technician] = [];
      }
      grouped[apt.technician].push(apt);
    });
    return grouped;
  };

  const technicianGroups = groupByTechnician(filteredAppointments);

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const today = getTodayDate();
  const tomorrow = getTomorrowDate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">`
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">📅</span>
              Schedule & Appointments
            </h2>
            <p className="text-gray-600 mt-1">View and manage upcoming appointments</p>
          </div>

          {/* View Mode Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('today')}
              className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                viewMode === 'today'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today ({formatDisplayDate(today)})
            </button>
            <button
              onClick={() => setViewMode('tomorrow')}
              className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                viewMode === 'tomorrow'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tomorrow ({formatDisplayDate(tomorrow)})
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                viewMode === 'week'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Today's Appointments</p>
            <p className="text-2xl font-bold text-primary">
              {appointments.filter(a => a.date === today).length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredAppointments.filter(a => a.status === 'Confirmed').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredAppointments.filter(a => a.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">High Priority</p>
            <p className="text-2xl font-bold text-red-600">
              {filteredAppointments.filter(a => a.priority === 'High').length}
            </p>
          </div>
        </div>
      </div>

      {/* Appointments by Technician */}
      <div className="space-y-4">
        {Object.entries(technicianGroups).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Appointments</h3>
            <p className="text-gray-600">No appointments scheduled for this period.</p>
          </div>
        ) : (
          Object.entries(technicianGroups).map(([technician, techAppointments]) => (
            <div key={technician} className="bg-white rounded-lg shadow-md">
              <div className="bg-background-dark text-white px-6 py-3 rounded-t-lg">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span>👨‍🔧</span>
                  <span>{technician}</span>
                  <span className="ml-auto bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {techAppointments.length} appointments
                  </span>
                </h3>
              </div>

              <div className="p-6 space-y-3">
                {techAppointments
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Time */}
                        <div className="lg:w-32">
                          <div className="bg-primary bg-opacity-10 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{appointment.time}</p>
                            <p className="text-xs text-gray-600">{appointment.duration}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-gray-800">{appointment.customer}</h4>
                              <p className="text-sm text-gray-600">{appointment.vehicle}</p>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                              {appointment.priority === 'High' && (
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(appointment.priority)}`}>
                                  {appointment.priority}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-gray-700">
                              <span>🔧</span>
                              {appointment.service}
                            </span>
                            <span className="flex items-center gap-1 text-gray-700">
                              <span>📅</span>
                              {formatDisplayDate(appointment.date)}
                            </span>
                          </div>

                          {appointment.notes && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                              <p className="text-xs text-gray-700">
                                <span className="font-medium">Note:</span> {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="lg:w-40 flex lg:flex-col gap-2">
                          <button
                            onClick={() => setSelectedAppointment(appointment)}
                            className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                          >
                            View Details
                          </button>
                          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Appointment Details</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Appointment ID</p>
                      <p className="font-medium text-gray-800">{selectedAppointment.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium text-gray-800">{formatDisplayDate(selectedAppointment.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time</p>
                      <p className="font-medium text-gray-800">{selectedAppointment.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium text-gray-800">{selectedAppointment.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Priority</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getPriorityColor(selectedAppointment.priority)}`}>
                        {selectedAppointment.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-3">Customer & Vehicle</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Customer Name</p>
                      <p className="font-medium text-gray-800">{selectedAppointment.customer}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Vehicle</p>
                      <p className="font-medium text-gray-800">{selectedAppointment.vehicle}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-3">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Service Type</p>
                      <p className="font-medium text-gray-800">{selectedAppointment.service}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Assigned Technician</p>
                      <p className="font-medium text-gray-800">{selectedAppointment.technician}</p>
                    </div>
                    {selectedAppointment.notes && (
                      <div>
                        <p className="text-gray-600">Notes</p>
                        <p className="font-medium text-gray-800">{selectedAppointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors">
                  Mark as Completed
                </button>
                <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleAppointments;   
import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';

const Schedule = () => {
  // State for appointments
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await employeeService.getAllAppointments();
        
        // Transform backend data to match expected format
        const transformedAppointments = data.map(appointment => ({
          id: appointment.id,
          date: appointment.date, // Assuming date is in YYYY-MM-DD format
          time: appointment.time, // Assuming time is in HH:MM AM/PM format
          endTime: appointment.endTime || calculateEndTime(appointment.time, 60), // fallback to 1 hour if not provided
          customerName: appointment.customer?.username || appointment.customer?.name || 'Unknown',
          vehicleNumber: appointment.vehicle?.vehicleNumber || 'N/A',
          service: appointment.service?.title || appointment.service?.name || 'Service',
          status: appointment.status?.toLowerCase() || 'pending'
        }));
        
        setAppointments(transformedAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Helper function to calculate end time
  const calculateEndTime = (startTime, durationMinutes) => {
    // Simple calculation - in production, use a proper time library
    try {
      const [time, period] = startTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = (hours % 12) * 60 + minutes + durationMinutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      const endPeriod = endHours >= 12 ? 'PM' : 'AM';
      const displayHours = endHours % 12 || 12;
      
      return `${displayHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
    } catch (e) {
      return 'N/A';
    }
  };

  // Get unique dates from appointments
  const uniqueDates = [...new Set(appointments.map(apt => apt.date))].sort();

  // Group appointments by date for week view
  const groupedByDate = uniqueDates.reduce((acc, date) => {
    acc[date] = appointments.filter(apt => apt.date === date);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    return status === 'confirmed' 
      ? 'bg-green-100 text-green-800 border-green-300' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-800">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold">Error Loading Appointments</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Schedule & Appointments</h1>
        <p className="text-gray-600 mt-2">View booked dates and appointment times</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Days Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueDates.length}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
      </div>

      {/* Week View */}
      <div className="space-y-4">
        {uniqueDates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments</h3>
            <p className="text-gray-600">No appointments scheduled yet.</p>
          </div>
        ) : (
          uniqueDates.map((date) => (
            <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-primary/10 p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{formatDate(date)}</h3>
                  <span className="text-sm text-gray-600">
                    {groupedByDate[date].length} appointment{groupedByDate[date].length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedByDate[date].map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="bg-primary/10 rounded-lg p-2 text-center min-w-[70px]">
                          <p className="text-sm font-semibold text-primary">{appointment.time}</p>
                          <p className="text-xs text-gray-500">{appointment.endTime}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{appointment.customerName}</p>
                      <p className="text-sm text-gray-600 mb-2">{appointment.service}</p>
                      <p className="text-xs text-gray-500">{appointment.vehicleNumber}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;
import React, { useState } from 'react';

const Schedule = () => {
  // Mock data for scheduled appointments
  const [appointments] = useState([
    {
      id: 1,
      date: '2025-11-05',
      time: '09:00 AM',
      endTime: '09:30 AM',
      customerName: 'John Doe',
      vehicleNumber: 'ABC-1234',
      service: 'Oil Change',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2025-11-05',
      time: '10:00 AM',
      endTime: '10:45 AM',
      customerName: 'Jane Smith',
      vehicleNumber: 'XYZ-5678',
      service: 'Brake Inspection',
      status: 'confirmed'
    },
    {
      id: 3,
      date: '2025-11-05',
      time: '11:30 AM',
      endTime: '12:15 PM',
      customerName: 'Mike Johnson',
      vehicleNumber: 'DEF-9012',
      service: 'Tire Rotation',
      status: 'pending'
    },
    {
      id: 4,
      date: '2025-11-05',
      time: '02:00 PM',
      endTime: '03:00 PM',
      customerName: 'Sarah Williams',
      vehicleNumber: 'GHI-3456',
      service: 'Battery Check',
      status: 'confirmed'
    },
    {
      id: 5,
      date: '2025-11-06',
      time: '09:00 AM',
      endTime: '10:00 AM',
      customerName: 'Robert Brown',
      vehicleNumber: 'BMW-7890',
      service: 'Engine Diagnostics',
      status: 'confirmed'
    },
    {
      id: 6,
      date: '2025-11-06',
      time: '10:30 AM',
      endTime: '12:00 PM',
      customerName: 'Emily Davis',
      vehicleNumber: 'MER-4567',
      service: 'Transmission Service',
      status: 'confirmed'
    },
    {
      id: 7,
      date: '2025-11-06',
      time: '01:00 PM',
      endTime: '02:00 PM',
      customerName: 'David Wilson',
      vehicleNumber: 'AUD-1234',
      service: 'AC Service',
      status: 'pending'
    },
    {
      id: 8,
      date: '2025-11-06',
      time: '03:00 PM',
      endTime: '04:00 PM',
      customerName: 'Lisa Anderson',
      vehicleNumber: 'LEX-8901',
      service: 'Wheel Alignment',
      status: 'confirmed'
    },
    {
      id: 9,
      date: '2025-11-07',
      time: '09:30 AM',
      endTime: '10:00 AM',
      customerName: 'Michael Chen',
      vehicleNumber: 'TOY-1111',
      service: 'Oil Change',
      status: 'confirmed'
    },
    {
      id: 10,
      date: '2025-11-07',
      time: '11:00 AM',
      endTime: '01:00 PM',
      customerName: 'Jessica Taylor',
      vehicleNumber: 'HON-2222',
      service: 'Brake Replacement',
      status: 'pending'
    },
    {
      id: 11,
      date: '2025-11-07',
      time: '02:00 PM',
      endTime: '04:00 PM',
      customerName: 'Chris Martinez',
      vehicleNumber: 'NIS-3333',
      service: 'Engine Tune-up',
      status: 'confirmed'
    },
    {
      id: 12,
      date: '2025-11-08',
      time: '10:00 AM',
      endTime: '11:30 AM',
      customerName: 'Amanda White',
      vehicleNumber: 'CHV-4444',
      service: 'Tire Replacement',
      status: 'confirmed'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState('2025-11-05');
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'

  // Get unique dates from appointments
  const uniqueDates = [...new Set(appointments.map(apt => apt.date))].sort();

  // Filter appointments by selected date
  const filteredAppointments = appointments.filter(apt => apt.date === selectedDate);

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

  const getTodayStats = () => {
    const today = filteredAppointments;
    return {
      total: today.length,
      confirmed: today.filter(a => a.status === 'confirmed').length,
      pending: today.filter(a => a.status === 'pending').length
    };
  };

  const stats = getTodayStats();

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
              <p className="text-sm text-gray-600">Today's Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Date Selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Select Date:</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                viewMode === 'day'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                viewMode === 'week'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week View
            </button>
          </div>
        </div>
      </div>

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-primary/10 p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Schedule for {formatDate(selectedDate)}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments</h3>
                <p className="text-gray-600">No appointments scheduled for this date.</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-primary/10 rounded-lg p-3 text-center min-w-[80px]">
                        <p className="text-sm font-medium text-gray-600">{appointment.time}</p>
                        <p className="text-xs text-gray-500">{appointment.endTime}</p>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{appointment.customerName}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                            {appointment.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{appointment.service}</span> • {appointment.vehicleNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="space-y-4">
          {uniqueDates.map((date) => (
            <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-primary/10 p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{formatDate(date)}</h3>
                  <span className="text-sm text-gray-600">
                    {groupedByDate[date].length} appointment{groupedByDate[date].length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupedByDate[date].map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-3 hover:border-primary transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-semibold text-primary">{appointment.time}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{appointment.customerName}</p>
                      <p className="text-xs text-gray-600">{appointment.service}</p>
                      <p className="text-xs text-gray-500 mt-1">{appointment.vehicleNumber}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;

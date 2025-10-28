import React, { useState, useEffect } from 'react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // Dummy data for customer bookings
  useEffect(() => {
    const dummyBookings = [
      {
        id: 1,
        service: 'Oil Change',
        date: '2024-10-28',
        time: '10:00',
        status: 'Confirmed',
        mechanic: 'Mike Johnson',
        estimatedCost: '$45',
        notes: 'Regular maintenance service'
      },
      {
        id: 2,
        service: 'Brake Inspection',
        date: '2024-10-25',
        time: '14:30',
        status: 'Completed',
        mechanic: 'Tom Wilson',
        estimatedCost: '$80',
        notes: 'Brakes are in good condition'
      },
      {
        id: 3,
        service: 'Tire Replacement',
        date: '2024-10-20',
        time: '09:00',
        status: 'Completed',
        mechanic: 'Lisa Chen',
        estimatedCost: '$120',
        notes: 'Replaced all 4 tires with premium brand'
      },
      {
        id: 4,
        service: 'Engine Tune-up',
        date: '2024-11-02',
        time: '11:00',
        status: 'Scheduled',
        mechanic: 'Mike Johnson',
        estimatedCost: '$150',
        notes: 'Full engine diagnostic and tune-up'
      },
      {
        id: 5,
        service: 'AC Repair',
        date: '2024-10-15',
        time: '16:00',
        status: 'Cancelled',
        mechanic: 'Tom Wilson',
        estimatedCost: '$95',
        notes: 'Customer cancelled the appointment'
      },
    ];

    // Sort by date and time (newest first)
    const sortedBookings = dummyBookings.sort((a, b) => {
      const dateTimeA = new Date(`${a.date} ${a.time}`);
      const dateTimeB = new Date(`${b.date} ${b.time}`);
      return dateTimeB - dateTimeA; // Newest first
    });

    setBookings(sortedBookings);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    return statusFilter === 'all' || booking.status.toLowerCase() === statusFilter;
  });

  const cancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => prev.map(booking =>
        booking.id === id
          ? { ...booking, status: 'Cancelled' }
          : booking
      ));
      alert('Booking cancelled successfully!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">Manage your service appointments and track their progress.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md border mb-6">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1]"
              >
                <option value="all">All Bookings</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border p-8 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-sm">You don't have any bookings matching the selected filter.</p>
              </div>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
                        <p className="text-sm text-gray-600">Booking #{booking.id}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#7A85C1]">{booking.estimatedCost}</p>
                      <p className="text-sm text-gray-600">Estimated Cost</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium">{booking.date} at {booking.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Assigned Mechanic</p>
                      <p className="font-medium">{booking.mechanic}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Service Notes</p>
                      <p className="font-medium text-sm">{booking.notes}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    {booking.status === 'Scheduled' || booking.status === 'Confirmed' ? (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    ) : null}
                    <button className="px-4 py-2 bg-[#7A85C1] text-white text-sm font-medium rounded-lg hover:bg-[#6a75a8] transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border">
            <div className="text-sm text-gray-600">Total Bookings</div>
            <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'Completed').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border">
            <div className="text-sm text-gray-600">Upcoming</div>
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'Scheduled' || b.status === 'Confirmed').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border">
            <div className="text-sm text-gray-600">Total Spent</div>
            <div className="text-2xl font-bold text-[#7A85C1]">
              ${bookings.filter(b => b.status === 'Completed').reduce((sum, b) => {
                return sum + parseInt(b.estimatedCost.replace('$', ''));
              }, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
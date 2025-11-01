import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointments = await appointmentService.getMyAppointments();
        
        // Transform the data to match the expected format
        const transformedBookings = appointments.map(appointment => ({
          id: appointment.id,
          service: appointment.service?.title || 'Unknown Service',
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          mechanic: appointment.employee?.name || appointment.employee?.username || 'Not Assigned',
          estimatedCost: `$${appointment.estimatedCost || appointment.service?.estimatedPrice || 0}`,
          notes: appointment.additionalNote || appointment.serviceNotes || '',
          vehicle: `${appointment.vehicle?.company || ''} ${appointment.vehicle?.model || ''}`.trim(),
          vehicleNumber: appointment.vehicle?.vehicleNumber || '',
          serviceDescription: appointment.service?.shortDescription || ''
        }));

        // Sort by date and time (newest first)
        const sortedBookings = transformedBookings.sort((a, b) => {
          const dateTimeA = new Date(`${a.date} ${a.time}`);
          const dateTimeB = new Date(`${b.date} ${b.time}`);
          return dateTimeB - dateTimeA; // Newest first
        });

        setBookings(sortedBookings);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter === 'all') return true;
    return booking.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const cancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await appointmentService.deleteAppointment(id);
        // Update local state to reflect the change
        setBookings(prev => prev.filter(booking => booking.id !== id));
        alert('Booking cancelled successfully!');
      } catch (err) {
        console.error('Error cancelling appointment:', err);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-purple-100 text-purple-800';
      case 'finished': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md border p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A85C1] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!loading && !error && (
          <>
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
                    <option value="requested">Requested</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="finished">Finished</option>
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
                            {booking.vehicle && (
                              <p className="text-sm text-gray-500">{booking.vehicle} - {booking.vehicleNumber}</p>
                            )}
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
                          <p className="font-medium text-sm">{booking.notes || 'No notes'}</p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        {(booking.status.toLowerCase() === 'requested' || booking.status.toLowerCase() === 'confirmed') ? (
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
                  {bookings.filter(b => b.status.toLowerCase() === 'finished').length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border">
                <div className="text-sm text-gray-600">Upcoming</div>
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => ['requested', 'confirmed', 'pending'].includes(b.status.toLowerCase())).length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border">
                <div className="text-sm text-gray-600">Total Spent</div>
                <div className="text-2xl font-bold text-[#7A85C1]">
                  ${bookings.filter(b => b.status.toLowerCase() === 'finished').reduce((sum, b) => {
                    return sum + parseFloat(b.estimatedCost.replace('$', '')) || 0;
                  }, 0).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
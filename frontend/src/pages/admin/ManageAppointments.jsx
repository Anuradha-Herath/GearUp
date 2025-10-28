import React, { useState, useEffect } from 'react';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // Dummy data for appointments
  useEffect(() => {
    const dummyAppointments = [
      { id: 1, customerName: 'John Smith', service: 'Oil Change', date: '2024-10-28', time: '10:00', status: 'Scheduled', mechanic: 'Mike Johnson', notes: 'Regular maintenance' },
      { id: 2, customerName: 'Sarah Johnson', service: 'Brake Inspection', date: '2024-10-28', time: '11:30', status: 'In Progress', mechanic: 'Tom Wilson', notes: 'Customer reported squeaking' },
      { id: 3, customerName: 'Mike Davis', service: 'Tire Replacement', date: '2024-10-27', time: '14:00', status: 'Completed', mechanic: 'Lisa Chen', notes: 'Replaced all 4 tires' },
      { id: 4, customerName: 'Emily Wilson', service: 'Engine Tune-up', date: '2024-10-27', time: '09:00', status: 'Completed', mechanic: 'Mike Johnson', notes: 'Full engine diagnostic' },
      { id: 5, customerName: 'David Brown', service: 'Battery Replacement', date: '2024-10-26', time: '16:00', status: 'Cancelled', mechanic: 'Tom Wilson', notes: 'Customer cancelled' },
      { id: 6, customerName: 'Lisa Garcia', service: 'AC Repair', date: '2024-10-26', time: '13:00', status: 'Completed', mechanic: 'Lisa Chen', notes: 'Recharged AC system' },
      { id: 7, customerName: 'Tom Anderson', service: 'Transmission Service', date: '2024-10-25', time: '11:00', status: 'Scheduled', mechanic: 'Mike Johnson', notes: 'Fluid change and filter' },
      { id: 8, customerName: 'Jennifer Lee', service: 'Wheel Alignment', date: '2024-10-25', time: '15:30', status: 'In Progress', mechanic: 'Tom Wilson', notes: 'After tire replacement' },
    ];

    // Sort by date and time (newest first)
    const sortedAppointments = dummyAppointments.sort((a, b) => {
      const dateTimeA = new Date(`${a.date} ${a.time}`);
      const dateTimeB = new Date(`${b.date} ${b.time}`);
      return dateTimeB - dateTimeA; // Newest first
    });

    setAppointments(sortedAppointments);
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    return statusFilter === 'all' || appointment.status.toLowerCase().replace(' ', '-') === statusFilter;
  });

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(appointment =>
      appointment.id === id
        ? { ...appointment, status: newStatus }
        : appointment
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Manage Appointments</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="flex gap-4">
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1]"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mechanic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{appointment.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{appointment.mechanic}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{appointment.notes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {appointment.status === 'Scheduled' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'In Progress')}
                        className="px-3 py-1 rounded text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      >
                        Start
                      </button>
                    )}
                    {appointment.status === 'In Progress' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}
                        className="px-3 py-1 rounded text-xs bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        Complete
                      </button>
                    )}
                    {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'Cancelled')}
                        className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        Cancel
                      </button>
                    )}
                    <button className="px-3 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No appointments found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAppointments;
import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';
import { useToast } from '../../context/ToastContext';

const History = () => {
  const [finishedServices, setFinishedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Fetch finished services from backend
  useEffect(() => {
    fetchFinishedServices();
  }, []);

  const fetchFinishedServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const appointments = await employeeService.getAllAppointmentsForManagement();
      
      // Filter only finished appointments
      const finishedAppointments = appointments.filter(
        appointment => appointment.status.toUpperCase() === 'FINISHED'
      );
      
      // Transform the data to match the expected format
      const transformedServices = finishedAppointments.map(appointment => ({
        id: appointment.id,
        vehicleCompany: appointment.vehicle?.company || 'Unknown',
        model: appointment.vehicle?.model || 'Unknown',
        year: appointment.vehicle?.year || 'Unknown',
        vehicleNumber: appointment.vehicle?.vehicleNumber || 'Unknown',
        serviceCategory: appointment.service?.title || 'Unknown Service',
        date: appointment.date,
        time: appointment.time,
        estimatedPrice: appointment.estimatedCost || appointment.service?.estimatedPrice || 0,
        actualPrice: appointment.estimatedCost || appointment.service?.estimatedPrice || 0,
        status: 'finished',
        completedDate: appointment.date,
        customerName: appointment.customer?.name || appointment.customer?.username || 'Unknown Customer',
        customerPhone: appointment.customer?.phone || 'Not provided',
        notes: appointment.additionalNote || 'Service completed successfully.',
        serviceDescription: appointment.service?.shortDescription || ''
      }));

      // Sort by date descending (most recent first - last finished service shows first)
      const sortedServices = transformedServices.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // If dates are different, sort by date
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB - dateA; // Descending order (newest first)
        }
        
        // If dates are same, sort by time
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeB.localeCompare(timeA); // Descending order (latest time first)
      });

      setFinishedServices(sortedServices);
    } catch (err) {
      console.error('Error fetching finished services:', err);
      setError('Failed to load service history. Please try again.');
      toast.error('Failed to load service history');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = finishedServices.filter(service => 
    service.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const totalRevenue = finishedServices.reduce((sum, service) => sum + service.actualPrice, 0);
  const avgServicePrice = finishedServices.length > 0 ? totalRevenue / finishedServices.length : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service History</h1>
          <p className="text-gray-600 mt-2">View all completed services and past orders</p>
        </div>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading service history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service History</h1>
          <p className="text-gray-600 mt-2">View all completed services and past orders</p>
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
                onClick={fetchFinishedServices}
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
        <h1 className="text-3xl font-bold text-gray-900">Service History</h1>
        <p className="text-gray-600 mt-2">View all completed services and past orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Completed</p>
              <p className="text-2xl font-bold text-gray-900">{finishedServices.length}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Service Price</p>
              <p className="text-2xl font-bold text-gray-900">${avgServicePrice.toFixed(2)}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search by vehicle number, customer name, or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Services Table */}
      {finishedServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Finished Services</h3>
          <p className="text-gray-600">There are no completed services in the history yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {service.vehicleCompany} {service.model}
                      </p>
                      <p className="text-sm text-gray-500">{service.vehicleNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{service.serviceCategory}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{service.customerName}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{service.completedDate}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-primary">${service.actualPrice.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(service)}
                      className="text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        )}
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-green-600 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Service Details</h2>
              <p className="text-green-100 text-sm mt-1">Completed on {selectedService.completedDate}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">{selectedService.vehicleCompany}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Model</p>
                    <p className="font-medium text-gray-900">{selectedService.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="font-medium text-gray-900">{selectedService.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vehicle Number</p>
                    <p className="font-medium text-gray-900">{selectedService.vehicleNumber}</p>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Service Category</p>
                    <p className="font-medium text-gray-900">{selectedService.serviceCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Scheduled Date</p>
                    <p className="font-medium text-gray-900">{selectedService.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated Price</p>
                    <p className="font-medium text-gray-900">${selectedService.estimatedPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Actual Price</p>
                    <p className="text-xl font-bold text-green-600">${selectedService.actualPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500 text-sm mb-1">Service Notes</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedService.notes}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedService.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedService.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 rounded-b-lg">
              <button
                onClick={closeModal}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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

export default History;

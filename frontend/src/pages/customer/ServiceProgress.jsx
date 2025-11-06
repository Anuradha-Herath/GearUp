import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';

const ServiceProgress = () => {
  const [activeServices, setActiveServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchActiveServices();
  }, []);

  const fetchActiveServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const appointments = await appointmentService.getMyAppointments();
      
      // Filter out finished and cancelled appointments
      const activeAppointments = appointments.filter(
        appointment => !['FINISHED', 'CANCELLED'].includes(appointment.status.toUpperCase())
      );
      
      // Sort by date and time (newest first)
      const sortedAppointments = activeAppointments.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB - dateA;
        }
        
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeB.localeCompare(timeA);
      });
      
      setActiveServices(sortedAppointments);
    } catch (err) {
      console.error('Error fetching active services:', err);
      setError('Failed to load service progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      REQUESTED: 'bg-blue-100 text-blue-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      ONGOING: 'bg-purple-100 text-purple-800'
    };
    return colors[status.toUpperCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      REQUESTED: '📋',
      PENDING: '⏳',
      CONFIRMED: '✅',
      ONGOING: '🔧'
    };
    return icons[status.toUpperCase()] || '📌';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Services</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchActiveServices}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service Progress</h1>
        <p className="text-gray-600 mt-2">Track your active service appointments in real-time</p>
      </div>

      {/* Active Services Count */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">Active Services</p>
            <p className="text-4xl font-bold mt-1">{activeServices.length}</p>
          </div>
          <div className="text-5xl">🚗</div>
        </div>
      </div>

      {/* Services List */}
      {activeServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Services</h3>
          <p className="text-gray-600">You don't have any services in progress at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeServices.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="p-6">
                {/* Service Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getStatusIcon(service.status)}</span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {service.service?.title || 'Unknown Service'}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {service.vehicle?.company} {service.vehicle?.model} - {service.vehicle?.vehicleNumber}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>

                {/* Service Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Scheduled Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(service.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Scheduled Time</p>
                    <p className="font-semibold text-gray-900">{formatTime(service.time)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Estimated Cost</p>
                    <p className="font-semibold text-primary text-lg">
                      ${service.estimatedCost || service.service?.estimatedPrice || 0}
                    </p>
                  </div>
                </div>

                {/* Time Logs */}
                {service.timeLogs && service.timeLogs.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Work Progress</h4>
                    <div className="space-y-2">
                      {service.timeLogs.map((log, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{log.description}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                By: {log.employee?.username || 'Unknown'}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-xs text-gray-500">
                                {new Date(log.startTime).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {log.endTime && (
                                <p className="text-xs font-semibold text-primary mt-1">
                                  Duration: {log.duration} mins
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {service.additionalNote && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      {service.additionalNote}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleViewDetails(service)}
                  className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Service Details</h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="text-3xl">{getStatusIcon(selectedService.status)}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedService.service?.title || 'Unknown Service'}
                  </h3>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedService.status)}`}>
                    {selectedService.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium text-gray-900">
                    {selectedService.vehicle?.company} {selectedService.vehicle?.model}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Number</p>
                  <p className="font-medium text-gray-900">{selectedService.vehicle?.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scheduled Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedService.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scheduled Time</p>
                  <p className="font-medium text-gray-900">{formatTime(selectedService.time)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Cost</p>
                  <p className="font-bold text-primary text-lg">
                    ${selectedService.estimatedCost || selectedService.service?.estimatedPrice || 0}
                  </p>
                </div>
                {selectedService.employee && (
                  <div>
                    <p className="text-sm text-gray-500">Assigned Mechanic</p>
                    <p className="font-medium text-gray-900">
                      {selectedService.employee.username || 'Not Assigned'}
                    </p>
                  </div>
                )}
              </div>

              {selectedService.service?.shortDescription && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Service Description</p>
                  <p className="text-gray-700">{selectedService.service.shortDescription}</p>
                </div>
              )}

              {selectedService.timeLogs && selectedService.timeLogs.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Complete Work Log</h4>
                  <div className="space-y-3">
                    {selectedService.timeLogs.map((log, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900">{log.description}</p>
                          {log.endTime && (
                            <span className="text-sm font-semibold text-primary">
                              {log.duration} mins
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Mechanic: {log.employee?.username || 'Unknown'}</p>
                          <p>Started: {new Date(log.startTime).toLocaleString()}</p>
                          {log.endTime && (
                            <p>Ended: {new Date(log.endTime).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedService.additionalNote && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Additional Notes</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
                    {selectedService.additionalNote}
                  </p>
                </div>
              )}
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

export default ServiceProgress;
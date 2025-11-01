import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import appointmentService from '../../services/appointmentService';

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });

  useEffect(() => {
    // Check if a service was selected from the Services page
    if (location.state?.selectedService) {
      setSelectedService(location.state.selectedService);
    }
    
    // Fetch services and vehicles when component mounts
    fetchData();
  }, [location.state]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [servicesData, vehiclesData] = await Promise.all([
        appointmentService.getAvailableServices(),
        appointmentService.getMyVehicles()
      ]);
      
      setServices(servicesData);
      setVehicles(vehiclesData);
      
      console.log('Fetched services:', servicesData);
      console.log('Fetched vehicles:', vehiclesData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedService) {
      alert('Please select a service');
      return;
    }
    
    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }

    try {
      // Prepare appointment data for backend
      const appointmentData = {
        service: { id: selectedService.id },
        vehicle: { id: selectedVehicle.id },
        date: formData.preferredDate,
        time: formData.preferredTime,
        additionalNote: formData.additionalNotes,
        estimatedCost: selectedService.estimatedPrice
      };

      console.log('Submitting appointment:', appointmentData);

      const response = await appointmentService.createAppointment(appointmentData);
      console.log('Appointment created:', response);

      // Show success message and redirect
      alert('Appointment booked successfully!');
      navigate('/customer/my-bookings');
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Schedule your vehicle service with our expert technicians</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button 
              onClick={fetchData}
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Service</h2>

              {selectedService ? (
                <div className="border border-primary rounded-lg p-4 bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🔧</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedService.title}</h3>
                        <p className="text-sm text-gray-600">{selectedService.estimatedDuration}</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">${selectedService.estimatedPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{selectedService.shortDescription}</p>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Change Service
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">🔧</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{service.title}</h3>
                            <p className="text-sm text-gray-600">{service.estimatedDuration}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-primary">${service.estimatedPrice}</span>
                      </div>
                      {service.shortDescription && (
                        <p className="text-sm text-gray-500 mt-2">{service.shortDescription}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vehicle Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Vehicle Information</h3>
                  
                  {vehicles.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-2">No vehicles found in your account.</p>
                      <p className="text-sm text-gray-500">Please add a vehicle first to book an appointment.</p>
                      <button
                        type="button"
                        onClick={() => navigate('/customer/my-vehicles')}
                        className="mt-2 text-primary hover:text-primary/80 underline"
                      >
                        Add Vehicle
                      </button>
                    </div>
                  ) : selectedVehicle ? (
                    <div className="border border-primary rounded-lg p-4 bg-primary/5">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {selectedVehicle.company} {selectedVehicle.model} ({selectedVehicle.year})
                          </h4>
                          <p className="text-sm text-gray-600">Vehicle Number: {selectedVehicle.vehicleNumber}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedVehicle(null)}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Change Vehicle
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          onClick={() => handleVehicleSelect(vehicle)}
                          className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {vehicle.company} {vehicle.model} ({vehicle.year})
                              </h4>
                              <p className="text-sm text-gray-600">Vehicle Number: {vehicle.vehicleNumber}</p>
                            </div>
                            <span className="text-2xl">🚗</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              {/* Appointment Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Preferred Date & Time</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any specific concerns or requests..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedService || !selectedVehicle || vehicles.length === 0}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {!selectedService 
                  ? 'Please Select a Service' 
                  : !selectedVehicle 
                    ? 'Please Select a Vehicle'
                    : vehicles.length === 0
                      ? 'Add a Vehicle First'
                      : 'Book Appointment'
                }
              </button>
            </form>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
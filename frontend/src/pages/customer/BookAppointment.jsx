import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });

  useEffect(() => {
    // Check if a service was selected from the Services page
    if (location.state?.selectedService) {
      setSelectedService(location.state.selectedService);
    }
  }, [location.state]);

  const services = [
    {
      id: 1,
      name: 'Oil Change',
      description: 'Complete oil change with premium synthetic oil and filter replacement',
      duration: '30 mins',
      price: '$49.99',
      icon: '🛢️'
    },
    {
      id: 2,
      name: 'Brake Service',
      description: 'Comprehensive brake inspection, pad replacement, and rotor resurfacing',
      duration: '1 hour',
      price: '$149.99',
      icon: '🛑'
    },
    {
      id: 3,
      name: 'Tire Service',
      description: 'Tire rotation, balancing, alignment, and seasonal tire changes',
      duration: '45 mins',
      price: '$89.99',
      icon: '🛞'
    },
    {
      id: 4,
      name: 'Engine Tune-Up',
      description: 'Complete engine diagnostic, spark plugs, air filter, and performance check',
      duration: '2 hours',
      price: '$199.99',
      icon: '⚙️'
    },
    {
      id: 5,
      name: 'Battery Service',
      description: 'Battery testing, replacement, and charging system diagnosis',
      duration: '30 mins',
      price: '$79.99',
      icon: '🔋'
    },
    {
      id: 6,
      name: 'Air Filter Replacement',
      description: 'Cabin and engine air filter replacement for better air quality and performance',
      duration: '20 mins',
      price: '$39.99',
      icon: '💨'
    },
    {
      id: 7,
      name: 'Cooling System Service',
      description: 'Radiator flush, coolant replacement, and system pressure test',
      duration: '1.5 hours',
      price: '$119.99',
      icon: '❄️'
    },
    {
      id: 8,
      name: 'Transmission Service',
      description: 'Transmission fluid change, filter replacement, and system inspection',
      duration: '1.5 hours',
      price: '$169.99',
      icon: '🔧'
    }
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedService) {
      alert('Please select a service');
      return;
    }

    // Here you would typically send the booking data to your backend
    const bookingData = {
      service: selectedService,
      vehicle: {
        make: formData.vehicleMake,
        model: formData.vehicleModel,
        year: formData.vehicleYear
      },
      appointment: {
        date: formData.preferredDate,
        time: formData.preferredTime
      },
      notes: formData.additionalNotes
    };

    console.log('Booking submitted:', bookingData);

    // Show success message and redirect
    alert('Appointment booked successfully!');
    navigate('/customer/my-bookings');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Schedule your vehicle service with our expert technicians</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Service</h2>

            {selectedService ? (
              <div className="border border-primary rounded-lg p-4 bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{selectedService.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedService.name}</h3>
                      <p className="text-sm text-gray-600">{selectedService.duration}</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">{selectedService.price}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{selectedService.description}</p>
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
                        <span className="text-xl mr-3">{service.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.duration}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">{service.price}</span>
                    </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                    <input
                      type="text"
                      name="vehicleMake"
                      value={formData.vehicleMake}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Toyota"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Camry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      name="vehicleYear"
                      value={formData.vehicleYear}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="2020"
                    />
                  </div>
                </div>
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
                disabled={!selectedService}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {selectedService ? 'Book Appointment' : 'Please Select a Service'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
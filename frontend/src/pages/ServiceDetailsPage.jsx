import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';

const ServiceDetailsPage = ({ hideHeader = false, isAuthenticatedProp }) => {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated: authContextValue } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use passed prop if available, otherwise use context value
  const isAuthenticated = isAuthenticatedProp !== undefined ? isAuthenticatedProp : authContextValue;

  // Fetch service details from backend
  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch(`http://localhost:8080/api/customer/services/${serviceId}`, {
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch service details');
      }
      
      const data = await response.json();
      console.log('Fetched service details:', data);
      setService(data);
    } catch (err) {
      console.error('Error fetching service details:', err);
      setError('Failed to load service details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {!hideHeader && <Header />}
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className="min-h-screenbg-gray-100">
        {!hideHeader && <Header />}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-4xl mb-2">⚠️</div>
            <h1 className="text-2xl font-bold text-red-800 mb-4">
              {error || 'Service Not Found'}
            </h1>
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-colors"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideHeader && <Header />}

      {/* Service Details Section */}
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/services')}
          className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors mb-8"
        >
          ← Back to Services
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 py-12 px-6 text-white">
            <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-primary/20">Professional Service Excellence</p>
          </div>

          {/* Service Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {service.shortDescription || "Professional service for your vehicle."}
                </p>

                {service.includedSubservices && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                    <div className="mb-8">
                      {service.includedSubservices.split(',').map((item, index) => (
                        <div key={index} className="flex items-start mb-3">
                          <span className="flex-shrink-0 h-6 w-6 text-primary mr-3 mt-0.5">✓</span>
                          <span className="text-gray-600">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 sticky top-24 border-2 border-primary/20">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>

                  <div className="mb-6 pb-6 border-b border-primary/20">
                    <p className="text-gray-600 text-sm mb-2">Estimated Duration</p>
                    <p className="text-xl font-semibold text-gray-900">{service.estimatedDuration || 'Contact for details'}</p>
                  </div>

                  <div className="mb-6 pb-6 border-b border-primary/20">
                    <p className="text-gray-600 text-sm mb-2">Service Price</p>
                    <p className="text-3xl font-bold text-primary">${service.estimatedPrice?.toFixed(2) || '0.00'}</p>
                    <p className="text-xs text-gray-600 mt-1">*Price may vary based on vehicle</p>
                  </div>

                  <div className="mb-6 pb-6 border-b border-primary/20">
                    <p className="text-gray-600 text-sm mb-2">Daily Availability</p>
                    <p className="text-xl font-semibold text-gray-900">{service.maxPerDay || 0} slots per day</p>
                  </div>

                  <button
                    onClick={() => navigate('/customer/book-appointment', { 
                      state: { 
                        selectedService: service 
                      } 
                    })}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;

import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import BookingForm from '../components/appointment/BookingForm';

const ServiceDetailsPage = ({ hideHeader = false, isAuthenticatedProp }) => {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated: authContextValue } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Use passed prop if available, otherwise use context value
  const isAuthenticated = isAuthenticatedProp !== undefined ? isAuthenticatedProp : authContextValue;

  // Get service from location state
  const service = location.state?.service || null;

  // Default service info if not passed through navigation
  const serviceInfo = service || {
    id: serviceId,
    title: "Service",
    description: "Service Details",
    detailedDescription: "Get detailed information about our services."
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-100">
        {!hideHeader && <Header />}
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </button>
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
          onClick={() => navigate('/customer/services')}
          className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors mb-8"
        >
          ← Back to Services
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 py-12 px-6 text-white">
            <h1 className="text-4xl font-bold mb-4">{serviceInfo.title}</h1>
            <p className="text-xl text-primary/20">Professional Service Excellence</p>
          </div>

          {/* Service Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {serviceInfo.detailedDescription || serviceInfo.description || "Get detailed information about our services."}
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-primary mr-3 mt-0.5">✓</span>
                    <span className="text-gray-600">Professional and experienced technicians</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-primary mr-3 mt-0.5">✓</span>
                    <span className="text-gray-600">High-quality parts and materials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-primary mr-3 mt-0.5">✓</span>
                    <span className="text-gray-600">Warranty on all services performed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-primary mr-3 mt-0.5">✓</span>
                    <span className="text-gray-600">Transparent pricing with no hidden charges</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-primary mr-3 mt-0.5">✓</span>
                    <span className="text-gray-600">Quick turnaround time</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Us</h3>
                <p className="text-gray-600 leading-relaxed">
                  We pride ourselves on delivering exceptional service with attention to detail. Our team of certified technicians uses the latest equipment and techniques to ensure your vehicle receives the best care possible. We're committed to customer satisfaction and transparent communication throughout the service process.
                </p>
              </div>

              {/* Booking Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 sticky top-24 border-2 border-primary/20">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{serviceInfo.title}</h3>

                  <div className="mb-6 pb-6 border-b border-primary/20">
                    <p className="text-gray-600 text-sm mb-2">Estimated Duration</p>
                    <p className="text-xl font-semibold text-gray-900">{serviceInfo.duration || '2-4 Hours'}</p>
                  </div>

                  <div className="mb-6 pb-6 border-b border-primary/20">
                    <p className="text-gray-600 text-sm mb-2">Service Price</p>
                    <p className="text-3xl font-bold text-primary">{serviceInfo.price || '$150 - $500'}</p>
                    <p className="text-xs text-gray-600 mt-1">*Price includes parts and labor</p>
                  </div>

                  {/* Authentication Check - Temporarily disabled for testing */}
                  {/* {!isAuthenticated ? (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 mb-3">
                        You need to log in to book this service.
                      </p>
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors mb-2"
                      >
                        Log In
                      </button>
                      <p className="text-xs text-gray-600 text-center">
                        Don't have an account?{' '}
                        <button
                          onClick={() => navigate('/signup')}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  ) : ( */}
                    <button
                      onClick={() => setShowBookingForm(!showBookingForm)}
                      className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-colors"
                    >
                      {showBookingForm ? 'Hide Booking Form' : 'Book Now'}
                    </button>
                  {/* )} */}
                </div>
              </div>
            </div>

            {/* Booking Form Section - Always show for testing */}
            {showBookingForm && (
              <div className="mt-12 p-8 bg-gray-50 rounded-lg border-2 border-primary/20">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Service</h3>
                <BookingForm
                  serviceId={serviceInfo.id}
                  serviceName={serviceInfo.title}
                  onSubmitSuccess={() => {
                    setShowBookingForm(false);
                    alert('Booking submitted successfully! We will contact you soon.');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;

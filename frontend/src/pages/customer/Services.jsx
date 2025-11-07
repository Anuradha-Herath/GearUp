import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Services = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from backend
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch('http://localhost:8080/api/customer/services', {
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      console.log('Fetched services:', data);
      
      // Map backend data to frontend format with conditional image handling
      const mappedServices = data.map((service) => ({
        id: service.id,
        title: service.title,
        description: service.shortDescription,
        detailedDescription: service.includedSubservices || service.shortDescription,
        duration: service.estimatedDuration || 'Contact us',
        price: `$${service.estimatedPrice.toFixed(2)}`,
        imageUrl: service.image || null // Use the image field from backend (UploadThing URL)
      }));
      
      setServices(mappedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ServiceCard = ({ service, onClick }) => (
    <div 
      onClick={onClick}
      className="flex flex-col overflow-hidden rounded-lg bg-primary/10 dark:bg-primary/20 shadow-md transition-all hover:shadow-2xl hover:scale-105 border border-primary/20 cursor-pointer"
    >
      {/* Conditional image rendering */}
      {service.imageUrl ? (
        <div 
          className="aspect-video w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${service.imageUrl}")` }}
        ></div>
      ) : (
        <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No Image Available</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-grey-900">{service.title}</h3>
          <span className="text-lg font-bold text-primary">{service.price}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">⏱️ {service.duration}</span>
          <button className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors text-sm">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );

  const handleServiceClick = (service) => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { 
        state: { 
          returnUrl: `/services`,
          message: 'Please login to book services' 
        } 
      });
    } else {
      // If authenticated, navigate to service details
      navigate(`/service/${service.id}`, { state: { service } });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Services</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Login Banner for non-authenticated users */}
      {!user && (
        <div className="bg-blue-500 text-white py-3 px-4 text-center">
          <p className="text-sm md:text-base">
            💡 <strong>Please login to book services</strong> - Click any service to sign in
          </p>
        </div>
      )}
      
      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Services</h1>
            <p className="mt-4 text-lg text-gray-600">We offer a wide range of services to keep your vehicle running smoothly and safely.</p>
          </div>

          {/* Services Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose GearUp?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <div className="bg-blue-200 rounded-lg p-6 shadow-sm">
                    <div className="text-3xl font-bold text-blue-700 mb-2">🔧</div>
                    <div className="text-gray-600 font-medium">Certified Technicians</div>
                  </div>
                  <p className="text-gray-600 mt-2">ASE certified professionals with years of experience</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-200 rounded-lg p-6 shadow-sm">
                    <div className="text-3xl font-bold text-green-700 mb-2">⚡</div>
                    <div className="text-gray-600 font-medium">Quick Service</div>
                  </div>
                  <p className="text-gray-600 mt-2">Most services completed same day with appointment</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-200 rounded-lg p-6 shadow-sm">
                    <div className="text-3xl font-bold text-yellow-700 mb-2">🛡️</div>
                    <div className="text-gray-600 font-medium">Quality Guarantee</div>
                  </div>
                  <p className="text-gray-600 mt-2">12-month warranty on all parts and labor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
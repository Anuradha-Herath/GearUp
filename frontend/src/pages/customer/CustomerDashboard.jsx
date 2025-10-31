import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import Testimonials from '../../components/landing/Testimonials';
import LandingFooter from '../../components/landing/LandingFooter';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <Hero isCustomer={true} />

      {/* Quick Actions Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Quick Actions</h2>
            <p className="mt-2 text-lg text-gray-600">Manage your vehicles and appointments</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/customer/book-appointment')}
              className="bg-primary hover:bg-primary/90 text-white p-6 rounded-lg shadow-md transition-colors text-center"
            >
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
              <p className="text-sm opacity-90">Schedule a new service</p>
            </button>
            
            <button
              onClick={() => navigate('/customer/my-vehicles')}
              className="bg-primary hover:bg-primary/90 text-white p-6 rounded-lg shadow-md transition-colors text-center"
            >
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">My Vehicles</h3>
              <p className="text-sm opacity-90">Manage your vehicles</p>
            </button>
            
            <button
              onClick={() => navigate('/customer/my-bookings')}
              className="bg-primary hover:bg-primary/90 text-white p-6 rounded-lg shadow-md transition-colors text-center"
            >
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">View My Bookings</h3>
              <p className="text-sm opacity-90">Check appointment history</p>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Your Service Summary</h2>
            <p className="mt-4 text-lg text-gray-600">Track your automotive service history</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/20 rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-gray-600">Total Bookings</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-200 rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-green-700 mb-2">4</div>
                <div className="text-gray-600">Completed Services</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-200 rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-700 mb-2">1</div>
                <div className="text-gray-600">Upcoming Appointments</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-200 rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-yellow-700 mb-2">$450</div>
                <div className="text-gray-600">Total Spent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default CustomerDashboard;
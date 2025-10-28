import React from 'react';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import Testimonials from '../../components/landing/Testimonials';
import LandingFooter from '../../components/landing/LandingFooter';

const CustomerDashboard = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <Hero isCustomer={true} />

      {/* Quick Stats Section */}
      <div className="py-16 bg-white">
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
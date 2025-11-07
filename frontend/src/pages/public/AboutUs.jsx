import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About GearUp</h1>
            <p className="text-xl text-gray-100">
              Your trusted partner in automobile service management, delivering excellence since day one.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  At GearUp, we're committed to revolutionizing the automobile service industry by providing 
                  a seamless, efficient, and transparent service management platform.
                </p>
                <p className="text-gray-600 mb-4">
                  We believe that vehicle maintenance should be hassle-free, transparent, and convenient. 
                  That's why we've built a comprehensive platform that connects vehicle owners with 
                  professional service providers.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🎯</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Quality Service</h3>
                      <p className="text-gray-600 text-sm">
                        We ensure every service meets the highest standards of quality and professionalism.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">⚡</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Fast & Efficient</h3>
                      <p className="text-gray-600 text-sm">
                        Quick turnaround times without compromising on quality or attention to detail.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🤝</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Customer First</h3>
                      <p className="text-gray-600 text-sm">
                        Your satisfaction is our priority. We're here to serve you better every day.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold mb-3">Expertise</h3>
                <p className="text-gray-600">
                  Our team of certified professionals brings years of experience and technical knowledge.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💎</div>
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-gray-600">
                  Clear pricing, honest assessments, and open communication throughout your service journey.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-gray-600">
                  Leveraging cutting-edge technology to provide the best service management experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600">Service Types</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-100 mb-8">
              Join thousands of satisfied customers who trust GearUp for their vehicle maintenance needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-sm font-medium text-primary transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                Get Started
              </Link>
              <Link
                to="/services"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-white px-8 text-sm font-medium text-white transition-colors hover:bg-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About GearUp</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Your trusted partner for quality vehicle maintenance and repair services
          </p>
        </div>
      </div>

      {/* Company Story Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Founded in 2020, GearUp has been committed to providing exceptional automotive services to our community. 
              What started as a small family-owned garage has grown into a comprehensive auto service center, 
              serving thousands of satisfied customers.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Our mission is simple: to deliver honest, reliable, and professional automotive services at competitive prices. 
              We believe in transparency, quality workmanship, and building long-lasting relationships with our customers.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With state-of-the-art equipment and ASE-certified technicians, we're equipped to handle all your vehicle's needs, 
              from routine maintenance to complex repairs.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every service is performed to the highest standards using premium parts and materials.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Trust</h3>
              <p className="text-gray-600">
                Honesty and transparency guide everything we do. We provide detailed explanations and fair pricing every time.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Service</h3>
              <p className="text-gray-600">
                Our certified technicians bring years of experience and continuous training to ensure the best care for your vehicle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3 mr-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ASE Certified Technicians</h3>
                <p className="text-gray-600">All our mechanics are certified and regularly trained on the latest automotive technology.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3 mr-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">12-Month Warranty</h3>
                <p className="text-gray-600">We stand behind our work with a comprehensive warranty on all parts and labor.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3 mr-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Convenient Online Booking</h3>
                <p className="text-gray-600">Schedule your service appointment online 24/7 at your convenience.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3 mr-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitive Pricing</h3>
                <p className="text-gray-600">Get quality service at fair prices with no hidden fees or surprise charges.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience the GearUp Difference?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their vehicles.
          </p>
          <a
            href="/services"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-primary shadow-lg hover:bg-gray-100 transition-colors"
          >
            Book Your Service Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

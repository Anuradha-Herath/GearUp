import React from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const serviceImageStyles = [
    { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEdAZPDIiLuWjplYv5ckzTsldXMTR7mlIc2NjC9MTNlSjoTYGBogXhbEB5yaT-fWd5jE7mMBfjXbpQuAKie2xRHAlfNHZvHzgPiYJZDCsck4zR3TpN8sk4DTOBd_UPkXGb4PKS8hNmgnpQZLCfHFjwQaqR42BZ_K7Xd2oXHYBO9sZ__tfEXZai05zNKaA8Ew9L_jxxGNyBpiG0z9K5R1ZEcG6BPPAz8r712hKOnEOuTH_VSozD7QOcBt3DO-jfm-wRm0nTBC35ntE")' },
    { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWJupyNT-yhmebTACULVgBWMDvOIbUguhxDx-g3zEvBhGMYcHVKqfapCQ9nlrIbRhia_K95an9QJI2e4AW2MtkOmHxm8ETi4gfrMXC-w3md-tGyRhGHyYiTFU6AkoNuBv-7WxKu4IdoXUAk5g5W-D8lHgy8Bl9SBnrmA0CIA2VGM3Jv-wzFfzEi7BWDH4xnnKrytz0a_keNS6b0-NHbUGzU2479FSbW4c38oWrkfmbbDk7xe_yUMSVasQs_gsbvah6A0T5XzOitF8")' },
    { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpPGTo_qRDnKwucud-XKBEQLdI4EiXYF15RrWkabBqh0jderUfvhCzDjyrBRxAZFIPpzZDeyhDF9fF8L1FoBYl2MPUoifTjIVv_i37K5g1mAc5NHgQZC7iAFK6vA0bOYrJVeJ_i3Y0qexzrpbLxsYuXIItEyCAmhEPnmJjMX2kzDd56uGm1ETxNKTIpcEt34vOjYbx2gkj_hNazi6ehR-yxwN7evLQbD1tiotjEHO44QHH4cXCx976NpZK-xWhXFQDoYXcStz-R3Q")' },
    { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDayaQ5foAaPi9rfIzk06AVjzya29YzR58bT-FCoFO0UdkUoNxrsAwZ9JYpjCZxGsEP8xHBP6td_gJZlBgxbT8ePSsOHMRDCHgxDXgo4jmiQYYhEqDz2tFhrsu80pu40trYFUL8fH5asbLsY_5-3q3ww_rAabHHagVwcQRhVpxxdLT96h5eEzL2WPkSxFN2lvfpY1CGUmln6hQJ9-1EFIuNY2MfVvJhJI4Sj5gpA_vWcGiSE4bHedmjMqRtC22tQCIALyMxTbW8fnE")' },
    { backgroundImage: 'url("https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' },
    { backgroundImage: 'url("https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' },
    { backgroundImage: 'url("https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' },
    { backgroundImage: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' },
  ];

  const services = [
    {
      id: 1,
      title: 'Oil Change',
      description: 'Complete oil change with premium synthetic oil and filter replacement',
      detailedDescription: 'Our comprehensive oil change service includes premium synthetic oil, high-quality filter replacement, and complete fluid level inspection. We use only the finest oils and filters to ensure optimal engine performance and longevity. Our certified technicians perform thorough inspections to identify potential issues before they become costly problems.',
      duration: '30 mins',
      price: '$49.99',
      style: serviceImageStyles[0]
    },
    {
      id: 2,
      title: 'Brake Service',
      description: 'Comprehensive brake inspection, pad replacement, and rotor resurfacing',
      detailedDescription: 'Safety is our top priority. Our brake service includes comprehensive inspection of brake pads, rotors, calipers, and brake fluid. We provide professional brake pad replacement, rotor resurfacing or replacement when needed, and complete system testing to ensure your safety on the road.',
      duration: '1 hour',
      price: '$149.99',
      style: serviceImageStyles[1]
    },
    {
      id: 3,
      title: 'Tire Service',
      description: 'Tire rotation, balancing, alignment, and seasonal tire changes',
      detailedDescription: 'Complete tire care including rotation, balancing, and wheel alignment services. We also provide seasonal tire changes, tire pressure monitoring, and tire replacement with premium brands. Our advanced alignment equipment ensures optimal handling and tire longevity.',
      duration: '45 mins',
      price: '$89.99',
      style: serviceImageStyles[2]
    },
    {
      id: 4,
      title: 'Engine Diagnostics',
      description: 'Advanced diagnostic tools to identify and resolve engine issues quickly',
      detailedDescription: 'State-of-the-art diagnostic equipment to quickly identify engine issues and provide accurate solutions. Our comprehensive engine diagnostic service includes computer scanning, performance testing, and detailed analysis of engine components to ensure optimal performance.',
      duration: '1 hour',
      price: '$99.99',
      style: serviceImageStyles[3]
    },
    {
      id: 5,
      title: 'Battery Service',
      description: 'Battery testing, replacement, and charging system diagnosis',
      detailedDescription: 'Complete battery and charging system service including battery testing, replacement with premium batteries, alternator inspection, and charging system diagnosis. We ensure your vehicle starts reliably in all weather conditions.',
      duration: '30 mins',
      price: '$79.99',
      style: serviceImageStyles[4]
    },
    {
      id: 6,
      title: 'Air Filter Replacement',
      description: 'Cabin and engine air filter replacement for better air quality',
      detailedDescription: 'Professional air filter replacement service for both cabin and engine air filters. Clean air filters improve engine performance, fuel efficiency, and interior air quality. We use high-quality filters designed for your specific vehicle.',
      duration: '20 mins',
      price: '$39.99',
      style: serviceImageStyles[5]
    },
    {
      id: 7,
      title: 'Cooling System Service',
      description: 'Radiator flush, coolant replacement, and system pressure test',
      detailedDescription: 'Comprehensive cooling system maintenance including radiator flush, coolant replacement, thermostat inspection, and pressure testing. We prevent overheating issues and ensure optimal engine temperature regulation.',
      duration: '1.5 hours',
      price: '$119.99',
      style: serviceImageStyles[6]
    },
    {
      id: 8,
      title: 'Transmission Service',
      description: 'Transmission fluid change, filter replacement, and system inspection',
      detailedDescription: 'Complete transmission service including fluid change with premium transmission fluid, filter replacement, and comprehensive system inspection. We ensure smooth shifting and extend transmission life.',
      duration: '1.5 hours',
      price: '$169.99',
      style: serviceImageStyles[7]
    }
  ];

  const ServiceCard = ({ service, onClick }) => (
    <div 
      onClick={onClick}
      className="flex flex-col overflow-hidden rounded-lg bg-primary/10 dark:bg-primary/20 shadow-md transition-all hover:shadow-2xl hover:scale-105 border border-primary/20 cursor-pointer"
    >
      <div className="aspect-video w-full bg-cover bg-center" style={service.style}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.title}</h3>
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
    navigate(`/service/${service.id}`, { state: { service } });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Services</h1>
            <p className="mt-4 text-lg text-gray-600">We offer a wide range of services to keep your vehicle running smoothly and safely.</p>
          </div>

          {/* Services Grid - Using same style as Features.jsx */}
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
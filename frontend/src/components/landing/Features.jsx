import React from 'react';
import { useNavigate } from 'react-router-dom';

const serviceImageStyles = [
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEdAZPDIiLuWjplYv5ckzTsldXMTR7mlIc2NjC9MTNlSjoTYGBogXhbEB5yaT-fWd5jE7mMBfjXbpQuAKie2xRHAlfNHZvHzgPiYJZDCsck4zR3TpN8sk4DTOBd_UPkXGb4PKS8hNmgnpQZLCfHFjwQaqR42BZ_K7Xd2oXHYBO9sZ__tfEXZai05zNKaA8Ew9L_jxxGNyBpiG0z9K5R1ZEcG6BPPAz8r712hKOnEOuTH_VSozD7QOcBt3DO-jfm-wRm0nTBC35ntE")' }, // Engine Repair
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWJupyNT-yhmebTACULVgBWMDvOIbUguhxDx-g3zEvBhGMYcHVKqfapCQ9nlrIbRhia_K95an9QJI2e4AW2MtkOmHxm8ETi4gfrMXC-w3md-tGyRhGHyYiTFU6AkoNuBv-7WxKu4IdoXUAk5g5W-D8lHgy8Bl9SBnrmA0CIA2VGM3Jv-wzFfzEi7BWDH4xnnKrytz0a_keNS6b0-NHbUGzU2479FSbW4c38oWrkfmbbDk7xe_yUMSVasQs_gsbvah6A0T5XzOitF8")' }, // Tire Services
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpPGTo_qRDnKwucud-XKBEQLdI4EiXYF15RrWkabBqh0jderUfvhCzDjyrBRxAZFIPpzZDeyhDF9fF8L1FoBYl2MPUoifTjIVv_i37K5g1mAc5NHgQZC7iAFK6vA0bOYrJVeJ_i3Y0qexzrpbLxsYuXIItEyCAmhEPnmJjMX2kzDd56uGm1ETxNKTIpcEt34vOjYbx2gkj_hNazi6ehR-yxwN7evLQbD1tiotjEHO44QHH4cXCx976NpZK-xWhXFQDoYXcStz-R3Q")' }, // Detailing
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDayaQ5foAaPi9rfIzk06AVjzya29YzR58bT-FCoFO0UdkUoNxrsAwZ9JYpjCZxGsEP8xHBP6td_gJZlBgxbT8ePSsOHMRDCHgxDXgo4jmiQYYhEqDz2tFhrsu80pu40trYFUL8fH5asbLsY_5-3q3ww_rAabHHagVwcQRhVpxxdLT96h5eEzL2WPkSxFN2lvfpY1CGUmln6hQJ9-1EFIuNY2MfVvJhJI4Sj5gpA_vWcGiSE4bHedmjMqRtC22tQCIALyMxTbW8fnE")' }, // Diagnostics
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCw8-7X5QZ-7xQ2P_xQ2P_xQ2P_xQ2P_xQ2P_xQ2P_xQ2P_xQ2P_xQ2P_xQ2P_xQ2P_xQ2P")' }, // Maintenance (placeholder)
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDayaQ5foAaPi9rfIzk06AVjzya29YzR58bT-FCoFO0UdkUoNxrsAwZ9JYpjCZxGsEP")' }, // AC Service (placeholder)
];

const ServiceCard = ({ id, title, description, style, onClick }) => (
  <div 
    onClick={onClick}
    className="flex flex-col overflow-hidden rounded-lg bg-primary/10 dark:bg-primary/20 shadow-md transition-all hover:shadow-2xl hover:scale-105 border border-primary/20 cursor-pointer"
  >
    <div className="aspect-video w-full bg-cover bg-center" style={style}></div>
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <button className="mt-4 inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors">
        Learn More →
      </button>
    </div>
  </div>
);

const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    { 
      id: 1,
      title: "Engine Repair", 
      description: "Expert engine repair and maintenance to ensure peak performance.",
      detailedDescription: "Our certified technicians provide comprehensive engine repair services including diagnostics, repairs, and replacements for all vehicle types.",
      style: serviceImageStyles[0] 
    },
    { 
      id: 2,
      title: "Tire Services", 
      description: "Comprehensive tire services, including replacement, balancing, and alignment.",
      detailedDescription: "We offer a complete range of tire services including replacement, balancing, rotation, and wheel alignment to ensure safety and performance.",
      style: serviceImageStyles[1] 
    },
    { 
      id: 3,
      title: "Detailing", 
      description: "Professional detailing services to keep your car looking its best.",
      detailedDescription: "Premium interior and exterior detailing services to restore your vehicle's shine and protect its finish.",
      style: serviceImageStyles[2] 
    },
    { 
      id: 4,
      title: "Diagnostics", 
      description: "Advanced diagnostic tools to identify and resolve any issues quickly.",
      detailedDescription: "State-of-the-art diagnostic equipment to quickly identify issues and provide accurate solutions for your vehicle.",
      style: serviceImageStyles[3] 
    },
    { 
      id: 5,
      title: "Maintenance", 
      description: "Regular maintenance to keep your vehicle running smoothly and prevent issues.",
      detailedDescription: "Scheduled maintenance packages including oil changes, filter replacements, and fluid checks to keep your vehicle in top condition.",
      style: serviceImageStyles[4] 
    },
    { 
      id: 6,
      title: "AC Service", 
      description: "Professional air conditioning repair and maintenance services.",
      detailedDescription: "Complete AC system servicing including refrigerant recharge, component repair, and system optimization for comfort.",
      style: serviceImageStyles[5] 
    },
  ];

  const handleServiceClick = (service) => {
    navigate(`/service/${service.id}`, { state: { service } });
  };

  return (
    <section className="bg-background-light dark:bg-background-dark py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Comprehensive Services</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">We offer a wide range of services to keep your vehicle running smoothly and safely.</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard 
              key={service.id} 
              {...service} 
              onClick={() => handleServiceClick(service)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
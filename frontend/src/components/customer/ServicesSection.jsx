import React from 'react';

const serviceImageStyles = [
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEdAZPDIiLuWjplYv5ckzTsldXMTR7mlIc2NjC9MTNlSjoTYGBogXhbEB5yaT-fWd5jE7mMBfjXbpQuAKie2xRHAlfNHZvHzgPiYJZDCsck4zR3TpN8sk4DTOBd_UPkXGb4PKS8hNmgnpQZLCfHFjwQaqR42BZ_K7Xd2oXHYBO9sZ__tfEXZai05zNKaA8Ew9L_jxxGNyBpiG0z9K5R1ZEcG6BPPAz8r712hKOnEOuTH_VSozD7QOcBt3DO-jfm-wRm0nTBC35ntE")' }, // Engine Repair
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWJupyNT-yhmebTACULVgBWMDvOIbUguhxDx-g3zEvBhGMYcHVKqfapCQ9nlrIbRhia_K95an9QJI2e4AW2MtkOmHxm8ETi4gfrMXC-w3md-tGyRhGHyYiTFU6AkoNuBv-7WxKu4IdoXUAk5g5W-D8lHgy8Bl9SBnrmA0CIA2VGM3Jv-wzFfzEi7BWDH4xnnKrytz0a_keNS6b0-NHbUGzU2479FSbW4c38oWrkfmbbDk7xe_yUMSVasQs_gsbvah6A0T5XzOitF8")' }, // Tire Services
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpPGTo_qRDnKwucud-XKBEQLdI4EiXYF15RrWkabBqh0jderUfvhCzDjyrBRxAZFIPpzZDeyhDF9fF8L1FoBYl2MPUoifTjIVv_i37K5g1mAc5NHgQZC7iAFK6vA0bOYrJVeJ_i3Y0qexzrpbLxsYuXIItEyCAmhEPnmJjMX2kzDd56uGm1ETxNKTIpcEt34vOjYbx2gkj_hNazi6ehR-yxwN7evLQbD1tiotjEHO44QHH4cXCx976NpZK-xWhXFQDoYXcStz-R3Q")' }, // Detailing
  { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDayaQ5foAaPi9rfIzk06AVjzya29YzR58bT-FCoFO0UdkUoNxrsAwZ9JYpjCZxGsEP8xHBP6td_gJZlBgxbT8ePSsOHMRDCHgxDXgo4jmiQYYhEqDz2tFhrsu80pu40trYFUL8fH5asbLsY_5-3q3ww_rAabHHagVwcQRhVpxxdLT96h5eEzL2WPkSxFN2lvfpY1CGUmln6hQJ9-1EFIuNY2MfVvJhJI4Sj5gpA_vWcGiSE4bHedmjMqRtC22tQCIALyMxTbW8fnE")' }, // Diagnostics
];

const ServiceCard = ({ title, description, imageUrl, style }) => (
  <div className="flex flex-col overflow-hidden rounded-lg bg-primary/10 dark:bg-primary/20 shadow-md transition-shadow hover:shadow-xl border border-primary/20">
    <div className="aspect-video w-full bg-cover bg-center" style={style}></div>
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const ServicesSection = () => {
  const services = [
    { title: "Engine Repair", description: "Expert engine repair and maintenance to ensure peak performance.", style: serviceImageStyles[0] },
    { title: "Tire Services", description: "Comprehensive tire services, including replacement, balancing, and alignment.", style: serviceImageStyles[1] },
    { title: "Detailing", description: "Professional detailing services to keep your car looking its best.", style: serviceImageStyles[2] },
    { title: "Diagnostics", description: "Advanced diagnostic tools to identify and resolve any issues quickly.", style: serviceImageStyles[3] },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Comprehensive Services</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">We offer a wide range of services to keep your vehicle running smoothly and safely.</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
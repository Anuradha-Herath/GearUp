import React from 'react';

const CallToActionSection = () => (
  <section className="bg-background-light dark:bg-background-dark py-16 sm:py-24">
    <div className="container mx-auto max-w-4xl px-4 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Schedule Your Service Today</h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Get your vehicle the care it deserves. Book an appointment online or call us now.</p>
      <div className="mt-8">
        <a className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105" href="#"> Book an Appointment </a>
      </div>
    </div>
  </section>
);

export default CallToActionSection;
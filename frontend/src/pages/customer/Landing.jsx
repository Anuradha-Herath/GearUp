import React from 'react';
import Navbar from '../../components/customer/Navbar';
import HeroSection from '../../components/customer/HeroSection';
import ServicesSection from '../../components/customer/ServicesSection';
import CallToActionSection from '../../components/customer/CallToActionSection';
import Footer from '../../components/customer/Footer';

// Custom Tailwind theme colors/config for internal reference/styling logic
// In a real project, this is typically handled by a tailwind.config.js file.
// We are including a subset here to understand the component's styling intent.
const tailwindConfig = {
  colors: {
    primary: "#1173d4",
    'background-light': "#f6f7f8",
    'background-dark': "#101922",
  },
  // ... other extensions (fontFamily, borderRadius)
};

const AutoCareLandingPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ServicesSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
};

export default AutoCareLandingPage;
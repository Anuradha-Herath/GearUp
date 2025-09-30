import React, { useState, useEffect } from 'react';
import image1 from '../../assets/images/image 1.jpg';
import image2 from '../../assets/images/image 2.jpg';
import image3 from '../../assets/images/image 3.jpg';
import image4 from '../../assets/images/image 4.jpg';
import image5 from '../../assets/images/image 5.jpg';

const images = [
  `url(${image1})`,
  `url(${image2})`,
  `url(${image3})`,
  `url(${image4})`,
  `url(${image5})`
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setNextIndex((currentIndex + 1) % images.length);
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setIsTransitioning(false);
      }, 500); // Transition duration 0.5s
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, nextIndex]);

  return (
    <section className="relative flex h-[60vh] min-h-[480px] items-center justify-center bg-hero-pattern bg-cover bg-center bg-no-repeat overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: images[currentIndex], opacity: isTransitioning ? 0 : 1 }}></div>
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: images[nextIndex], opacity: isTransitioning ? 1 : 0 }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">Your Trusted Auto Care Partner</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">Providing top-quality service and maintenance for all your vehicle needs.</p>
        <div className="mt-8">
          <a className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105" href="#"> Explore Services </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
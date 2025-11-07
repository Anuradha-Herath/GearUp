import React from 'react';
import { useAuth } from '../context/AuthContext';
import CustomerLayout from '../layouts/CustomerLayout';
import PublicLayout from '../layouts/PublicLayout';
import Services from './customer/Services';

const ServicesWrapper = () => {
  const { user } = useAuth();

  // If user is logged in, show CustomerLayout; otherwise show PublicLayout
  if (user) {
    return (
      <CustomerLayout>
        <Services />
      </CustomerLayout>
    );
  }

  return (
    <PublicLayout>
      <Services />
    </PublicLayout>
  );
};

export default ServicesWrapper;

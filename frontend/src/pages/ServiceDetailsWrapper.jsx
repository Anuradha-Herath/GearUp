import React from 'react';
import { useAuth } from '../context/AuthContext';
import ServiceDetailsPage from './ServiceDetailsPage';
import CustomerLayout from '../layouts/CustomerLayout';

const ServiceDetailsWrapper = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <CustomerLayout>
        <ServiceDetailsPage hideHeader={true} isAuthenticatedProp={true} />
      </CustomerLayout>
    );
  }

  return <ServiceDetailsPage hideHeader={false} isAuthenticatedProp={false} />;
};

export default ServiceDetailsWrapper;
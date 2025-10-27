import React from 'react';
import BookingForm from './BookingForm';

const AppointmentForm = ({ serviceId, serviceName, onSubmitSuccess }) => {
  return (
    <div>
      <BookingForm 
        serviceId={serviceId} 
        serviceName={serviceName}
        onSubmitSuccess={onSubmitSuccess}
      />
    </div>
  );
};

export default AppointmentForm;
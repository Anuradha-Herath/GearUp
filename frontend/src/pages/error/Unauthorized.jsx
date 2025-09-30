import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">401</h1>
        <p className="text-xl text-gray-600">Unauthorized</p>
      </div>
    </div>
  );
};

export default Unauthorized;
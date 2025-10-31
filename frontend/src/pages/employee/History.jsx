import React, { useState } from 'react';

const History = () => {
  // Mock data for finished services
  const [finishedServices] = useState([
    {
      id: 1,
      vehicleCompany: 'Toyota',
      model: 'Corolla',
      year: 2018,
      vehicleNumber: 'TOY-1111',
      serviceCategory: 'Full Service',
      date: '2025-10-28',
      time: '10:00 AM',
      estimatedPrice: 150.00,
      actualPrice: 145.00,
      status: 'finished',
      completedDate: '2025-10-28',
      customerName: 'Michael Chen',
      customerPhone: '+1-234-567-8908',
      notes: 'Service completed successfully. All parts replaced as needed.'
    },
    {
      id: 2,
      vehicleCompany: 'Honda',
      model: 'Accord',
      year: 2020,
      vehicleNumber: 'HON-2222',
      serviceCategory: 'Brake Replacement',
      date: '2025-10-27',
      time: '2:00 PM',
      estimatedPrice: 300.00,
      actualPrice: 320.00,
      status: 'finished',
      completedDate: '2025-10-27',
      customerName: 'Jessica Taylor',
      customerPhone: '+1-234-567-8909',
      notes: 'Additional work required on rear brake pads. Customer approved extra cost.'
    },
    {
      id: 3,
      vehicleCompany: 'Nissan',
      model: 'Altima',
      year: 2019,
      vehicleNumber: 'NIS-3333',
      serviceCategory: 'Oil Change',
      date: '2025-10-26',
      time: '9:00 AM',
      estimatedPrice: 70.00,
      actualPrice: 70.00,
      status: 'finished',
      completedDate: '2025-10-26',
      customerName: 'Chris Martinez',
      customerPhone: '+1-234-567-8910',
      notes: 'Routine oil change completed.'
    },
    {
      id: 4,
      vehicleCompany: 'Chevrolet',
      model: 'Malibu',
      year: 2021,
      vehicleNumber: 'CHV-4444',
      serviceCategory: 'Engine Tune-up',
      date: '2025-10-25',
      time: '11:00 AM',
      estimatedPrice: 200.00,
      actualPrice: 195.00,
      status: 'finished',
      completedDate: '2025-10-25',
      customerName: 'Amanda White',
      customerPhone: '+1-234-567-8911',
      notes: 'Engine running smoothly after tune-up.'
    },
    {
      id: 5,
      vehicleCompany: 'Volkswagen',
      model: 'Jetta',
      year: 2020,
      vehicleNumber: 'VW-5555',
      serviceCategory: 'Tire Replacement',
      date: '2025-10-24',
      time: '1:30 PM',
      estimatedPrice: 400.00,
      actualPrice: 400.00,
      status: 'finished',
      completedDate: '2025-10-24',
      customerName: 'Daniel Garcia',
      customerPhone: '+1-234-567-8912',
      notes: 'All four tires replaced with premium brand.'
    },
    {
      id: 6,
      vehicleCompany: 'Hyundai',
      model: 'Elantra',
      year: 2019,
      vehicleNumber: 'HYU-6666',
      serviceCategory: 'AC Service',
      date: '2025-10-23',
      time: '3:00 PM',
      estimatedPrice: 120.00,
      actualPrice: 110.00,
      status: 'finished',
      completedDate: '2025-10-23',
      customerName: 'Sophia Lee',
      customerPhone: '+1-234-567-8913',
      notes: 'AC system cleaned and recharged.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredServices = finishedServices.filter(service => 
    service.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const totalRevenue = finishedServices.reduce((sum, service) => sum + service.actualPrice, 0);
  const avgServicePrice = totalRevenue / finishedServices.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service History</h1>
        <p className="text-gray-600 mt-2">View all completed services and past orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Completed</p>
              <p className="text-2xl font-bold text-gray-900">{finishedServices.length}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Service Price</p>
              <p className="text-2xl font-bold text-gray-900">${avgServicePrice.toFixed(2)}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search by vehicle number, customer name, or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {service.vehicleCompany} {service.model}
                      </p>
                      <p className="text-sm text-gray-500">{service.vehicleNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{service.serviceCategory}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{service.customerName}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{service.completedDate}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-primary">${service.actualPrice.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(service)}
                      className="text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-green-600 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Service Details</h2>
              <p className="text-green-100 text-sm mt-1">Completed on {selectedService.completedDate}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">{selectedService.vehicleCompany}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Model</p>
                    <p className="font-medium text-gray-900">{selectedService.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="font-medium text-gray-900">{selectedService.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vehicle Number</p>
                    <p className="font-medium text-gray-900">{selectedService.vehicleNumber}</p>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Service Category</p>
                    <p className="font-medium text-gray-900">{selectedService.serviceCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Scheduled Date</p>
                    <p className="font-medium text-gray-900">{selectedService.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated Price</p>
                    <p className="font-medium text-gray-900">${selectedService.estimatedPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Actual Price</p>
                    <p className="text-xl font-bold text-green-600">${selectedService.actualPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500 text-sm mb-1">Service Notes</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedService.notes}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedService.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedService.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 rounded-b-lg">
              <button
                onClick={closeModal}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;

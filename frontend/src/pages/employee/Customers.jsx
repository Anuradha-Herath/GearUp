import React, { useState } from 'react';

const Customers = () => {
  // Mock data for confirmed customers
  const [customers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-234-567-8900',
      address: '123 Main St, City, State 12345',
      totalBookings: 5,
      lastService: '2025-10-28',
      vehicleCount: 2
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1-234-567-8901',
      address: '456 Oak Ave, City, State 12346',
      totalBookings: 3,
      lastService: '2025-10-25',
      vehicleCount: 1
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@email.com',
      phone: '+1-234-567-8902',
      address: '789 Pine Rd, City, State 12347',
      totalBookings: 8,
      lastService: '2025-10-30',
      vehicleCount: 3
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+1-234-567-8903',
      address: '321 Elm St, City, State 12348',
      totalBookings: 2,
      lastService: '2025-10-20',
      vehicleCount: 1
    },
    {
      id: 5,
      name: 'Robert Brown',
      email: 'robert.b@email.com',
      phone: '+1-234-567-8904',
      address: '654 Maple Dr, City, State 12349',
      totalBookings: 6,
      lastService: '2025-10-27',
      vehicleCount: 2
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      phone: '+1-234-567-8905',
      address: '987 Cedar Ln, City, State 12350',
      totalBookings: 4,
      lastService: '2025-10-26',
      vehicleCount: 1
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Confirmed Customers</h1>
        <p className="text-gray-600 mt-2">View and manage customer information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.reduce((sum, c) => sum + c.totalBookings, 0)}
              </p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.reduce((sum, c) => sum + c.vehicleCount, 0)}
              </p>
            </div>
            <div className="text-3xl">🚗</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Customers Found</h3>
          <p className="text-gray-600">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              {/* Card Header */}
              <div className="bg-primary/10 p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{customer.email}</p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="text-sm">
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{customer.phone}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium text-gray-900 text-xs">{customer.address}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Bookings</p>
                    <p className="text-lg font-bold text-primary">{customer.totalBookings}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Vehicles</p>
                    <p className="text-lg font-bold text-primary">{customer.vehicleCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Last Visit</p>
                    <p className="text-xs font-medium text-gray-900">{customer.lastService}</p>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50">
                <button
                  onClick={() => handleViewDetails(customer)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {/* Modal Header */}
            <div className="bg-primary text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Customer Details</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900 text-lg">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Service</p>
                  <p className="font-medium text-gray-900">{selectedCustomer.lastService}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{selectedCustomer.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-blue-600">{selectedCustomer.totalBookings}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Registered Vehicles</p>
                  <p className="text-3xl font-bold text-green-600">{selectedCustomer.vehicleCount}</p>
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

export default Customers;

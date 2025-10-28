import React, { useState } from 'react';

const CustomerDetails = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mock customer data
  const customers = [
    {
      id: 'CUST-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      vehicles: ['Toyota Camry - ABC 1234', 'Honda Accord - XYZ 5678'],
      totalOrders: 12,
      lastService: '2025-10-20',
      totalSpent: '$2,450',
      status: 'Active',
      serviceHistory: [
        { date: '2025-10-20', service: 'Oil Change', cost: '$80' },
        { date: '2025-09-15', service: 'Brake Service', cost: '$250' },
        { date: '2025-08-10', service: 'Tire Rotation', cost: '$60' },
      ]
    },
    {
      id: 'CUST-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678',
      vehicles: ['Honda Civic - DEF 9012'],
      totalOrders: 8,
      lastService: '2025-10-22',
      totalSpent: '$1,680',
      status: 'Active',
      serviceHistory: [
        { date: '2025-10-22', service: 'Full Service', cost: '$350' },
        { date: '2025-09-05', service: 'AC Repair', cost: '$180' },
      ]
    },
    {
      id: 'CUST-003',
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '+1 (555) 345-6789',
      vehicles: ['Ford F-150 - GHI 3456', 'Jeep Wrangler - JKL 7890'],
      totalOrders: 15,
      lastService: '2025-10-18',
      totalSpent: '$3,200',
      status: 'VIP',
      serviceHistory: [
        { date: '2025-10-18', service: 'Engine Diagnostic', cost: '$220' },
        { date: '2025-09-20', service: 'Transmission Service', cost: '$450' },
        { date: '2025-08-25', service: 'Battery Replacement', cost: '$180' },
      ]
    },
    {
      id: 'CUST-004',
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      phone: '+1 (555) 456-7890',
      vehicles: ['Tesla Model 3 - TES 1234'],
      totalOrders: 5,
      lastService: '2025-10-25',
      totalSpent: '$890',
      status: 'Active',
      serviceHistory: [
        { date: '2025-10-25', service: 'Battery Check', cost: '$150' },
        { date: '2025-09-10', service: 'Tire Service', cost: '$200' },
      ]
    },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'VIP' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">👤</span>
              Customer Management
            </h2>
            <p className="text-gray-600 mt-1">View and manage customer information</p>
          </div>

          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by name, email, or customer ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Customers</p>
            <p className="text-2xl font-bold text-primary">{customers.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.status === 'Active').length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">VIP Customers</p>
            <p className="text-2xl font-bold text-purple-600">
              {customers.filter(c => c.status === 'VIP').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-yellow-600">$8,220</p>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Customers Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.id}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">📧</span>
                    <span className="text-gray-700">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">📞</span>
                    <span className="text-gray-700">{customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">🚗</span>
                    <div className="flex-1">
                      {customer.vehicles.map((vehicle, idx) => (
                        <p key={idx} className="text-gray-700">{vehicle}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <p className="text-xs text-gray-600">Orders</p>
                    <p className="text-lg font-bold text-primary">{customer.totalOrders}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <p className="text-xs text-gray-600">Spent</p>
                    <p className="text-lg font-bold text-green-600">{customer.totalSpent}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <p className="text-xs text-gray-600">Last Visit</p>
                    <p className="text-xs font-medium text-gray-700">{customer.lastService}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="flex-1 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    📧 Send Update
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Customer Details</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Customer Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{selectedCustomer.name}</h4>
                    <p className="text-gray-500">{selectedCustomer.id}</p>
                  </div>
                  <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusBadge(selectedCustomer.status)}`}>
                    {selectedCustomer.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-800">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="font-medium text-gray-800">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="font-medium text-green-600">{selectedCustomer.totalSpent}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Registered Vehicles</p>
                  {selectedCustomer.vehicles.map((vehicle, idx) => (
                    <p key={idx} className="font-medium text-gray-800 bg-gray-50 p-2 rounded mb-1">
                      🚗 {vehicle}
                    </p>
                  ))}
                </div>
              </div>

              {/* Service History */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Service History</h4>
                <div className="space-y-3">
                  {selectedCustomer.serviceHistory.map((service, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{service.service}</p>
                        <p className="text-sm text-gray-600">{service.date}</p>
                      </div>
                      <p className="font-bold text-primary">{service.cost}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors">
                  Send Service Reminder
                </button>
                <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Request Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;

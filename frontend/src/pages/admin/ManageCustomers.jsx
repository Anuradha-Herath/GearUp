import React, { useState, useEffect } from 'react';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dummy data for customers
  useEffect(() => {
    const dummyCustomers = [
      { id: 1, name: 'John Smith', email: 'john.smith@email.com', phone: '555-0101', totalAppointments: 5, status: 'Active', joinDate: '2024-01-15' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '555-0102', totalAppointments: 3, status: 'Active', joinDate: '2024-02-20' },
      { id: 3, name: 'Mike Davis', email: 'mike.davis@email.com', phone: '555-0103', totalAppointments: 8, status: 'Active', joinDate: '2023-11-10' },
      { id: 4, name: 'Emily Wilson', email: 'emily.w@email.com', phone: '555-0104', totalAppointments: 2, status: 'Inactive', joinDate: '2024-03-05' },
      { id: 5, name: 'David Brown', email: 'david.brown@email.com', phone: '555-0105', totalAppointments: 6, status: 'Active', joinDate: '2023-12-18' },
      { id: 6, name: 'Lisa Garcia', email: 'lisa.garcia@email.com', phone: '555-0106', totalAppointments: 4, status: 'Active', joinDate: '2024-01-08' },
      { id: 7, name: 'Tom Anderson', email: 'tom.anderson@email.com', phone: '555-0107', totalAppointments: 1, status: 'Inactive', joinDate: '2024-04-12' },
      { id: 8, name: 'Jennifer Lee', email: 'jennifer.lee@email.com', phone: '555-0108', totalAppointments: 7, status: 'Active', joinDate: '2023-10-25' },
    ];
    setCustomers(dummyCustomers);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const deleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      alert('Customer deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Manage Customers</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1]"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Customer List ({filteredCustomers.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Appointments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.totalAppointments}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.joinDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => toggleCustomerStatus(customer.id)}
                      className={`px-3 py-1 rounded text-xs ${
                        customer.status === 'Active'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {customer.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="px-3 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                      View Details
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer.id)}
                      className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No customers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCustomers;
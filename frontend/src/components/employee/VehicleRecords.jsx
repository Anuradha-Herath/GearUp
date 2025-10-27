import React, { useState } from 'react';

const VehicleRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Mock vehicle data
  const vehicles = [
    {
      id: 'VEH-001',
      registrationNumber: 'ABC 1234',
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      owner: 'John Doe',
      ownerContact: '+1 (555) 123-4567',
      lastService: '2025-10-20',
      nextService: '2026-01-20',
      mileage: '45,000 km',
      assignedTechnician: 'Tech-A',
      status: 'Good',
      serviceHistory: [
        { date: '2025-10-20', service: 'Oil Change', mileage: '45,000 km', notes: 'All good' },
        { date: '2025-07-15', service: 'Full Service', mileage: '42,000 km', notes: 'Replaced air filter' },
        { date: '2025-04-10', service: 'Brake Service', mileage: '39,000 km', notes: 'Front pads replaced' },
      ]
    },
    {
      id: 'VEH-002',
      registrationNumber: 'XYZ 5678',
      make: 'Honda',
      model: 'Civic',
      year: '2021',
      owner: 'Jane Smith',
      ownerContact: '+1 (555) 234-5678',
      lastService: '2025-10-22',
      nextService: '2026-01-22',
      mileage: '32,000 km',
      assignedTechnician: 'Tech-B',
      status: 'Good',
      serviceHistory: [
        { date: '2025-10-22', service: 'Full Service', mileage: '32,000 km', notes: 'Engine running smooth' },
        { date: '2025-07-18', service: 'Tire Rotation', mileage: '29,000 km', notes: 'All tires good' },
      ]
    },
    {
      id: 'VEH-003',
      registrationNumber: 'DEF 9012',
      make: 'Ford',
      model: 'F-150',
      year: '2019',
      owner: 'Mike Johnson',
      ownerContact: '+1 (555) 345-6789',
      lastService: '2025-10-18',
      nextService: '2025-12-18',
      mileage: '78,000 km',
      assignedTechnician: 'Tech-C',
      status: 'Needs Attention',
      serviceHistory: [
        { date: '2025-10-18', service: 'Engine Diagnostic', mileage: '78,000 km', notes: 'Check engine light - sensor replaced' },
        { date: '2025-08-20', service: 'Transmission Service', mileage: '75,000 km', notes: 'Transmission fluid changed' },
        { date: '2025-06-15', service: 'Battery Replacement', mileage: '72,000 km', notes: 'Old battery 4 years old' },
      ]
    },
    {
      id: 'VEH-004',
      registrationNumber: 'TES 1234',
      make: 'Tesla',
      model: 'Model 3',
      year: '2022',
      owner: 'Sarah Williams',
      ownerContact: '+1 (555) 456-7890',
      lastService: '2025-10-25',
      nextService: '2026-04-25',
      mileage: '15,000 km',
      assignedTechnician: 'Tech-A',
      status: 'Excellent',
      serviceHistory: [
        { date: '2025-10-25', service: 'Battery Check', mileage: '15,000 km', notes: 'Battery health 98%' },
        { date: '2025-06-10', service: 'Tire Service', mileage: '10,000 km', notes: 'Tire pressure adjusted' },
      ]
    },
  ];

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Needs Attention': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">🚗</span>
              Vehicle Records
            </h2>
            <p className="text-gray-600 mt-1">Track vehicle service history and maintenance</p>
          </div>

          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by registration, make, model, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Vehicles</p>
            <p className="text-2xl font-bold text-primary">{vehicles.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Good Condition</p>
            <p className="text-2xl font-bold text-green-600">
              {vehicles.filter(v => v.status === 'Good' || v.status === 'Excellent').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Need Attention</p>
            <p className="text-2xl font-bold text-yellow-600">
              {vehicles.filter(v => v.status === 'Needs Attention').length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Due This Week</p>
            <p className="text-2xl font-bold text-purple-600">2</p>
          </div>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Vehicles Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-xl font-semibold text-primary">{vehicle.registrationNumber}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">👤</span>
                    <span className="text-gray-700">Owner: {vehicle.owner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">📞</span>
                    <span className="text-gray-700">{vehicle.ownerContact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">🛣️</span>
                    <span className="text-gray-700">Mileage: {vehicle.mileage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">👨‍🔧</span>
                    <span className="text-gray-700">Technician: {vehicle.assignedTechnician}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">Last Service</p>
                    <p className="text-sm font-medium text-gray-800">{vehicle.lastService}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">Next Service</p>
                    <p className="text-sm font-medium text-gray-800">{vehicle.nextService}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  View Service History
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Vehicle Details & Service History</h3>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Vehicle Info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800">
                      {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                    </h4>
                    <p className="text-xl font-semibold text-primary mt-1">{selectedVehicle.registrationNumber}</p>
                  </div>
                  <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(selectedVehicle.status)}`}>
                    {selectedVehicle.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Owner</p>
                    <p className="font-medium text-gray-800">{selectedVehicle.owner}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact</p>
                    <p className="font-medium text-gray-800">{selectedVehicle.ownerContact}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mileage</p>
                    <p className="font-medium text-gray-800">{selectedVehicle.mileage}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Technician</p>
                    <p className="font-medium text-gray-800">{selectedVehicle.assignedTechnician}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Service</p>
                    <p className="font-medium text-gray-800">{selectedVehicle.lastService}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Service</p>
                    <p className="font-medium text-gray-800">{selectedVehicle.nextService}</p>
                  </div>
                </div>
              </div>

              {/* Service History */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Service History</h4>
                <div className="space-y-3">
                  {selectedVehicle.serviceHistory.map((service, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-bold text-gray-800">{service.service}</h5>
                          <p className="text-sm text-gray-600">{service.date}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-600">📊 {service.mileage}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {service.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors">
                  Schedule Service
                </button>
                <button className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleRecords;

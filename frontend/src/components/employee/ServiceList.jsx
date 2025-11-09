import React, { useState } from 'react';

const ServiceList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'Maintenance', 'Brakes', 'Tires', 'Diagnostic', 'Climate Control', 'Electrical', 'Transmission', 'Detailing'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getPopularityColor = (popularity) => {
    switch (popularity) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
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
              <span className="text-3xl">🧰</span>
              Service List
            </h2>
            <p className="text-gray-600 mt-1">Available services and pricing information</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Services</p>
            <p className="text-2xl font-bold text-primary">{services.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Available Now</p>
            <p className="text-2xl font-bold text-green-600">
              {services.filter(s => s.available).length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">High Demand</p>
            <p className="text-2xl font-bold text-yellow-600">
              {services.filter(s => s.popularity === 'High').length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold text-purple-600">{categories.length - 1}</p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Services Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{service.name}</h3>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {service.category}
                    </span>
                  </div>
                  {!service.available && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                      Unavailable
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      🕐 Duration:
                    </span>
                    <span className="font-medium text-gray-800">{service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      📊 Popularity:
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPopularityColor(service.popularity)}`}>
                      {service.popularity}
                    </span>
                  </div>
                </div>

                {/* Includes */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Includes:</p>
                  <ul className="space-y-1">
                    {service.includes.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-primary">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Price</p>
                    <p className="text-2xl font-bold text-primary">{service.price}</p>
                  </div>
                  <button
                    disabled={!service.available}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                      service.available
                        ? 'bg-primary text-white hover:bg-opacity-90'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {service.available ? 'Book Service' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Service Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-2">Popularity Levels:</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">High</span>
                <span className="text-gray-600">Frequently requested service</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Medium</span>
                <span className="text-gray-600">Regular demand</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Low</span>
                <span className="text-gray-600">Specialized service</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-2">Notes:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Prices are subject to change based on vehicle type</li>
              <li>• Duration may vary depending on vehicle condition</li>
              <li>• All services include quality parts and labor</li>
              <li>• Additional charges may apply for premium parts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;

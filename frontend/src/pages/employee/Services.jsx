import React, { useState } from 'react';

const Services = () => {
  // Mock data for available services
  const [services] = useState([
    {
      id: 1,
      name: 'Oil Change',
      category: 'Maintenance',
      description: 'Complete oil and filter change service',
      estimatedTime: '30 minutes',
      basePrice: 75.00,
      popularity: 95,
      icon: '🛢️'
    },
    {
      id: 2,
      name: 'Brake Inspection',
      category: 'Safety',
      description: 'Comprehensive brake system check and assessment',
      estimatedTime: '45 minutes',
      basePrice: 120.00,
      popularity: 88,
      icon: '🔧'
    },
    {
      id: 3,
      name: 'Tire Rotation',
      category: 'Maintenance',
      description: 'Rotate tires for even wear and extended life',
      estimatedTime: '45 minutes',
      basePrice: 50.00,
      popularity: 82,
      icon: '🔄'
    },
    {
      id: 4,
      name: 'Engine Diagnostics',
      category: 'Diagnostics',
      description: 'Computer diagnostics and engine health check',
      estimatedTime: '1 hour',
      basePrice: 250.00,
      popularity: 75,
      icon: '🔍'
    },
    {
      id: 5,
      name: 'Transmission Service',
      category: 'Major Service',
      description: 'Transmission fluid change and inspection',
      estimatedTime: '2 hours',
      basePrice: 350.00,
      popularity: 65,
      icon: '⚙️'
    },
    {
      id: 6,
      name: 'AC Service',
      category: 'Comfort',
      description: 'Air conditioning system check and recharge',
      estimatedTime: '1 hour',
      basePrice: 180.00,
      popularity: 78,
      icon: '❄️'
    },
    {
      id: 7,
      name: 'Battery Check',
      category: 'Electrical',
      description: 'Battery health test and replacement if needed',
      estimatedTime: '30 minutes',
      basePrice: 200.00,
      popularity: 70,
      icon: '🔋'
    },
    {
      id: 8,
      name: 'Wheel Alignment',
      category: 'Maintenance',
      description: 'Precision wheel alignment for optimal handling',
      estimatedTime: '1 hour',
      basePrice: 90.00,
      popularity: 68,
      icon: '⚖️'
    },
    {
      id: 9,
      name: 'Full Service',
      category: 'Comprehensive',
      description: 'Complete vehicle inspection and service',
      estimatedTime: '3 hours',
      basePrice: 150.00,
      popularity: 92,
      icon: '✅'
    },
    {
      id: 10,
      name: 'Brake Replacement',
      category: 'Repair',
      description: 'Complete brake pad and rotor replacement',
      estimatedTime: '2 hours',
      basePrice: 300.00,
      popularity: 60,
      icon: '🛠️'
    },
    {
      id: 11,
      name: 'Engine Tune-up',
      category: 'Performance',
      description: 'Optimize engine performance and efficiency',
      estimatedTime: '2 hours',
      basePrice: 200.00,
      popularity: 72,
      icon: '🎯'
    },
    {
      id: 12,
      name: 'Tire Replacement',
      category: 'Safety',
      description: 'Replace worn tires with new ones',
      estimatedTime: '1.5 hours',
      basePrice: 400.00,
      popularity: 55,
      icon: '🚗'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(services.map(s => s.category))];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Services</h1>
        <p className="text-gray-600 mt-2">Browse all services offered at our facility</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <div className="text-3xl">🔧</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <div className="text-3xl">📁</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(services.reduce((sum, s) => sum + s.basePrice, 0) / services.length).toFixed(0)}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Popular</p>
              <p className="text-lg font-bold text-gray-900">
                {services.reduce((max, s) => s.popularity > max.popularity ? s : max).name}
              </p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                    <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                      {service.category}
                    </span>
                  </div>
                  <div className="text-4xl ml-2">{service.icon}</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">⏱️ Estimated Time</span>
                    <span className="font-medium text-gray-900">{service.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">💰 Base Price</span>
                    <span className="font-bold text-primary text-lg">${service.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-500">Popularity</span>
                      <span className="font-medium text-gray-900">{service.popularity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${service.popularity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;

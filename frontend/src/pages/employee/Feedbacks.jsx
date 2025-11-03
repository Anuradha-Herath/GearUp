import React, { useState } from 'react';

const Feedbacks = () => {
  // Mock data - replace with API call to fetch employee's feedbacks
  const [feedbacks] = useState([
    {
      id: 1,
      customerName: 'John Smith',
      vehicle: 'Toyota Camry 2020 (ABC-1234)',
      rating: 5,
      feedbackText: 'Excellent service! Very professional and thorough. Fixed my brake issue perfectly.',
      serviceDate: '2025-10-28',
      serviceType: 'Brake Service'
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      vehicle: 'Honda Accord 2019 (XYZ-5678)',
      rating: 4,
      feedbackText: 'Good work on the oil change. Service was quick and efficient.',
      serviceDate: '2025-10-27',
      serviceType: 'Oil Change'
    },
    {
      id: 3,
      customerName: 'Michael Chen',
      vehicle: 'Ford F-150 2021 (TOY-1111)',
      rating: 5,
      feedbackText: 'Outstanding diagnostic work! Found the engine problem that other mechanics missed.',
      serviceDate: '2025-10-26',
      serviceType: 'Engine Diagnostics'
    },
    {
      id: 4,
      customerName: 'Emily Davis',
      vehicle: 'BMW X5 2020 (HON-2222)',
      rating: 3,
      feedbackText: 'Service was okay. Took a bit longer than expected but the work was done properly.',
      serviceDate: '2025-10-25',
      serviceType: 'Full Service'
    },
    {
      id: 5,
      customerName: 'David Wilson',
      vehicle: 'Tesla Model 3 2022 (BMW-3333)',
      rating: 5,
      feedbackText: 'Amazing work! Very knowledgeable about electric vehicles. Highly recommend!',
      serviceDate: '2025-10-24',
      serviceType: 'Battery Service'
    },
    {
      id: 6,
      customerName: 'Lisa Anderson',
      vehicle: 'Mercedes C-Class 2021 (MER-4444)',
      rating: 4,
      feedbackText: 'Professional service and clear communication throughout the repair process.',
      serviceDate: '2025-10-23',
      serviceType: 'Transmission Repair'
    },
    {
      id: 7,
      customerName: 'Robert Taylor',
      vehicle: 'Audi A4 2019 (AUD-5555)',
      rating: 5,
      feedbackText: 'Best mechanic I have worked with. Explained everything clearly and fixed the issue on first try.',
      serviceDate: '2025-10-22',
      serviceType: 'Suspension Service'
    },
    {
      id: 8,
      customerName: 'Jennifer Martinez',
      vehicle: 'Nissan Altima 2020 (NIS-6666)',
      rating: 4,
      feedbackText: 'Good service overall. The air conditioning works perfectly now.',
      serviceDate: '2025-10-21',
      serviceType: 'AC Repair'
    },
    {
      id: 9,
      customerName: 'Jennifer Martinez',
      vehicle: 'Nissan Altima 2020 (NIS-6666)',
      rating: 4,
      feedbackText: 'Good service overall. The air conditioning works perfectly now.',
      serviceDate: '2025-10-21',
      serviceType: 'AC Repair'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Calculate average rating
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  // Calculate rating distribution
  const ratingCounts = feedbacks.reduce((acc, f) => {
    acc[f.rating] = (acc[f.rating] || 0) + 1;
    return acc;
  }, {});

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedbackText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'all' || feedback.rating === parseInt(filterRating);
    
    return matchesSearch && matchesRating;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRating]);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStarDisplay = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600';
    if (rating === 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-3xl">📝</span>
          My Feedbacks
        </h1>
        <p className="text-gray-600 mt-2">Customer feedback for your completed services</p>
      </div>

      {/* Average Rating Card */}
      <div className="bg-gradient-to-r bg-primary rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Overall Performance</h2>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold">{averageRating}</div>
              <div>
                <div className="text-2xl mb-1">{getStarDisplay(Math.round(averageRating))}</div>
                <p className="text-sm opacity-90">Based on {feedbacks.length} reviews</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-1 text-sm">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="w-12">{rating} ⭐</span>
                  <div className="w-32 bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all"
                      style={{ width: `${((ratingCounts[rating] || 0) / feedbacks.length) * 100}%` }}
                    />
                  </div>
                  <span className="w-8">{ratingCounts[rating] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Feedbacks</p>
              <p className="text-2xl font-bold text-gray-900">{feedbacks.length}</p>
            </div>
            <div className="text-3xl">💬</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">5 Star Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{ratingCounts[5] || 0}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">4 Star Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{ratingCounts[4] || 0}</p>
            </div>
            <div className="text-3xl">🌟</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Below 4 Stars</p>
              <p className="text-2xl font-bold text-gray-900">
                {(ratingCounts[3] || 0) + (ratingCounts[2] || 0) + (ratingCounts[1] || 0)}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by customer, vehicle, or feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Rating</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
              <option value="4">4 Stars ⭐⭐⭐⭐</option>
              <option value="3">3 Stars ⭐⭐⭐</option>
              <option value="2">2 Stars ⭐⭐</option>
              <option value="1">1 Star ⭐</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedbacks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedFeedbacks.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {feedback.customerName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{feedback.vehicle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${getRatingColor(feedback.rating)}`}>
                        {feedback.rating}.0
                      </span>
                      <span className={getRatingColor(feedback.rating)}>
                        {getStarDisplay(feedback.rating)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {feedback.feedbackText}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {feedback.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {feedback.serviceDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedFeedbacks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Feedbacks Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {filteredFeedbacks.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* Results Info */}
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredFeedbacks.length)}</span> of{' '}
                <span className="font-medium">{filteredFeedbacks.length}</span> results
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    ← Previous
                  </span>
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Mobile Page Indicator */}
                <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    Next →
                  </span>
                </button>
              </div>
            </div>

            {/* Items per page info */}
            <div className="mt-3 text-xs text-gray-500 text-center">
              Displaying {itemsPerPage} items per page
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
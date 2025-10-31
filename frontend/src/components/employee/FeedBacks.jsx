import React, { useMemo, useState } from 'react';

const MOCK_FEEDBACKS = [
  {
    id: 'fb1',
    employeeId: 'e1',
    rating: 5,
    text: 'Fantastic work! Quick and professional. The team was very efficient and my car runs perfectly now.',
    date: '2025-10-22T09:00:00.000Z',
    customer: 'Ali Khan',
    service: 'Full Service',
    vehicle: 'Toyota Corolla 2019',
    resolved: false,
    priority: 'low',
  },
  {
    id: 'fb2',
    employeeId: 'e1',
    rating: 3,
    text: 'Average experience, took longer than expected. Would appreciate better time estimates.',
    date: '2025-10-18T11:30:00.000Z',
    customer: 'Sara Iqbal',
    service: 'Brake Service',
    vehicle: 'Honda Civic 2018',
    resolved: true,
    priority: 'medium',
  },
  {
    id: 'fb3',
    employeeId: 'e2',
    rating: 4,
    text: 'Good job overall. Very satisfied with the results.',
    date: '2025-10-10T14:10:00.000Z',
    customer: 'Usman Raza',
    service: 'Oil Change',
    vehicle: 'Suzuki Alto 2016',
    resolved: false,
    priority: 'low',
  },
  {
    id: 'fb4',
    employeeId: 'e1',
    rating: 2,
    text: 'Communication could be better. Need to improve response time and updates.',
    date: '2025-09-28T08:20:00.000Z',
    customer: 'Hamza Ali',
    service: 'Engine Check',
    vehicle: 'Kia Sportage 2021',
    resolved: false,
    priority: 'high',
  },
  {
    id: 'fb5',
    employeeId: 'e1',
    rating: 5,
    text: 'Exceptional service! Highly recommend. Very professional team.',
    date: '2025-10-20T15:45:00.000Z',
    customer: 'Fatima Noor',
    service: 'Tire Rotation',
    vehicle: 'Mazda CX-5 2020',
    resolved: false,
    priority: 'low',
  },
  {
    id: 'fb6',
    employeeId: 'e1',
    rating: 1,
    text: 'Very disappointed with the service quality. Expected much better.',
    date: '2025-09-25T10:30:00.000Z',
    customer: 'Ahmed Malik',
    service: 'AC Repair',
    vehicle: 'Toyota Camry 2017',
    resolved: false,
    priority: 'high',
  },
];

const StarRating = ({ value }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-lg ${i <= value ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

export default function FeedBacks() {
  const currentEmployeeId = window.__DEMO_EMPLOYEE_ID__ || 'e1';

  const [items, setItems] = useState(MOCK_FEEDBACKS);
  const [filter, setFilter] = useState('all');
  const [notes, setNotes] = useState({});
  const [expanded, setExpanded] = useState({});

  const stats = useMemo(() => {
    const mine = items.filter((f) => f.employeeId === currentEmployeeId);
    const total = mine.length;
    const avg = total ? (mine.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : '0.0';
    const unresolved = mine.filter((f) => !f.resolved).length;
    const needsAttention = mine.filter((f) => !f.resolved && f.rating <= 2).length;
    return { total, avg, unresolved, needsAttention };
  }, [items, currentEmployeeId]);

  const filteredFeedbacks = useMemo(() => {
    let result = items.filter((f) => f.employeeId === currentEmployeeId);
    
    if (filter === 'unresolved') {
      result = result.filter((f) => !f.resolved);
    } else if (filter === 'resolved') {
      result = result.filter((f) => f.resolved);
    } else if (filter === 'high') {
      result = result.filter((f) => f.rating >= 4);
    } else if (filter === 'low') {
      result = result.filter((f) => f.rating <= 2);
    }
    
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [items, currentEmployeeId, filter]);

  const toggleResolved = (id) => {
    setItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, resolved: !f.resolved } : f))
    );
  };

  const saveNote = (id) => {
    console.log('Saving note for feedback:', id, notes[id]);
    setExpanded((e) => ({ ...e, [id]: false }));
    alert('Note saved successfully!');
  };

  const getRatingEmoji = (rating) => {
    if (rating >= 4) return '😊';
    if (rating === 3) return '😐';
    return '😞';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">💬</span>
              Customer Feedback
            </h2>
            <p className="text-gray-600 mt-1">Review and respond to customer feedback</p>
          </div>
          
          {/* Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Feedback</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
              <option value="high">High Ratings (4-5★)</option>
              <option value="low">Low Ratings (1-2★)</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-2xl font-bold text-primary flex items-center gap-2">
              {stats.avg} <span className="text-yellow-400 text-xl">★</span>
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Unresolved</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.unresolved}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Needs Attention</p>
            <p className="text-2xl font-bold text-red-600">{stats.needsAttention}</p>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No feedback matching your filter criteria.</p>
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Feedback Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          {feedback.customer}
                          <span className="text-2xl">{getRatingEmoji(feedback.rating)}</span>
                        </h3>
                        <p className="text-sm text-gray-500">Feedback ID: {feedback.id}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 ${getRatingColor(feedback.rating)} text-sm font-medium rounded-full flex items-center gap-1`}>
                          {feedback.rating} <StarRating value={feedback.rating} />
                        </span>
                        {!feedback.resolved && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Unresolved
                          </span>
                        )}
                        {feedback.resolved && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 italic">"{feedback.text}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">🚗</span>
                        <span className="text-gray-700">{feedback.vehicle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">🔧</span>
                        <span className="text-gray-700">{feedback.service}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">📅</span>
                        <span className="text-gray-700">{formatDate(feedback.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">🕐</span>
                        <span className="text-gray-700">{formatTime(feedback.date)}</span>
                      </div>
                    </div>

                    {/* Note Section */}
                    {expanded[feedback.id] && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Internal Note (Staff Only)
                        </label>
                        <textarea
                          value={notes[feedback.id] || ''}
                          onChange={(e) =>
                            setNotes((n) => ({ ...n, [feedback.id]: e.target.value }))
                          }
                          rows={3}
                          placeholder="Add follow-up actions, resolution details, or internal comments..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => setExpanded((e) => ({ ...e, [feedback.id]: false }))
                            }
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveNote(feedback.id)}
                            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg"
                          >
                            💾 Save Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-3">
                    <button
                      onClick={() => toggleResolved(feedback.id)}
                      className={`flex-1 lg:flex-none px-6 py-3 font-medium rounded-lg transition-colors shadow-md hover:shadow-lg ${
                        feedback.resolved
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-primary text-white hover:bg-opacity-90'
                      }`}
                    >
                      {feedback.resolved ? '↻ Reopen' : '✓ Mark Resolved'}
                    </button>
                    <button
                      onClick={() => setExpanded((e) => ({ ...e, [feedback.id]: !e[feedback.id] }))}
                      className="flex-1 lg:flex-none px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {expanded[feedback.id] ? '✕ Hide Note' : '📝 Add Note'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { formatDate } from "../../utils/formatDate";

const MOCK_FEEDBACKS = [
  {
    _id: "f1",
    customerId: "c1",
    rating: 5,
    text: "Excellent service, quick turnaround. The team was very professional and my car looks brand new!",
    appointment: {
      serviceDate: "2025-10-12T09:00:00.000Z",
      vehicle: { display: "Toyota Corolla 2019" },
    },
  },
  {
    _id: "f2",
    customerId: "c1",
    rating: 4,
    text: "Good experience overall. Minor delay but worth the wait.",
    appointment: {
      serviceDate: "2025-09-28T14:30:00.000Z",
      vehicle: { display: "Honda Civic 2018" },
    },
  },
  {
    _id: "f3",
    customerId: "c2",
    rating: 3,
    text: "Average, could improve waiting time.",
    appointment: {
      serviceDate: "2025-08-20T11:15:00.000Z",
      vehicle: { display: "Suzuki Alto 2016" },
    },
  },
];

export default function MyFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [filterRating, setFilterRating] = useState("all");
  const navigate = useNavigate();

  const currentCustomerId = window.__DEMO_CUSTOMER_ID__ || "c1";

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFeedbacks(MOCK_FEEDBACKS);
      setLoading(false);
    }, 300);
  }, []);

  const myFeedbacks = useMemo(() => {
    let filtered = feedbacks.filter((f) => f.customerId === currentCustomerId);
    if (filterRating !== "all") {
      filtered = filtered.filter((f) => f.rating === parseInt(filterRating));
    }
    return filtered;
  }, [feedbacks, currentCustomerId, filterRating]);

  const averageRating = useMemo(() => {
    if (myFeedbacks.length === 0) return 0;
    const sum = myFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / myFeedbacks.length).toFixed(1);
  }, [myFeedbacks]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Feedbacks</h1>
              <p className="text-gray-600">Track and manage your service reviews</p>
            </div>
            <button
              onClick={() => navigate("/customer/feedback-form")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Feedback</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900">{myFeedbacks.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Latest Review</p>
                  <p className="text-lg font-bold text-gray-900">
                    {myFeedbacks.length > 0
                      ? new Date(myFeedbacks[0].appointment?.serviceDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Filter Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by rating:</label>
              <div className="flex space-x-2">
                {["all", "5", "4", "3", "2", "1"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setFilterRating(val)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterRating === val
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {val === "all" ? "All" : `${val}★`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {myFeedbacks.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedbacks yet</h3>
              <p className="text-gray-600 mb-6">Start sharing your experiences with our services</p>
              <button
                onClick={() => navigate("/customer/feedback")}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Leave Your First Feedback</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {myFeedbacks.map((f) => (
                <div key={f._id || f.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {f.appointment?.vehicle?.display || f.appointment?.vehicle?.make || f.vehicle || "Vehicle"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {f.appointment?.serviceDate
                              ? formatDate(f.appointment.serviceDate)
                              : f.serviceDate
                              ? formatDate(f.serviceDate)
                              : "Date unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-2xl ${star <= f.rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{f.text || "No written feedback"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

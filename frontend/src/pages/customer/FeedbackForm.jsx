import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

const MOCK_COMPLETED_APPOINTMENTS = [
  {
    id: "a1",
    serviceDate: "2025-10-12T09:00:00.000Z",
    vehicle: { make: "Toyota Corolla 2019" },
  },
  {
    id: "a2",
    serviceDate: "2025-09-28T14:30:00.000Z",
    vehicle: { make: "Honda Civic 2018" },
  },
  {
    id: "a3",
    serviceDate: "2025-08-20T11:15:00.000Z",
    vehicle: { make: "Suzuki Alto 2016" },
  },
];

export default function FeedbackForm() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setAppointments(MOCK_COMPLETED_APPOINTMENTS);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedAppointment) {
      setError("Please select an appointment.");
      return;
    }
    if (rating < 1) {
      setError("Please provide a rating (1-5).");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      console.log("Submitted feedback:", {
        appointmentId: selectedAppointment,
        rating,
        text: feedbackText,
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/customer/feedbacks");
      }, 1500);
      setSubmitting(false);
    }, 600);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience</h1>
          <p className="text-gray-600">Help us improve our service with your valuable feedback</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center animate-fade-in">
            <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-medium text-green-900">Feedback submitted successfully!</p>
              <p className="text-sm text-green-700">Redirecting you...</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={submitFeedback} className="space-y-6">
            {/* Appointment Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Appointment <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedAppointment}
                  onChange={(e) => setSelectedAppointment(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white cursor-pointer hover:border-gray-300"
                  required
                >
                  <option value="">Choose a completed service</option>
                  {appointments.length === 0 && (
                    <option value="" disabled>
                      No completed appointments found
                    </option>
                  )}
                  {appointments.map((a) => (
                    <option key={a.id || a._id} value={a.id || a._id}>
                      {a.serviceDate
                        ? `${new Date(a.serviceDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })} • ${a.vehicle?.make || a.vehicle || "Vehicle"}`
                        : `Appointment ${a.id || a._id}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rate Your Experience <span className="text-red-500">*</span>
              </label>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transform transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1"
                      aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
                    >
                      <span
                        className={`text-5xl transition-colors duration-200 ${
                          i <= (hoverRating || rating)
                            ? "text-yellow-400 drop-shadow-lg"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  {rating > 0 ? (
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{rating} / 5</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {rating === 5 && "Excellent!"}
                        {rating === 4 && "Great!"}
                        {rating === 3 && "Good"}
                        {rating === 2 && "Could be better"}
                        {rating === 1 && "Needs improvement"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Click to rate</p>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Feedback
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={6}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                placeholder="Tell us about your experience... What did you like? What could we improve?"
              />
              <p className="text-xs text-gray-500 mt-2">
                {feedbackText.length} / 500 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || !selectedAppointment || rating < 1}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                  submitting || !selectedAppointment || rating < 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

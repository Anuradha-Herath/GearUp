import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

// Temporary mock completed appointments (replace with API later)
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
  const navigate = useNavigate();

  useEffect(() => {
    // Use mock data instead of API for now
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

    // Simulate submit success without backend
    setSubmitting(true);
    setTimeout(() => {
      // You can console.log the payload to inspect it
      console.log("Submitted feedback:", {
        appointmentId: selectedAppointment,
        rating,
        text: feedbackText,
      });
      navigate("/customer/my-feedbacks");
      setSubmitting(false);
    }, 600);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Leave Feedback</h2>
      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={submitFeedback} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Completed Appointment
          </label>
          <select
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Select appointment --</option>
            {appointments.length === 0 && (
              <option value="" disabled>
                No completed appointments found
              </option>
            )}
            {appointments.map((a) => (
              <option key={a.id || a._id} value={a.id || a._id}>
                {a.serviceDate
                  ? `${new Date(a.serviceDate).toLocaleDateString()} • ${
                      a.vehicle?.make || a.vehicle || "Vehicle"
                    }`
                  : `Appointment ${a.id || a._id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                type="button"
                key={i}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl focus:outline-none"
                aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
              >
                <span
                  className={`${
                    i <= (hoverRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {rating ? `${rating} / 5` : "No rating"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Feedback</label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={5}
            className="w-full border rounded px-3 py-2"
            placeholder="Write about your experience..."
          />
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </div>
  );
}

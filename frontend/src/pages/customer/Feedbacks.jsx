import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { formatDate } from "../../utils/formatDate";
// If you already have a hook, prefer: import useAuth from "../../hooks/useAuth";
import { AuthProvider } from "../../context/AuthContext"; // only for types; not used

// Temporary hard-coded feedbacks (replace with API later)
// Include a customerId to simulate "logged-in customer" filtering.
const MOCK_FEEDBACKS = [
  {
    _id: "f1",
    customerId: "c1",
    rating: 5,
    text: "Excellent service, quick turnaround.",
    appointment: {
      serviceDate: "2025-10-12T09:00:00.000Z",
      vehicle: { display: "Toyota Corolla 2019" },
    },
  },
  {
    _id: "f2",
    customerId: "c1",
    rating: 4,
    text: "Good experience overall.",
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
  const navigate = useNavigate();

  // TODO: Replace with actual auth user id (e.g., from useAuth() or AuthContext)
  // Try reading from window mock or fall back to demo id "c1" so the page shows data.
  const currentCustomerId =
    window.__DEMO_CUSTOMER_ID__ ||
    null; // set to "c1" to force demo; keep null to simulate real auth

  useEffect(() => {
    // Using hard-coded data for now
    setLoading(true);
    setFeedbacks(MOCK_FEEDBACKS);
    setLoading(false);
  }, []);

  const myFeedbacks = useMemo(() => {
    if (!currentCustomerId) return MOCK_FEEDBACKS; // show all in demo if no user id
    return feedbacks.filter((f) => f.customerId === currentCustomerId);
  }, [feedbacks, currentCustomerId]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">My Feedbacks</h2>
        <Button onClick={() => navigate("/customer/feedback")}>
          Leave Feedback
        </Button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      {myFeedbacks.length === 0 ? (
        <div className="text-gray-600">You haven't left any feedback yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="py-2 px-3">Service Date</th>
                <th className="py-2 px-3">Vehicle</th>
                <th className="py-2 px-3">Rating</th>
                <th className="py-2 px-3">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {myFeedbacks.map((f) => (
                <tr key={f._id || f.id} className="border-b">
                  <td className="py-3 px-3 text-sm">
                    {f.appointment?.serviceDate
                      ? formatDate(f.appointment.serviceDate)
                      : f.serviceDate
                      ? formatDate(f.serviceDate)
                      : "—"}
                  </td>
                  <td className="py-3 px-3 text-sm">
                    {f.appointment?.vehicle?.display ||
                      f.appointment?.vehicle?.make ||
                      f.vehicle ||
                      "—"}
                  </td>
                  <td className="py-3 px-3 text-sm whitespace-nowrap">
                    <span className="text-yellow-400" aria-hidden="true">
                      {Array.from({ length: f.rating || 0 })
                        .map(() => "★")
                        .join("")}
                    </span>
                    <span className="text-gray-300" aria-hidden="true">
                      {Array.from({ length: 5 - (f.rating || 0) })
                        .map(() => "★")
                        .join("")}
                    </span>
                    <span className="sr-only">{f.rating}/5</span>
                  </td>
                  <td className="py-3 px-3 text-sm">{f.text || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Demo helper: set a mock logged-in customer id in the console
          window.__DEMO_CUSTOMER_ID__ = "c1"; and refresh */}
      <p className="mt-3 text-xs text-gray-400">
        Showing feedbacks for the logged-in customer (demo).
      </p>
    </div>
  );
}

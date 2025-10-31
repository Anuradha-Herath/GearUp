import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    customerId: null,
    action: null,
  });
  const toast = useToast();
  const [editFormData, setEditFormData] = useState({
    username: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const toggleCustomerStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = !currentStatus;
      await adminService.updateCustomerStatus(id, newStatus);
      setCustomers((prevCustomers) =>
        prevCustomers.map((cust) =>
          cust.id === id ? { ...cust, isActive: newStatus } : cust
        )
      );
      toast.success(
        `Customer ${newStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      console.error("Error updating customer status:", error);
      toast.error("Failed to update customer status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    setConfirmModal({ isOpen: true, customerId: id, action: "delete" });
  };

  const handleConfirmDelete = async () => {
    const { customerId } = confirmModal;
    setConfirmModal({ isOpen: false, customerId: null, action: null });
    try {
      setLoading(true);
      await adminService.deleteCustomer(customerId);
      toast.success("Customer deleted successfully!");
      await fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditCustomer = (customer) => {
    setEditingCustomer(customer.id);
    setEditFormData({
      username: customer.username,
      phoneNumber: customer.phoneNumber || "",
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingCustomer(null);
    setEditFormData({
      username: "",
      phoneNumber: "",
    });
    setErrors({});
  };

  const validateEditForm = () => {
    const newErrors = {};
    if (!editFormData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (editFormData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (editFormData.phoneNumber && editFormData.phoneNumber.length > 20) {
      newErrors.phoneNumber = "Phone number must not exceed 20 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;
    try {
      setLoading(true);
      await adminService.updateCustomer(editingCustomer, editFormData);
      toast.success("Customer updated successfully!");
      setEditingCustomer(null);
      await fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Manage Customers</h1>
      </div>

      {loading && !customers.length ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading customers...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <p className="text-gray-600">No customers found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">
              Customer List ({customers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    {editingCustomer === customer.id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="username"
                            value={editFormData.username}
                            onChange={handleEditInputChange}
                            className={`w-full px-2 py-1 border rounded text-sm ${
                              errors.username ? "border-red-500" : "border-gray-300"
                            }`}
                            disabled={loading}
                          />
                          {errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={editFormData.phoneNumber}
                            onChange={handleEditInputChange}
                            className={`w-full px-2 py-1 border rounded text-sm ${
                              errors.phoneNumber ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Phone"
                            disabled={loading}
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {customer.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleEditSubmit}
                              className="p-2 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                              disabled={loading}
                              title="Save Changes"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                              disabled={loading}
                              title="Cancel Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{customer.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.phoneNumber || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {customer.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditCustomer(customer)}
                              className="p-2 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                              disabled={loading}
                              title="Edit Customer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => toggleCustomerStatus(customer.id, customer.isActive)}
                              className={`p-2 rounded-full transition-colors ${
                                customer.isActive
                                  ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                              disabled={loading}
                              title={customer.isActive ? "Deactivate Customer" : "Activate Customer"}
                            >
                              {customer.isActive ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => deleteCustomer(customer.id)}
                              className="p-2 rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                              disabled={loading}
                              title="Delete Customer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, customerId: null, action: null })}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ManageCustomers;
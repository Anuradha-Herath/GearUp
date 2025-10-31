import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    employeeId: null,
    action: null,
  });
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [editFormData, setEditFormData] = useState({
    username: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (formData.phoneNumber && formData.phoneNumber.length > 20) {
      newErrors.phoneNumber = "Phone number must not exceed 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await adminService.createEmployee(formData);

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
      });

      setShowForm(false);
      toast.success("Employee created successfully!");

      // Refresh employee list
      await fetchEmployees();
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      const newStatus = !currentStatus;
      console.log("Toggling employee status:", {
        id,
        currentStatus,
        newStatus,
      });

      const result = await adminService.updateEmployeeStatus(id, newStatus);
      console.log("Status update result:", result);

      // Update local state instead of refetching all employees
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === id ? { ...emp, isActive: newStatus } : emp
        )
      );

      toast.success(
        `Employee ${newStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error("Failed to update employee status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    setConfirmModal({ isOpen: true, employeeId: id, action: "delete" });
  };

  const handleConfirmDelete = async () => {
    const { employeeId } = confirmModal;
    setConfirmModal({ isOpen: false, employeeId: null, action: null });

    try {
      setLoading(true);
      await adminService.deleteEmployee(employeeId);
      toast.success("Employee deleted successfully!");

      // Refresh employee list
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditEmployee = (employee) => {
    setEditingEmployee(employee.id);
    setEditFormData({
      username: employee.username,
      phoneNumber: employee.phoneNumber || "",
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
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
      await adminService.updateEmployee(editingEmployee, editFormData);

      toast.success("Employee updated successfully!");
      setEditingEmployee(null);

      // Refresh employee list
      await fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Manage Employees</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#7A85C1] text-white px-4 py-2 rounded-lg hover:bg-[#6a75a8] transition-colors"
        >
          {showForm ? "Cancel" : "Add New Employee"}
        </button>
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Create New Employee
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter username (min 3 characters)"
                  disabled={loading}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter password (min 6 characters)"
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Re-enter password"
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter phone number (optional)"
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#7A85C1] text-white rounded-lg hover:bg-[#6a75a8] transition-colors disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee List */}
      {loading && !showForm ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading employees...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <p className="text-gray-600">
            No employees found. Add your first employee!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">
              Employee List ({employees.length})
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
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    {editingEmployee === employee.id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            name="username"
                            value={editFormData.username}
                            onChange={handleEditInputChange}
                            className={`w-full px-2 py-1 border rounded text-sm ${
                              errors.username
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            disabled={loading}
                          />
                          {errors.username && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.username}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={editFormData.phoneNumber}
                            onChange={handleEditInputChange}
                            className={`w-full px-2 py-1 border rounded text-sm ${
                              errors.phoneNumber
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Phone"
                            disabled={loading}
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.phoneNumber}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              employee.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {employee.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {/* Save Button */}
                            <button
                              onClick={handleEditSubmit}
                              className="p-2 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                              disabled={loading}
                              title="Save Changes"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>

                            {/* Cancel Button */}
                            <button
                              onClick={cancelEdit}
                              className="p-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                              disabled={loading}
                              title="Cancel Edit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {employee.phoneNumber || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              employee.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {employee.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => startEditEmployee(employee)}
                              className="p-2 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                              disabled={loading}
                              title="Edit Employee"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>

                            {/* Activate/Deactivate Button */}
                            <button
                              onClick={() =>
                                toggleEmployeeStatus(
                                  employee.id,
                                  employee.isActive
                                )
                              }
                              className={`p-2 rounded-full transition-colors ${
                                employee.isActive
                                  ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                              disabled={loading}
                              title={
                                employee.isActive
                                  ? "Deactivate Employee"
                                  : "Activate Employee"
                              }
                            >
                              {employee.isActive ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              )}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => deleteEmployee(employee.id)}
                              className="p-2 rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                              disabled={loading}
                              title="Delete Employee"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setConfirmModal({ isOpen: false, employeeId: null, action: null })
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ManageEmployees;

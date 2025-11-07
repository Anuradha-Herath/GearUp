import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ImageUploader from '../../components/common/ImageUploader';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    serviceId: null,
    action: null,
  });
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    image: '',
    includedSubservices: '',
    estimatedDuration: '',
    estimatedPrice: '',
    maxPerDay: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length < 3) newErrors.title = "Title must be at least 3 characters";

    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Description is required";
    else if (formData.shortDescription.length < 10) newErrors.shortDescription = "Description must be at least 10 characters";

    if (!formData.estimatedDuration.trim()) newErrors.estimatedDuration = "Duration is required";

    if (!formData.estimatedPrice.trim()) newErrors.estimatedPrice = "Price is required";
    else if (parseFloat(formData.estimatedPrice) <= 0) newErrors.estimatedPrice = "Price must be greater than 0";

    if (!formData.maxPerDay.trim()) newErrors.maxPerDay = "Max per day is required";
    else if (parseInt(formData.maxPerDay) <= 0) newErrors.maxPerDay = "Max per day must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const serviceData = {
        ...formData,
        estimatedPrice: parseFloat(formData.estimatedPrice),
        maxPerDay: parseInt(formData.maxPerDay)
      };

      if (editingService) {
        await adminService.updateService(editingService.id, serviceData);
        toast.success('Service updated successfully!');
      } else {
        await adminService.createService(serviceData);
        toast.success('Service created successfully!');
      }

      await fetchServices();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      shortDescription: service.shortDescription,
      image: service.image || '',
      includedSubservices: service.includedSubservices || '',
      estimatedDuration: service.estimatedDuration,
      estimatedPrice: service.estimatedPrice.toString(),
      maxPerDay: service.maxPerDay.toString()
    });
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, serviceId: id, action: 'delete' });
  };

  const handleConfirmDelete = async () => {
    const { serviceId } = confirmModal;
    setConfirmModal({ isOpen: false, serviceId: null, action: null });

    try {
      setLoading(true);
      await adminService.deleteService(serviceId);
      toast.success('Service deleted successfully!');
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      title: '',
      shortDescription: '',
      image: '',
      includedSubservices: '',
      estimatedDuration: '',
      estimatedPrice: '',
      maxPerDay: ''
    });
    setErrors({});
  };

  const handleAddNew = () => {
    setEditingService(null);
    setFormData({
      title: '',
      shortDescription: '',
      image: '',
      includedSubservices: '',
      estimatedDuration: '',
      estimatedPrice: '',
      maxPerDay: ''
    });
    setShowForm(true);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Manage Services</h1>
        <button
          onClick={handleAddNew}
          className="bg-[#7A85C1] text-white px-4 py-2 rounded-lg hover:bg-[#6a75a8] transition-colors"
        >
          + Add New Service
        </button>
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter service title"
                    disabled={loading}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description *
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                      errors.shortDescription ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter service description"
                    disabled={loading}
                  />
                  {errors.shortDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Image
                  </label>
                  <ImageUploader
                    value={formData.image}
                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Included Subservices (comma-separated)
                  </label>
                  <textarea
                    name="includedSubservices"
                    value={formData.includedSubservices}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1]"
                    placeholder="e.g., Oil change, Filter replacement, Fluid top-up"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Duration *
                    </label>
                    <input
                      type="text"
                      name="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                        errors.estimatedDuration ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., 2 hours"
                      disabled={loading}
                    />
                    {errors.estimatedDuration && (
                      <p className="text-red-500 text-sm mt-1">{errors.estimatedDuration}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Price ($) *
                    </label>
                    <input
                      type="number"
                      name="estimatedPrice"
                      value={formData.estimatedPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                        errors.estimatedPrice ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                      disabled={loading}
                    />
                    {errors.estimatedPrice && (
                      <p className="text-red-500 text-sm mt-1">{errors.estimatedPrice}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Per Day *
                    </label>
                    <input
                      type="number"
                      name="maxPerDay"
                      value={formData.maxPerDay}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${
                        errors.maxPerDay ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0"
                      disabled={loading}
                    />
                    {errors.maxPerDay && (
                      <p className="text-red-500 text-sm mt-1">{errors.maxPerDay}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7A85C1] text-white rounded-lg hover:bg-[#6a75a8] transition-colors disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingService ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services List */}
      {loading && !showForm ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md border text-center">
          <p className="text-gray-600">
            No services found. Add your first service!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">
              Service List ({services.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max/Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {service.shortDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.estimatedDuration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${service.estimatedPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.maxPerDay}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                          disabled={loading}
                          title="Edit Service"
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

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                          disabled={loading}
                          title="Delete Service"
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
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setConfirmModal({ isOpen: false, serviceId: null, action: null })
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ManageServices;
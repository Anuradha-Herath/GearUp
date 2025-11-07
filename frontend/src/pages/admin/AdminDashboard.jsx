import React, { useState, useEffect } from 'react';
import { Calendar, Users, Car, DollarSign, TrendingUp, Clock } from 'lucide-react';

import MetricCard from '../../components/dashboard/MetricCard';
import AppointmentTrendsChart from '../../components/dashboard/AppointmentTrendsChart';
import StatusDistributionChart from '../../components/dashboard/StatusDistributionChart';
import ServicePopularityChart from '../../components/dashboard/ServicePopularityChart';
import CustomerActivityChart from '../../components/dashboard/CustomerGrowthChart';

import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    overview: {},
    statusDistribution: [],
    dailyTrends: [],
    servicePopularity: [],
    customerActivity: [],
    revenueByService: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        overview,
        statusDistribution,
        dailyTrends,
        servicePopularity,
        customerActivity,
        revenueByService
      ] = await Promise.all([
        adminService.getDashboardOverview(),
        adminService.getAppointmentStatusDistribution(),
        adminService.getDailyAppointmentTrends(),
        adminService.getServicePopularity(),
        adminService.getCustomerActivity(),
        adminService.getRevenueByService()
      ]);

      setDashboardData({
        overview,
        statusDistribution,
        dailyTrends,
        servicePopularity,
        customerActivity,
        revenueByService
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return { trend: 'neutral', value: null };
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return { trend: 'up', value: `+${change.toFixed(1)}%` };
    if (change < -5) return { trend: 'down', value: `${change.toFixed(1)}%` };
    return { trend: 'neutral', value: `${change.toFixed(1)}%` };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A85C1] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-[#7A85C1] text-white px-4 py-2 rounded-lg hover:bg-[#6B76B2]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your comprehensive business analytics</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Appointments"
            value={dashboardData.overview.totalAppointments || 0}
            icon={Calendar}
            color="blue"
            trend="up"
            trendValue="+12.5%"
          />
          <MetricCard
            title="Active Customers"
            value={dashboardData.overview.activeCustomers || 0}
            icon={Users}
            color="green"
            trend="up"
            trendValue="+8.2%"
          />
          <MetricCard
            title="This Month"
            value={dashboardData.overview.thisMonthAppointments || 0}
            icon={Clock}
            color="purple"
            trend="up"
            trendValue="+15.3%"
          />
          <MetricCard
            title="Total Revenue"
            value={dashboardData.overview.totalRevenue || 0}
            icon={DollarSign}
            color="green"
            prefix="$"
            trend="up"
            trendValue="+22.8%"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AppointmentTrendsChart
            data={dashboardData.dailyTrends}
            title="7-Day Appointment & Revenue Trends"
          />
          <StatusDistributionChart
            data={dashboardData.statusDistribution}
            title="Appointment Status Distribution"
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ServicePopularityChart
            data={dashboardData.servicePopularity}
            title="Most Popular Services"
          />
          <CustomerActivityChart
            data={dashboardData.customerActivity}
            title="Customer Growth (Last 12 Months)"
          />
        </div>

        {/* Revenue by Service Table */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Service</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.revenueByService.map((service, index) => {
                  const totalRevenue = dashboardData.revenueByService.reduce((sum, s) => sum + s.revenue, 0);
                  const percentage = totalRevenue > 0 ? (service.revenue / totalRevenue) * 100 : 0;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          ${service.revenue.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900">{percentage.toFixed(1)}%</div>
                          <div className="ml-2 bg-gray-200 rounded-full h-2 w-20">
                            <div
                              className="bg-[#7A85C1] h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchDashboardData}
            className="bg-[#7A85C1] text-white px-6 py-2 rounded-lg hover:bg-[#6B76B2] transition-colors"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
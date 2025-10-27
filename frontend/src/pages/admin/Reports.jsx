import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [reportType, setReportType] = useState('appointments');
  const [dateRange, setDateRange] = useState('last30days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate sample report data based on filters
  useEffect(() => {
    generateReport();
  }, [reportType, dateRange, statusFilter]);

  const generateReport = () => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let data;

      switch (reportType) {
        case 'appointments':
          data = generateAppointmentReport();
          break;
        case 'customers':
          data = generateCustomerReport();
          break;
        case 'employees':
          data = generateEmployeeReport();
          break;
        case 'financial':
          data = generateFinancialReport();
          break;
        default:
          data = generateAppointmentReport();
      }

      setReportData(data);
      setLoading(false);
    }, 1000);
  };

  const generateAppointmentReport = () => {
    const appointments = [
      { date: '2024-10-01', count: 12, completed: 10, cancelled: 2 },
      { date: '2024-10-02', count: 15, completed: 13, cancelled: 2 },
      { date: '2024-10-03', count: 8, completed: 7, cancelled: 1 },
      { date: '2024-10-04', count: 18, completed: 16, cancelled: 2 },
      { date: '2024-10-05', count: 14, completed: 12, cancelled: 2 },
      { date: '2024-10-06', count: 11, completed: 9, cancelled: 2 },
      { date: '2024-10-07', count: 16, completed: 14, cancelled: 2 },
    ];

    const totalAppointments = appointments.reduce((sum, day) => sum + day.count, 0);
    const totalCompleted = appointments.reduce((sum, day) => sum + day.completed, 0);
    const totalCancelled = appointments.reduce((sum, day) => sum + day.cancelled, 0);
    const completionRate = ((totalCompleted / totalAppointments) * 100).toFixed(1);

    return {
      summary: {
        totalAppointments,
        totalCompleted,
        totalCancelled,
        completionRate: `${completionRate}%`
      },
      chartData: {
        labels: appointments.map(day => day.date),
        datasets: [
          {
            label: 'Total Appointments',
            data: appointments.map(day => day.count),
            backgroundColor: 'rgba(122, 133, 193, 0.6)',
            borderColor: 'rgba(122, 133, 193, 1)',
            borderWidth: 1,
          },
          {
            label: 'Completed',
            data: appointments.map(day => day.completed),
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
          },
        ],
      },
      chartType: 'bar'
    };
  };

  const generateCustomerReport = () => {
    const customers = [
      { month: 'Jan', new: 25, returning: 45, total: 70 },
      { month: 'Feb', new: 30, returning: 52, total: 82 },
      { month: 'Mar', new: 28, returning: 48, total: 76 },
      { month: 'Apr', new: 35, returning: 55, total: 90 },
      { month: 'May', new: 42, returning: 61, total: 103 },
      { month: 'Jun', new: 38, returning: 58, total: 96 },
    ];

    const totalNew = customers.reduce((sum, month) => sum + month.new, 0);
    const totalReturning = customers.reduce((sum, month) => sum + month.returning, 0);
    const totalCustomers = totalNew + totalReturning;

    return {
      summary: {
        totalCustomers,
        totalNew,
        totalReturning,
        avgMonthlyGrowth: '8.5%'
      },
      chartData: {
        labels: customers.map(month => month.month),
        datasets: [
          {
            label: 'New Customers',
            data: customers.map(month => month.new),
            borderColor: 'rgba(122, 133, 193, 1)',
            backgroundColor: 'rgba(122, 133, 193, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Returning Customers',
            data: customers.map(month => month.returning),
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
          },
        ],
      },
      chartType: 'line'
    };
  };

  const generateEmployeeReport = () => {
    const employees = [
      { name: 'Mike Johnson', appointments: 45, rating: 4.8, efficiency: 92 },
      { name: 'Tom Wilson', appointments: 38, rating: 4.6, efficiency: 88 },
      { name: 'Lisa Chen', appointments: 42, rating: 4.9, efficiency: 95 },
      { name: 'Sarah Davis', appointments: 35, rating: 4.7, efficiency: 90 },
      { name: 'John Smith', appointments: 40, rating: 4.5, efficiency: 87 },
    ];

    return {
      summary: {
        totalEmployees: employees.length,
        avgRating: (employees.reduce((sum, emp) => sum + emp.rating, 0) / employees.length).toFixed(1),
        totalAppointments: employees.reduce((sum, emp) => sum + emp.appointments, 0),
        avgEfficiency: `${(employees.reduce((sum, emp) => sum + emp.efficiency, 0) / employees.length).toFixed(1)}%`
      },
      chartData: {
        labels: employees.map(emp => emp.name),
        datasets: [{
          label: 'Appointments Completed',
          data: employees.map(emp => emp.appointments),
          backgroundColor: [
            'rgba(122, 133, 193, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderWidth: 1,
        }],
      },
      chartType: 'doughnut'
    };
  };

  const generateFinancialReport = () => {
    const finances = [
      { month: 'Jan', revenue: 12500, expenses: 8200, profit: 4300 },
      { month: 'Feb', revenue: 14200, expenses: 8900, profit: 5300 },
      { month: 'Mar', revenue: 13800, expenses: 8500, profit: 5300 },
      { month: 'Apr', revenue: 15600, expenses: 9200, profit: 6400 },
      { month: 'May', revenue: 16800, expenses: 9800, profit: 7000 },
      { month: 'Jun', revenue: 17200, expenses: 10100, profit: 7100 },
    ];

    const totalRevenue = finances.reduce((sum, month) => sum + month.revenue, 0);
    const totalExpenses = finances.reduce((sum, month) => sum + month.expenses, 0);
    const totalProfit = finances.reduce((sum, month) => sum + month.profit, 0);

    return {
      summary: {
        totalRevenue: `$${totalRevenue.toLocaleString()}`,
        totalExpenses: `$${totalExpenses.toLocaleString()}`,
        totalProfit: `$${totalProfit.toLocaleString()}`,
        profitMargin: `${((totalProfit / totalRevenue) * 100).toFixed(1)}%`
      },
      chartData: {
        labels: finances.map(month => month.month),
        datasets: [
          {
            label: 'Revenue',
            data: finances.map(month => month.revenue),
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
          },
          {
            label: 'Expenses',
            data: finances.map(month => month.expenses),
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
          },
          {
            label: 'Profit',
            data: finances.map(month => month.profit),
            backgroundColor: 'rgba(122, 133, 193, 0.6)',
            borderColor: 'rgba(122, 133, 193, 1)',
            borderWidth: 1,
          },
        ],
      },
      chartType: 'bar'
    };
  };

  const exportReport = (format) => {
    // Simulate export functionality
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}`);
  };

  const renderChart = () => {
    if (!reportData) return null;

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        },
      },
    };

    switch (reportData.chartType) {
      case 'bar':
        return <Bar data={reportData.chartData} options={options} />;
      case 'line':
        return <Line data={reportData.chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={reportData.chartData} options={options} />;
      default:
        return <Bar data={reportData.chartData} options={options} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Reports & Analytics</h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportReport('pdf')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Export PDF
          </button>
          <button
            onClick={() => exportReport('csv')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1]"
            >
              <option value="appointments">Appointments Report</option>
              <option value="customers">Customer Report</option>
              <option value="employees">Employee Performance</option>
              <option value="financial">Financial Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1]"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1]"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={generateReport}
            className="bg-[#7A85C1] text-white px-6 py-2 rounded-lg hover:bg-[#6a75a8] transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(reportData.summary).map(([key, value]) => (
            <div key={key} className="bg-white p-4 rounded-lg shadow-md border">
              <div className="text-sm text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-2xl font-bold text-black mt-1">{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4 text-black">Report Visualization</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A85C1]"></div>
          </div>
        ) : reportData ? (
          <div className="h-64">
            {renderChart()}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            Select filters and generate a report to view the chart
          </div>
        )}
      </div>

      {/* Detailed Data Table */}
      {reportData && (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">Detailed Data</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {reportData.chartData.labels.map((label, index) => (
                      <th key={index} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    {reportData.chartData.datasets[0].data.map((value, index) => (
                      <td key={index} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {value}
                      </td>
                    ))}
                  </tr>
                  {reportData.chartData.datasets.length > 1 && (
                    <tr>
                      {reportData.chartData.datasets[1].data.map((value, index) => (
                        <td key={index} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {value}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
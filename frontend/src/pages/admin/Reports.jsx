import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  const [reportType, setReportType] = useState('appointments');
  const [dateRange, setDateRange] = useState('last30days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Keep the UI consistent: statusFilter only applies to appointments but should remain visible.
  const isStatusApplicable = (type) => type === 'appointments';

  // When switching away from appointments, reset status filter to 'all' so selections remain consistent
  useEffect(() => {
    if (!isStatusApplicable(reportType) && statusFilter !== 'all') {
      setStatusFilter('all');
    }
  }, [reportType]);

  // Generate sample report data based on filters
  useEffect(() => {
    generateReport();
  }, [reportType, dateRange, statusFilter]);
  const generateReport = async () => {
    setLoading(true);

    // If appointments, fetch server analytics
    if (reportType === 'appointments') {
      try {
        // build query params from dateRange and statusFilter
        const params = new URLSearchParams();
        const today = new Date();
        let start = null;
        if (dateRange === 'last7days') {
          const d = new Date(); d.setDate(today.getDate() - 6); start = d;
        } else if (dateRange === 'last30days') {
          const d = new Date(); d.setDate(today.getDate() - 29); start = d;
        } else if (dateRange === 'last3months') {
          const d = new Date(); d.setMonth(today.getMonth() - 3); start = d;
        } else if (dateRange === 'last6months') {
          const d = new Date(); d.setMonth(today.getMonth() - 6); start = d;
        } else if (dateRange === 'lastyear') {
          const d = new Date(); d.setFullYear(today.getFullYear() - 1); start = d;
        }
        if (start) {
          // format as yyyy-mm-dd
          const fmt = (dt) => dt.toISOString().slice(0,10);
          params.set('startDate', fmt(start));
          params.set('endDate', fmt(today));
        }
        // map frontend status filter to backend status values
        if (statusFilter && statusFilter !== 'all') {
          if (statusFilter === 'completed') params.set('status', 'FINISHED');
          else if (statusFilter === 'cancelled') params.set('status', 'CANCELLED');
          // 'active' and others left unset to be handled server-side in future
        }

  // Use configured API base URL so dev server and production call the correct backend
  const url = `${API_BASE_URL}/reports/appointments` + (params.toString() ? `?${params.toString()}` : '');
  const res = await fetch(url);
        const analytics = await res.json();
        if (analytics == null || analytics.message) {
          // fall back to local sample if server returns no data
          setReportData(generateAppointmentReport());
        } else {
          const mapped = mapAppointmentAnalyticsToReportData(analytics);
          setReportData(mapped);
        }
      } catch (err) {
        // network error or CORS — fall back to sample
        console.error('Failed to fetch appointment analytics', err);
        setReportData(generateAppointmentReport());
      } finally {
        setLoading(false);
      }
      return;
    }

    // If customers, fetch from backend employee customers endpoint
    if (reportType === 'customers') {
      try {
        const url = `${API_BASE_URL}/employee/customers`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch customers');
        const customers = await res.json();
        // Map to reportData shape
        const totalCustomers = Array.isArray(customers) ? customers.length : 0;
        const totalVehicles = Array.isArray(customers) ? customers.reduce((sum, c) => sum + (c.vehicleCount || 0), 0) : 0;
        const rows = Array.isArray(customers) ? customers.map(c => ({
          id: c.id,
          name: c.name || c.username,
          email: c.email,
          phone: c.phone,
          totalBookings: c.totalBookings || 0,
          vehicleCount: c.vehicleCount || 0
        })) : [];

        const chartData = {
          labels: rows.map(r => r.name),
          datasets: [
            {
              label: 'Total Bookings',
              data: rows.map(r => r.totalBookings),
              backgroundColor: 'rgba(122, 133, 193, 0.6)'
            },
            {
              label: 'Vehicles',
              data: rows.map(r => r.vehicleCount),
              backgroundColor: 'rgba(34, 197, 94, 0.6)'
            }
          ]
        };

        setReportData({
          summary: { totalCustomers, totalVehicles },
          chartData,
          chartType: 'bar',
          rows
        });
      } catch (err) {
        console.error('Failed to fetch customers report', err);
        setReportData(generateCustomerReport());
      } finally {
        setLoading(false);
      }
      return;
    }
    // If employees, fetch server employee performance analytics
    if (reportType === 'employees') {
      try {
        const url = `${API_BASE_URL}/reports/employees`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch employees');
        const analytics = await res.json();
        if (analytics == null || analytics.message) {
          setReportData(generateEmployeeReport());
        } else {
          const employees = Array.isArray(analytics.employees) ? analytics.employees : [];
          const totalEmployees = analytics.totalEmployees != null ? analytics.totalEmployees : employees.length;
          const rows = employees.map(e => ({
            id: e.id,
            name: e.name,
            appointmentsCount: e.appointmentsCount || 0
          }));

          const chartData = {
            labels: rows.map(r => r.name),
            datasets: [{
              label: 'Appointments Handled',
              data: rows.map(r => r.appointmentsCount),
              backgroundColor: 'rgba(122, 133, 193, 0.8)'
            }]
          };

          setReportData({
            summary: { totalEmployees, totalAppointments: rows.reduce((s, r) => s + r.appointmentsCount, 0) },
            chartData,
            chartType: 'bar',
            rows
          });
        }
      } catch (err) {
        console.error('Failed to fetch employees report', err);
        setReportData(generateEmployeeReport());
      } finally {
        setLoading(false);
      }
      return;
    }
    // If financial, attempt to fetch admin overview and revenue by service
    if (reportType === 'financial') {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [overviewRes, revenueRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/analytics/overview`, { headers }),
          fetch(`${API_BASE_URL}/admin/analytics/revenue/by-service`, { headers })
        ]);

        if (!overviewRes.ok || !revenueRes.ok) throw new Error('Failed to fetch financial analytics');

        const overview = await overviewRes.json();
        const revenueList = await revenueRes.json();

        // Map to reportData
        const totalRevenue = overview.totalRevenue || 0;
        const totalAppointments = overview.totalAppointments || 0;

        const chartData = {
          labels: revenueList.map(r => r.service),
          datasets: [{
            label: 'Revenue by Service',
            data: revenueList.map(r => r.revenue),
            backgroundColor: 'rgba(122, 133, 193, 0.8)'
          }]
        };

        setReportData({
          summary: { totalRevenue, totalAppointments },
          chartData,
          chartType: 'bar',
          rows: revenueList.map(r => ({ service: r.service, revenue: r.revenue }))
        });
      } catch (err) {
        console.error('Failed to fetch financial report', err);
        setReportData(generateFinancialReport());
      } finally {
        setLoading(false);
      }
      return;
    }

    // If feedbacks, attempt to fetch admin feedback rating analytics
    if (reportType === 'feedbacks') {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE_URL}/admin/analytics/feedback-rating`, { headers });
        if (!res.ok) throw new Error('Failed to fetch feedback analytics');
        const ratingData = await res.json();

        // ratingData expected shape: { distribution: { '5': n, '4': n, ... }, total: n, average: x }
        const distribution = ratingData.distribution || {};
        const totalFeedbacks = ratingData.total || Object.values(distribution).reduce((s, v) => s + v, 0);
        const avg = ratingData.average || Object.entries(distribution).reduce((s, [star, cnt]) => s + Number(star) * cnt, 0) / Math.max(totalFeedbacks, 1);

        const chartData = {
          labels: ['5★', '4★', '3★', '2★', '1★'],
          datasets: [{
            label: 'Feedbacks',
            data: [distribution['5'] || 0, distribution['4'] || 0, distribution['3'] || 0, distribution['2'] || 0, distribution['1'] || 0],
            backgroundColor: ['rgba(34,197,94,0.8)','rgba(132,204,22,0.8)','rgba(251,191,36,0.8)','rgba(249,115,22,0.8)','rgba(239,68,68,0.8)']
          }]
        };

        setReportData({
          summary: { totalFeedbacks, averageRating: `${avg.toFixed(2)} / 5` },
          chartData,
          chartType: 'doughnut'
        });
      } catch (err) {
        console.error('Failed to fetch feedback report', err);
        setReportData(generateFeedbackReport());
      } finally {
        setLoading(false);
      }
      return;
    }
    // Non-appointments: keep existing local sample generators
    setTimeout(() => {
      let data;
      switch (reportType) {
        case 'customers':
          data = generateCustomerReport();
          break;
        case 'employees':
          data = generateEmployeeReport();
          break;
        case 'financial':
          data = generateFinancialReport();
          break;
        case 'feedbacks':
          data = generateFeedbackReport();
          break;
        default:
          data = generateAppointmentReport();
      }
      setReportData(data);
      setLoading(false);
    }, 300);
  };

  // Map backend analytics (server) to the shape used by this component
  const mapAppointmentAnalyticsToReportData = (analytics) => {
    const totalAppointments = analytics.totalAppointments || 0;
    const statusCounts = analytics.statusCounts || {};
    const totalCompleted = statusCounts['COMPLETED'] || statusCounts['Completed'] || 0;
    const totalCancelled = statusCounts['CANCELLED'] || statusCounts['Cancelled'] || 0;
    const completionRate = totalAppointments > 0 ? ((totalCompleted / totalAppointments) * 100).toFixed(1) : '0.0';

    // dailyCounts may be an object: {date: count}
    const dailyCountsObj = analytics.dailyCounts || {};
    const labels = Object.keys(dailyCountsObj).sort();
    const totalSeries = labels.map(d => dailyCountsObj[d]);

    // compute completed per day from rows if available
    const rows = analytics.rows || [];
    const completedByDay = {};
    rows.forEach(r => {
      const date = r.date ? String(r.date) : null;
      const status = r.status ? String(r.status) : '';
      if (!date) return;
      if (!completedByDay[date]) completedByDay[date] = 0;
      if (status.toUpperCase() === 'COMPLETED') completedByDay[date]++;
    });
    const completedSeries = labels.map(d => completedByDay[d] || 0);

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Total Appointments',
          data: totalSeries,
          backgroundColor: 'rgba(122, 133, 193, 0.6)',
          borderColor: 'rgba(122, 133, 193, 1)',
          borderWidth: 1,
        },
        {
          label: 'Completed',
          data: completedSeries,
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
        },
      ],
    };

    return {
      summary: {
        totalAppointments,
        totalCompleted,
        totalCancelled,
        completionRate: `${completionRate}%`,
        totalRevenue: analytics.totalRevenue || 0,
      },
      chartData,
      chartType: 'bar',
      // keep raw rows for detailed table if needed
      rows: rows,
    };
  };

  // Normalize any reportData into a consistent UI shape: { summary: [{label, value}], table: { columns: [], rows: [] }, chartData }
  const normalizeReportData = (data, type) => {
    if (!data) return { summary: [], table: { columns: [], rows: [] }, chartData: null };

    const summaryEntries = Object.entries(data.summary || {}).map(([k, v]) => ({
      label: k.replace(/([A-Z])/g, ' $1').trim(),
      value: v,
    }));

    // Prefer explicit rows if provided (arrays of objects)
    if (Array.isArray(data.rows) && data.rows.length > 0) {
      const cols = Object.keys(data.rows[0]);
      const rows = data.rows.map(r => cols.map(c => r[c]));
      return { summary: summaryEntries, table: { columns: cols, rows }, chartData: data.chartData || data.chartData };
    }

    // Fallback: derive table from chartData (datasets x labels)
    if (data.chartData && Array.isArray(data.chartData.labels)) {
      const cols = ['Series', ...data.chartData.labels];
      const rows = (data.chartData.datasets || []).map(ds => [ds.label || 'Series', ...(ds.data || [])]);
      return { summary: summaryEntries, table: { columns: cols, rows }, chartData: data.chartData };
    }

    // Last resort: empty table
    return { summary: summaryEntries, table: { columns: [], rows: [] }, chartData: data.chartData || null };
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

  const generateFeedbackReport = () => {
    // Sample distribution by star rating
    const ratingDistribution = { 5: 42, 4: 28, 3: 16, 2: 7, 1: 3 };

    const totalFeedbacks = Object.values(ratingDistribution).reduce((s, v) => s + v, 0);
    const average =
      Object.entries(ratingDistribution).reduce((s, [star, cnt]) => s + Number(star) * cnt, 0) / totalFeedbacks;

    return {
      summary: {
        totalFeedbacks,
        averageRating: `${average.toFixed(2)} / 5`,
        satisfactionRate: `${(((ratingDistribution[5] + ratingDistribution[4]) / totalFeedbacks) * 100).toFixed(1)}%`,
      },
      chartData: {
        labels: ['5★', '4★', '3★', '2★', '1★'],
        datasets: [
          {
            label: 'Feedbacks',
            data: [
              ratingDistribution[5],
              ratingDistribution[4],
              ratingDistribution[3],
              ratingDistribution[2],
              ratingDistribution[1],
            ],
            backgroundColor: [
              'rgba(34,197,94,0.8)',
              'rgba(132,204,22,0.8)',
              'rgba(251,191,36,0.8)',
              'rgba(249,115,22,0.8)',
              'rgba(239,68,68,0.8)',
            ],
            borderColor: [
              'rgba(34,197,94,1)',
              'rgba(132,204,22,1)',
              'rgba(251,191,36,1)',
              'rgba(249,115,22,1)',
              'rgba(239,68,68,1)',
            ],
            borderWidth: 2,
          },
        ],
      },
      chartType: 'doughnut',
    };
  };

  const exportReportPdf = () => {
    if (!reportData) return;

    // If appointments report, prefer server-generated PDF (attachment)
    if (reportType === 'appointments') {
      // open in new tab to trigger download
      window.open('/api/reports/appointments/pdf', '_blank');
      return;
    }

    // client-side PDF generation for other report types (existing behaviour)
    const doc = new jsPDF();
    const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    // Add summary as key: value pairs
    const summaryEntries = Object.entries(reportData.summary || {}).map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1')}: ${v}`);
    doc.setFontSize(10);
    summaryEntries.forEach((line, i) => {
      doc.text(line, 14, 28 + i * 6);
    });

    // Prepare table data: first column = series label, remaining columns = values for each label
    const labels = (reportData.chartData && reportData.chartData.labels) || [];
    const datasets = (reportData.chartData && reportData.chartData.datasets) || [];

    const head = [['Series', ...labels]];
    const body = datasets.map(ds => [ds.label || 'Series', ...((ds.data || []).map(v => String(v)))]);

    // Start table below the summary
    const startY = 28 + summaryEntries.length * 6 + 6;

    // Use autoTable to render the table; fall back to manual rendering if unavailable
    if (typeof autoTable === 'function') {
      autoTable(doc, {
        head,
        body,
        startY,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [122, 133, 193] },
      });
    } else if (typeof doc.autoTable === 'function') {
      // older integration
      // eslint-disable-next-line no-undef
      doc.autoTable({ head, body, startY, styles: { fontSize: 9 }, headStyles: { fillColor: [122, 133, 193] } });
    } else {
      // simple fallback: render table as lines of text
      let y = startY;
      const lineHeight = 6;
      // header
      doc.setFontSize(9);
      doc.text(head[0].join(' | '), 14, y);
      y += lineHeight;
      body.forEach(row => {
        doc.text(row.join(' | '), 14, y);
        y += lineHeight;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  const exportReport = (format) => {
    if (format === 'pdf') return exportReportPdf();
    if (format === 'csv') {
      // If appointments, prefer server CSV endpoint
      if (reportType === 'appointments') {
        window.open('/api/reports/appointments/csv', '_blank');
        return;
      }

      // simple client-side CSV export of the same table
      if (!reportData) return;
      const labels = (reportData.chartData && reportData.chartData.labels) || [];
      const datasets = (reportData.chartData && reportData.chartData.datasets) || [];
      const rows = [];
      const header = ['Series', ...labels];
      rows.push(header.join(','));
      datasets.forEach(ds => {
        const row = [ds.label || 'Series', ...(ds.data || [])];
        rows.push(row.join(','));
      });
      const csv = rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const renderChart = () => {
    if (!reportData) return null;
    const chartDataParam = reportData.chartData;
    if (!chartDataParam) return null;

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
    switch ((reportData.chartType) || (chartDataParam.type)) {
      case 'bar':
        return <Bar data={chartDataParam} options={options} />;
      case 'line':
        return <Line data={chartDataParam} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartDataParam} options={options} />;
      default:
        return <Bar data={chartDataParam} options={options} />;
    }
  };

  // compute normalized view once per render
  const normalized = reportData ? normalizeReportData(reportData, reportType) : null;

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
              <option value="feedbacks">Feedback Report</option>
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
              disabled={!isStatusApplicable(reportType)}
              title={!isStatusApplicable(reportType) ? 'Status filter applies only to Appointments' : 'Filter by appointment status'}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A85C1] ${!isStatusApplicable(reportType) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
            {!isStatusApplicable(reportType) && (
              <div className="text-xs text-gray-500 mt-1">Status filter is only applicable to the Appointments report.</div>
            )}
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
      {normalized && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {normalized.summary.map(s => (
            <div key={s.label} className="bg-white p-4 rounded-lg shadow-md border">
              <div className="text-sm text-gray-500">{s.label}</div>
              <div className="text-2xl font-bold text-black mt-1">{s.value}</div>
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
        ) : normalized ? (
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
                      {normalized.table.columns.map((col, ci) => (
                        <th key={ci} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {String(col).replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {normalized.table.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((cell, ci) => (
                          <td key={ci} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
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
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ServicePopularityChart = ({ data, title = "Most Popular Services" }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-700">{`Service: ${label}`}</p>
          <p className="text-sm text-blue-600">{`Appointments: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Truncate long service names for better display
  const truncateText = (text, maxLength = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const processedData = data.map(item => ({
    ...item,
    displayService: truncateText(item.service)
  }));

  return (
    <div className="bg-white rounded-lg shadow-md border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="displayService" 
              className="text-sm text-gray-600"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServicePopularityChart;
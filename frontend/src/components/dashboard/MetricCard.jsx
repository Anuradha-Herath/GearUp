import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend = null, 
  trendValue = null, 
  color = 'blue',
  prefix = '',
  suffix = ''
}) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'orange':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'red':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    if (trend === 'neutral') return <Minus className="w-4 h-4 text-gray-500" />;
    return null;
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">
              {prefix}{formatValue(value)}{suffix}
            </p>
            
            {(trend || trendValue) && (
              <div className="flex items-center mt-2">
                {getTrendIcon()}
                {trendValue && (
                  <span className={`text-sm font-medium ml-1 ${
                    trend === 'up' ? 'text-green-500' : 
                    trend === 'down' ? 'text-red-500' : 
                    'text-gray-500'
                  }`}>
                    {trendValue}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {Icon && (
            <div className={`p-3 rounded-lg border-2 ${getColorClasses(color)}`}>
              <Icon className="w-8 h-8" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
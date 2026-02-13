import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await api.getInsights();
      setInsights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pattern Insights</h2>
        <button
          onClick={fetchInsights}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-500 text-white rounded-full p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Recent Trends</h3>
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {insights.recentOutages}
          </div>
          <p className="text-gray-600">Outages in the last 7 days</p>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              {insights.recentOutages > 10 
                ? '⚠️ Higher than usual activity detected'
                : insights.recentOutages > 5
                ? '📊 Moderate activity levels'
                : '✅ Lower than average activity'}
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-500 text-white rounded-full p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Most Reliable</h3>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-2">
            {insights.mostReliableService}
          </div>
          <p className="text-gray-600">
            Only {insights.mostReliableCount} {insights.mostReliableCount === 1 ? 'outage' : 'outages'} recorded
          </p>
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">
              🏆 Best performing service in your area
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-500 text-white rounded-full p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Peak Outage Time</h3>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {formatHour(insights.peakOutageHour)}
          </div>
          <p className="text-gray-600">Most outages occur around this time</p>
          <div className="mt-4 p-3 bg-orange-100 rounded-lg">
            <p className="text-sm text-orange-800">
              ⏰ Plan ahead during peak hours
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-500 text-white rounded-full p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Confidence Levels</h3>
          </div>
          <div className="space-y-3">
            {insights.confidenceLevels.map((level) => (
              <div key={level._id} className="flex items-center justify-between">
                <span className="capitalize font-medium text-gray-700">{level._id}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(level.count / insights.confidenceLevels.reduce((sum, l) => sum + l.count, 0)) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 w-8">{level.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Key Takeaways</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Community confirmation helps verify outage reports</li>
          <li>• Time patterns can help predict potential service disruptions</li>
          <li>• Reliable services maintain consistent performance over time</li>
        </ul>
      </div>
    </div>
  );
}

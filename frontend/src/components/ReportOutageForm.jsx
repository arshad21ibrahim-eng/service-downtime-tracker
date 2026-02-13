import React, { useState } from 'react';
import { api } from '../lib/api';

const SERVICE_TYPES = [
  "Electricity",
  "Water",
  "Internet",
  "Gas",
  "Transportation",
  "Healthcare",
  "Sanitation",
  "Emergency Services"
];

export default function ReportOutageForm({ onOutageReported }) {
  const [service, setService] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!service || !area.trim()) {
      setError('Please select a service and enter an area');
      return;
    }

    setLoading(true);

    try {
      const result = await api.reportOutage(service, area.trim());
      
      if (result.isDuplicate) {
        setSuccess(`Outage confirmed! (${result.outage.confirmCount} confirmations - ${result.outage.confidenceLevel})`);
      } else {
        setSuccess('Outage reported successfully!');
      }
      
      setService('');
      setArea('');
      
      if (onOutageReported) {
        onOutageReported();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-red-100 text-red-600 rounded-full p-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Report Service Outage</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type *
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a service...</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Affected Area *
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., Downtown, West District, Main Street"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter the neighborhood, district, or street name affected
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Reporting...' : 'Report Outage'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> If others have already reported this outage, your report will increase the confirmation count and confidence level.
        </p>
      </div>
    </div>
  );
}

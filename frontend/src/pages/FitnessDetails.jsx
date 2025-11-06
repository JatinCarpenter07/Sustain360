import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const PIE_COLORS = ['#16a34a', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6'];

const FitnessDetails = () => {
  const { token } = useAuth();

  const [data, setData] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🕒 Auto set default dates on first render
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStart('2001-01-01');
    setEnd(today);
  }, []);

  const dateError = useMemo(() => {
    if (!start || !end) return '';
    if (start > end) return 'Start date must be before or equal to end date.';
    return '';
  }, [start, end]);

  const fetchData = async () => {
    if (!start || !end || dateError) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/fitness/getFitness`, {
        params: { start, end },
        withCredentials: true,
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch fitness data');
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Automatically fetch data after default dates are set
  useEffect(() => {
    if (start && end) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  const profile = data?.profile || {};
  const pfi = Number(data?.personalFitnessIndex || 0);
  const scores = data?.scores || {};
  const insights = data?.insights || {};
  const actuals = data?.actuals || {};
  const ideals = data?.ideals || {};

  const barData = [
    { key: 'avgCarbon', label: 'Carbon (kg CO₂/day)', actual: Number(actuals?.avgCarbon ?? 0), ideal: Number(ideals?.carbon ?? 0) },
    { key: 'avgWater', label: 'Water (L/day)', actual: Number(actuals?.avgWater ?? 0), ideal: Number(ideals?.water ?? 0) },
    { key: 'avgSteps', label: 'Steps (per day)', actual: Number(actuals?.avgSteps ?? 0), ideal: Number(ideals?.steps ?? 0) },
    { key: 'avgCalories', label: 'Calories (per day)', actual: Number(actuals?.avgCalories ?? 0), ideal: Number(ideals?.calories ?? 0) },
    { key: 'avgSleep', label: 'Sleep (hours/day)', actual: Number(actuals?.avgSleep ?? 0), ideal: Number(ideals?.sleep ?? 0) },
    { key: 'avgIntake', label: 'Water Intake (L/day)', actual: Number(actuals?.avgIntake ?? 0), ideal: Number(ideals?.waterIntake ?? 0) },
    { key: 'avgWellnessScore', label: 'Wellness Score (0-100)', actual: Number(actuals?.avgWellnessScore ?? 0), ideal: 100 },
    { key: 'avgSavingsRate', label: 'Savings Rate (%)', actual: Number(actuals?.avgSavingsRate ?? 0), ideal: Number(ideals?.savingsRate ?? 0) },
  ];

  const pieData = Object.entries(scores).map(([k, v]) => ({ name: k, value: Number(v) }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Personal Fitness</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={fetchData}
            disabled={!start || !end || !!dateError || loading}
            className="inline-flex items-center px-4 py-2 rounded-md bg-green-600 text-white disabled:opacity-50 hover:bg-green-700"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>
        {dateError && (
          <div className="text-red-600 text-sm mt-2">{dateError}</div>
        )}
        {error && (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 mt-3">{error}</div>
        )}
      </div>

      {/* Content */}
      {loading && !data && (
        <div className="text-gray-600 text-center py-10">
          Fetching your fitness data for today... ⏳
        </div>
      )}

      {data && !loading && (
        <div className="space-y-6">
          {/* Profile and PFI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
              <h2 className="text-lg font-semibold mb-3">Profile</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Age</div>
                  <div className="font-medium">{profile?.age ?? '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Height (cm)</div>
                  <div className="font-medium">{profile?.height ?? '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Weight (kg)</div>
                  <div className="font-medium">{profile?.weight ?? '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">BMI</div>
                  <div className="font-medium">{profile?.bmi ?? '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Gender</div>
                  <div className="font-medium capitalize">{profile?.gender || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Blood Group</div>
                  <div className="font-medium">{profile?.bloodGroup || '-'}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Personal Fitness Index</h2>
              <div className="text-4xl font-bold text-gray-900 mb-3">{Math.round(pfi)}</div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-green-600"
                  style={{ width: `${Math.max(0, Math.min(100, pfi))}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">0 - 100</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-md font-semibold mb-2">Actual vs Ideal Averages</h3>
              <div className="text-xs text-gray-500 mb-2">Selected period averages vs recommended targets</div>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <ReTooltip />
                    <Legend />
                    <Bar dataKey="actual" name="Actual Avg" fill="#0ea5e9" isAnimationActive={true} />
                    <Bar dataKey="ideal" name="Ideal" fill="#16a34a" isAnimationActive={true} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h3 className="text-md font-semibold mb-2">Category Distribution (Pie)</h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                      isAnimationActive={true}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-semibold mb-3">Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {Object.entries(insights).length === 0 && (
                <div className="text-gray-500">No insights available for the selected period.</div>
              )}
              {Object.entries(insights).map(([key, value]) => (
                <div key={key} className="border rounded-md p-3">
                  <div className="text-gray-500 capitalize">{key}</div>
                  <div className="mt-1 text-gray-900">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessDetails;

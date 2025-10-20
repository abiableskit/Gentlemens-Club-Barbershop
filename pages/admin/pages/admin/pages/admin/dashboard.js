// pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Chart from 'chart.js/auto';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    setLoading(true);
    const res = await fetch('/api/admin/stats', {
      headers: {
        'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '' // will be undefined client-side; we will set ADMIN header from server in production
      }
    });
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    } else {
      const err = await res.json().catch(() => ({}));
      console.error('stats load failed', err);
      setStats({ error: 'Failed to load stats (check ADMIN_SECRET header strategy).' });
    }
    setLoading(false);
  }

  useEffect(() => {
    // For local dev: you can call /api/admin/stats with a query param ?test=true and bypass header check if you adjust server code.
    loadStats();
  }, []);

  return (
    <AdminLayout>
      {loading && <p>Loading stats...</p>}
      {stats && stats.error && <p className="text-red-600">{stats.error}</p>}

      {stats && !stats.error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-sm font-medium">Total Visits</h3>
            <p className="text-2xl mt-2">{stats.visitsTotal}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-sm font-medium">Bookings</h3>
            <p className="text-2xl mt-2">{stats.bookingsTotal}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-sm font-medium">Inquiries</h3>
            <p className="text-2xl mt-2">{stats.inquiriesTotal}</p>
          </div>
        </div>
      )}

      {stats && !stats.error && (
        <section className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-medium">Last 30 days summary</h3>
          <div className="mt-3">
            <p>Unique visitors (30d): <strong>{stats.uniqueVisitors30}</strong></p>
            <p>Bookings (30d): <strong>{stats.bookingsLast30}</strong></p>
            <p>Conversion rate: <strong>{stats.conversionRate}%</strong></p>
          </div>
        </section>
      )}
    </AdminLayout>
  );
}

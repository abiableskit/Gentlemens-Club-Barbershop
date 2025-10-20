// pages/api/admin/stats.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

export default async function handler(req, res) {
  // Basic protection: require ADMIN_SECRET header
  const headerSecret = req.headers['x-admin-secret'] || '';
  if (!ADMIN_SECRET || headerSecret !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // Total counts
    const visitsCountResp = await sb.from('visits').select('id', { count: 'exact' });
    const bookingsCountResp = await sb.from('bookings').select('id', { count: 'exact' });
    const inquiriesCountResp = await sb.from('inquiries').select('id', { count: 'exact' });

    const visitsTotal = visitsCountResp.count ?? 0;
    const bookingsTotal = bookingsCountResp.count ?? 0;
    const inquiriesTotal = inquiriesCountResp.count ?? 0;

    // Unique visitors last 30 days
    const { data: uniqueVisitorsData, error: uvErr } = await sb.rpc('count_unique_visitors', { days: 30 }).limit(1);
    // If RPC not defined, fallback to raw query:
    const { data: uvFallback } = await sb
      .from('visits')
      .select('session_id', { count: 'exact', head: true })
      .gt('created_at', 'now()::timestamptz - interval \'30 days\'');

    // Last 30 days counts (bookings & unique visitors) — use SQL directly for accuracy
    const { data: bookings30 } = await sb.rpc('count_bookings_period', { days: 30 }).limit(1).catch(() => ({ data: null }));
    // Fallback simple queries:
    const { count: bookings30Count } = await sb
      .from('bookings')
      .select('id', { count: 'exact' })
      .gt('created_at', 'now()::timestamptz - interval \'30 days\'');

    // Unique visitors last 30 days via SQL:
    const { data: uvRaw, error: uvRawErr } = await sb.rpc('unique_visitors_last_n_days', { days: 30 }).catch(() => ({ data: null }));

    // For simplicity, if RPCs not present, run SQL-like queries via select and then compute
    // (Note: large tables should use SQL aggregate queries in production.)

    // Get bookings last 30 days count
    const { data: bookings30Data, count: b30 } = await sb
      .from('bookings')
      .select('id', { count: 'exact' })
      .gt('created_at', 'now()::timestamptz - interval \'30 days\'');

    // Unique visitors last 30 days via distinct session_id
    const { data: uvData, error: uvDataErr } = await sb
      .from('visits')
      .select('session_id', { count: 'exact' })
      .gt('created_at', 'now()::timestamptz - interval \'30 days\'');

    const uniqueVisitors30 = uvData?.length ?? uvData?.count ?? 0;
    const bookingsLast30 = b30 ?? 0;

    const conversionRate = uniqueVisitors30 === 0 ? 0 : +(bookingsLast30 / uniqueVisitors30 * 100).toFixed(2);

    return res.status(200).json({
      visitsTotal,
      bookingsTotal,
      inquiriesTotal,
      uniqueVisitors30,
      bookingsLast30,
      conversionRate
    });
  } catch (err) {
    console.error('admin stats error', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

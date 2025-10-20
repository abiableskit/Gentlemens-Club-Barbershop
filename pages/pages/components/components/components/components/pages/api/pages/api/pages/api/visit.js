// pages/api/visit.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, path, user_agent } = req.body || {};
  // ip info from serverless headers may be available; we store as-is (consider hashing for privacy)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

  try {
    await sb.from('visits').insert([{ session_id, ip, path, user_agent }]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('visit insert error', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

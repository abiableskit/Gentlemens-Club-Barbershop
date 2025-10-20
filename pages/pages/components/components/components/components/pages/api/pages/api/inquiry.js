// pages/api/inquiry.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const { data, error } = await sb
      .from('inquiries')
      .insert([{ name, email, phone, message }])
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ ok: true, inquiry: data });
  } catch (err) {
    console.error('inquiry error', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

// pages/api/book.js
import { createClient } from '@supabase/supabase-js';
import sendBookingEmail from '../../utils/sendEmail';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(SUPABASE_URL, SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { user_name, email, phone, service, preferred_date, notes } = req.body;

  if (!user_name || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await sb
      .from('bookings')
      .insert([{ user_name, email, phone, service, preferred_date, notes }])
      .select()
      .single();

    if (error) throw error;

    // Optional: send confirmation email to client (non-blocking)
    if (email) {
      try {
        await sendBookingEmail({
          to: email,
          name: user_name,
          service,
          preferred_date
        });
      } catch (errEmail) {
        console.warn('send email failed', errEmail);
      }
    }

    return res.status(200).json({ ok: true, booking: data });
  } catch (err) {
    console.error('book error', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

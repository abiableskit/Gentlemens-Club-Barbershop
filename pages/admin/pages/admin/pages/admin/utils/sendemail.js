// utils/sendEmail.js
// Simple SendGrid example for booking confirmations
import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY);

export default async function sendBookingEmail({ to, name, service, preferred_date }) {
  if (!SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not configured — skipping email');
    return;
  }

  const msg = {
    to,
    from: 'no-reply@bleskitcuts.example.com',
    subject: 'Bleskit Cuts — Booking Received',
    text: `Hi ${name || ''}, we received your booking for ${service} on ${preferred_date || 'your chosen date'}. We'll confirm shortly.`,
    html: `<p>Hi ${name || ''},</p><p>We received your booking for <strong>${service}</strong> on <strong>${preferred_date || 'your chosen date'}</strong>. We'll confirm it soon.</p><p>— Bleskit Cuts</p>`
  };

  return sgMail.send(msg);
}

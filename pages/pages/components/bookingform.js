// components/BookingForm.js
import { useState } from 'react';

export default function BookingForm() {
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    // preferred_date may need formatting on client
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Network response not ok');
      setStatus('sent');
      e.target.reset();
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block text-sm">Full name</label>
        <input name="user_name" required className="w-full border p-2 rounded" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Email</label>
          <input name="email" type="email" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Phone</label>
          <input name="phone" className="w-full border p-2 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm">Service</label>
        <select name="service" required className="w-full border p-2 rounded">
          <option>Haircut</option>
          <option>Beard Trim</option>
          <option>Kids Cut</option>
        </select>
      </div>

      <div>
        <label className="block text-sm">Preferred date & time</label>
        <input name="preferred_date" type="datetime-local" className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm">Notes (optional)</label>
        <textarea name="notes" rows="3" className="w-full border p-2 rounded" />
      </div>

      <div>
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
          {status === 'sending' ? 'Sending...' : 'Request Booking'}
        </button>
      </div>

      {status === 'sent' && <p className="text-green-600">Thanks — we received your booking request.</p>}
      {status === 'error' && <p className="text-red-600">An error occurred. Please try again.</p>}
    </form>
  );
}

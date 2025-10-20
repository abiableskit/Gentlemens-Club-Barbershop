// pages/admin/login.js
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Router from 'next/router';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);

  async function handle(e) {
    e.preventDefault();
    setMsg('Signing in...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // verify role
      const uid = data.user?.id;
      const { data: profile, error: pErr } = await supabase.from('profiles').select('role').eq('id', uid).single();
      if (pErr || !profile) {
        setMsg('Unable to verify profile. Contact admin.');
        return;
      }
      if (profile.role !== 'admin') {
        setMsg('Account is not an admin.');
        await supabase.auth.signOut();
        return;
      }

      // success
      Router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setMsg(err.message || 'Sign in failed');
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Admin Sign In</h1>
      <form onSubmit={handle} className="space-y-4">
        <input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-black text-white rounded">Sign In</button>
        {msg && <p className="mt-2">{msg}</p>}
      </form>
    </main>
  );
}

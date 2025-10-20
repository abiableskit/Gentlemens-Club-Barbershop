// pages/_app.js
import '../styles/globals.css';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function MyApp({ Component, pageProps }) {
  // Simple visit recording client-side hook (sends one visit per browser session)
  useEffect(() => {
    try {
      const existing = localStorage.getItem('gentlemans_session_id');
      const session_id = existing || crypto.randomUUID();
      if (!existing) localStorage.setItem('gentlemans_session_id', session_id);

      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id,
          path: window.location.pathname,
          user_agent: navigator.userAgent
        })
      });
    } catch (e) {
      // ignore in environments where crypto isn't available
      console.warn('visit tracking skipped', e);
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;

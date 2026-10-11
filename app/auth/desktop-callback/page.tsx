'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DesktopCallbackPage() {
  const [status, setStatus] = useState<string>('Connecting with Crystal Central...');
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function processAuth() {
      const supabase = createClient();

      // 1. Try URL Hash (implicit flow)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      let accessToken = hashParams.get('access_token');
      let refreshToken = hashParams.get('refresh_token');

      // 2. Try URL Search Params
      const searchParams = new URLSearchParams(window.location.search);
      if (!accessToken) {
        accessToken = searchParams.get('access_token');
        refreshToken = searchParams.get('refresh_token');
      }

      // 3. Try Supabase Client session
      if (!accessToken) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            accessToken = session.access_token;
            refreshToken = session.refresh_token;
            if (session.user?.email) setUserEmail(session.user.email);
          }
        } catch (e) {
          console.error('Failed to get session from supabase:', e);
        }
      }

      if (accessToken) {
        setStatus('Sign in successful! Opening Crystal Central...');

        let targetUrl = `crystalcentral://auth?access_token=${encodeURIComponent(accessToken)}`;
        if (refreshToken) targetUrl += `&refresh_token=${encodeURIComponent(refreshToken)}`;
        if (userEmail) targetUrl += `&email=${encodeURIComponent(userEmail)}`;

        setDeepLink(targetUrl);

        // Attempt automatic redirect
        try {
          window.location.href = targetUrl;
        } catch (err) {
          console.error('Redirect failed:', err);
        }

        // Auto close after 4 seconds
        setTimeout(() => {
          window.close();
        }, 4000);
      } else {
        // Listen once to auth state change if session is being processed
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.access_token) {
            const token = session.access_token;
            const rToken = session.refresh_token;
            const email = session.user?.email || '';
            setStatus('Sign in successful! Opening Crystal Central...');
            const target = `crystalcentral://auth?access_token=${encodeURIComponent(token)}${
              rToken ? `&refresh_token=${encodeURIComponent(rToken)}` : ''
            }${email ? `&email=${encodeURIComponent(email)}` : ''}`;
            setDeepLink(target);
            window.location.href = target;
          }
        });

        // If after 3 seconds still no token:
        setTimeout(() => {
          setStatus('Authentication complete. Please click the button below to return to Crystal Central.');
        }, 3000);

        return () => {
          subscription.unsubscribe();
        };
      }
    }

    processAuth();
  }, [userEmail]);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#090d16',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '40px 28px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ fontSize: '42px', marginBottom: '16px' }}>💎</div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#38bdf8',
            margin: '0 0 14px 0',
            letterSpacing: '-0.5px',
          }}
        >
          Crystal Central
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#cbd5e1',
            margin: '0 0 24px 0',
            lineHeight: 1.5,
          }}
        >
          {status}
        </p>

        {deepLink && (
          <a
            href={deepLink}
            style={{
              display: 'inline-block',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              marginBottom: '20px',
              boxShadow: '0 4px 14px 0 rgba(2, 132, 199, 0.4)',
            }}
          >
            Open in Crystal Central App
          </a>
        )}

        <p
          style={{
            fontSize: '12px',
            color: '#64748b',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          You can safely close this browser window once the app is open.
        </p>
      </div>
    </main>
  );
}

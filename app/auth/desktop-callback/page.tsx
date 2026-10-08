'use client';

import { useEffect, useState } from 'react';

export default function DesktopCallbackPage() {
  const [status, setStatus] = useState('Authenticating with Crystal Central...');

  useEffect(() => {
    // ดึง access_token จาก URL Hash ที่ Supabase ส่งกลับมา
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      setStatus('Sign in successful! Opening Crystal Central app...');
      
      // ส่ง Token กลับเข้าแอปผ่าน Custom URL Scheme
      window.location.href = `crystalcentral://auth?access_token=${accessToken}&refresh_token=${refreshToken}`;
      
      // ปิดแท็บอัตโนมัติหลังผ่านไป 3 วินาที
      setTimeout(() => {
        window.close();
      }, 3000);
    } else {
      setStatus('Authentication failed. No access token found.');
    }
  }, []);

  return (
    <div style={{ background: '#151821', color: '#fff', fontFamily: 'sans-serif', textAlign: 'center', padding: '80px' }}>
      <h2 style={{ color: '#38bdf8' }}>Crystal Central</h2>
      <p>{status}</p>
      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '20px' }}>You can close this window if it doesn't close automatically.</p>
    </div>
  );
}
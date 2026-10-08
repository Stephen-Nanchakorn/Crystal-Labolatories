'use client';

import { useEffect, useState } from 'react';

export default function DesktopCallbackPage() {
  const [status, setStatus] = useState('Authenticating with Crystal Central...');

  useEffect(() => {
    // 1. ดึง Token จาก URL Hash ที่ Supabase ส่งมา
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      setStatus('Sign in successful! Opening Crystal Central app...');

      // 2. ส่ง Deep Link ไปเปิดแอป Crystal Central ทันที
      const deepLinkUrl = `crystalcentral://auth?access_token=${accessToken}${
        refreshToken ? `&refresh_token=${refreshToken}` : ''
      }`;
      window.location.href = deepLinkUrl;

      // 3. ปิดแท็บอัตโนมัติเมื่อส่งข้อมูลเสร็จ
      setTimeout(() => {
        window.close();
      }, 3000);
    } else {
      setStatus('Authentication failed. No access token found.');
    }
  }, []);

  return (
    <>
      {/* สไตล์ครอบคลุมเพื่อซ่อน Button หรือองค์ประกอบแปลกปลอมในหน้านี้โดยเฉพาะ */}
      <style jsx global>{`
        /* ซ่อนปุ่มทั้งหมดเฉพาะในหน้านี้ */
        button,
        .btn,
        [role="button"] {
          display: none !important;
        }
      `}</style>

      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#151821',
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
        <div style={{ maxWidth: '480px', width: '100%' }}>
          {/* Header */}
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#38bdf8',
              margin: '0 0 16px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Crystal Central
          </h1>

          {/* สถานะ */}
          <p
            style={{
              fontSize: '16px',
              color: '#e2e8f0',
              margin: '0 0 12px 0',
              lineHeight: 1.5,
            }}
          >
            {status}
          </p>

          {/* ข้อความปิดหน้าต่าง */}
          <p
            style={{
              fontSize: '13px',
              color: '#94a3b8',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            You can close this window if it doesn&apos;t close automatically.
          </p>
        </div>
      </main>
    </>
  );
}
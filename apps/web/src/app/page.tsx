import React from 'react';
import { APP_CONFIG } from '@ptc/config';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>{APP_CONFIG.name}</h1>
      <p>Unified Company Platform — Production Foundation</p>
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f4f4f5', borderRadius: '8px' }}>
        <p><strong>Status:</strong> Foundation Verified (P00 / G0)</p>
        <p><strong>API Endpoint:</strong> <code>/api/v1/health</code></p>
      </div>
    </main>
  );
}

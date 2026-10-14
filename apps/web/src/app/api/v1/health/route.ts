import { NextResponse } from 'next/server';
import { APP_CONFIG } from '@ptc/config';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: APP_CONFIG.name,
    version: APP_CONFIG.apiVersion,
    timestamp: new Date().toISOString(),
  });
}

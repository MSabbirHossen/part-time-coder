/**
 * Part-time Coder - Supervised Background Worker Entry Point
 */
import { APP_CONFIG, PORTS } from '@ptc/config';

export async function startWorker() {
  const instanceId = `worker-${process.pid}-${Date.now()}`;
  console.log(`[${new Date().toISOString()}] Starting ${APP_CONFIG.name} worker [${instanceId}]...`);

  const shutdown = async (signal: string) => {
    console.log(`[${new Date().toISOString()}] Received ${signal}. Shutting down worker gracefully...`);
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  console.log(`[${new Date().toISOString()}] Worker ready. Polling loop initialized on port ${PORTS.worker}.`);
  return { instanceId };
}

if (require.main === module) {
  startWorker().catch((err) => {
    console.error('Fatal worker error:', err);
    process.exit(1);
  });
}

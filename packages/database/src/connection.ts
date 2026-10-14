import mongoose, { ConnectOptions } from 'mongoose';

export interface DatabaseState {
  isConnected: boolean;
  readyState: number;
  host?: string;
  name?: string;
}

/**
 * Returns current Mongoose connection health state.
 */
export function getDatabaseState(): DatabaseState {
  const readyState = mongoose.connection.readyState;
  return {
    isConnected: readyState === 1,
    readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
}

/**
 * Connects to MongoDB with production-grade defaults.
 */
export async function connectDatabase(
  uri: string,
  options: ConnectOptions = {}
): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const defaultOptions: ConnectOptions = {
    autoIndex: false, // In production, indexes are managed explicitly
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    ...options,
  };

  return mongoose.connect(uri, defaultOptions);
}

/**
 * Disconnects Mongoose connection cleanly.
 */
export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

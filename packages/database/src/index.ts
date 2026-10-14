/**
 * @ptc/database - Mongoose connection, models, indexes, and database migrations
 */

export interface DatabaseConnectionState {
  isConnected: boolean;
  readyState: number;
}

export const getDatabaseState = (readyState: number): DatabaseConnectionState => ({
  isConnected: readyState === 1,
  readyState,
});

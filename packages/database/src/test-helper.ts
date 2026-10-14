import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let replSet: MongoMemoryReplSet | null = null;

/**
 * Initializes an in-memory MongoDB replica set for transaction and isolation testing.
 */
export async function setupTestDatabase(): Promise<string> {
  if (!replSet) {
    replSet = await MongoMemoryReplSet.create({
      replSet: { count: 1, storageEngine: 'wiredTiger' },
    });
  }

  const uri = replSet.getUri();
  await mongoose.connect(uri, {
    autoIndex: true, // Auto-build indexes in test suite to verify constraints
  });

  return uri;
}

/**
 * Drops all collections and clears test data between tests.
 */
export async function clearTestDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}

/**
 * Cleanly teardown Mongoose connection and stops in-memory MongoDB server.
 */
export async function teardownTestDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  }

  if (replSet) {
    await replSet.stop();
    replSet = null;
  }
}

import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable inside .env.local");
}

// Global caching for hot reload in development (Next.js optimization)
let globalWithMongoose = global as typeof globalThis & {
  mongoose: { conn: Connection | null; promise: Promise<Connection> | null };
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Connection> {
  if (globalWithMongoose.mongoose.conn) {
    return globalWithMongoose.mongoose.conn;
  }

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    }).then(mongooseInstance => mongooseInstance.connection as Connection);
  }

  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  return globalWithMongoose.mongoose.conn;
}

export default connectToDatabase;

let cached: unknown;


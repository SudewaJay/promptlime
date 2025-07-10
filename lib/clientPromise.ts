import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// Global is used in development to preserve the value across module reloads caused by HMR (Hot Module Replacement)
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// 👇 Properly type globalThis to avoid TS errors in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("❌ Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
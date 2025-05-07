/* eslint-disable no-console */
import mongoose from "mongoose";

import env from "./env";

const dbUrl = env.DATABASE_URL as string;
// console.log(dbUrl);

if (!dbUrl) {
  throw new Error("❌ Mongodb connection string is not defined in env");
}

let isConnected = false;

export default async function DB(): Promise<typeof mongoose> {
  if (isConnected) {
    console.log("✅ Mongodb already connected");
    return mongoose;
  }

  try {
    const db = await mongoose.connect(dbUrl, {
      dbName: "auth-user",
      retryWrites: true,
    });

    isConnected = true;
    console.log("✅ Mongodb connected");
    return db;
  }
  catch (error) {
    console.error("❌ DB Connection error", error);
    process.exit(1);
  }
}

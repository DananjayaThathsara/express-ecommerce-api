import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("database is connected:", mongoose.connection.host);
  } catch (error) {
    console.log("Error occourd:", error.message);
    // stop server if DB fails
    process.exit(1);
  }
}

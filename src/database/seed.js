// src/seed.js
import { connectDB } from "../configs/db.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

async function run() {
  await connectDB();

  // Clear old data
  await Product.deleteMany({});
  await User.deleteMany({});

  // Sample products
  await Product.insertMany([
    {
      name: "Mechanical Keyboard",
      description: "Tactile keys",
      price: 79.99,
      quantity: 50,
    },
    {
      name: "Wireless Mouse",
      description: "Ergonomic",
      price: 29.99,
      quantity: 100,
    },
    {
      name: "24 inch Monitor",
      description: "1080p",
      price: 129.99,
      quantity: 30,
    },
  ]);

  // Create admin user for testing
  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash("Admin@123", salt);
  await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: adminPass,
    role: "admin",
  });

  console.log("Seed finished");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

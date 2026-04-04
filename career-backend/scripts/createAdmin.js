// ─────────────────────────────────────────────
//  Run this once to create an admin account:
//  node scripts/createAdmin.js
// ─────────────────────────────────────────────
const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const User     = require("../models/User");

dotenv.config({ path: "../.env" });

const createAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/careerdev");
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const exists = await User.findOne({ email: "admin@gmail.com" });
    if (exists) {
      console.log("⚠️  Admin already exists!");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name:     "Admin",
      email:    "admin@gmail.com",
      password: "admin123",
      role:     "admin",
    });

    console.log("🎉 Admin created successfully!");
    console.log("──────────────────────────────");
    console.log("📧 Email   :", admin.email);
    console.log("🔑 Password: admin123");
    console.log("👤 Role    :", admin.role);
    console.log("──────────────────────────────");
    console.log("Now login at http://localhost:3000");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
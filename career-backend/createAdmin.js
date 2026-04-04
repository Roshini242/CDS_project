const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/careerdev");
    console.log("✅ MongoDB Connected");

    // Delete existing admin if any
    await User.deleteOne({ email: "admin@gmail.com" });

    // Create fresh admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    });

    console.log("🎉 Admin created successfully!");
    console.log("Email   :", admin.email);
    console.log("Password: admin123");
    console.log("Role    :", admin.role);

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
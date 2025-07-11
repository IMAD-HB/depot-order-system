import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("Admin123", 10);
    const users = [
      { name: "Admin", email: "Admin@gmail.com", password: hashedPassword },
    ];

    await User.insertMany(users);
    console.log("✅ Users seeded");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();

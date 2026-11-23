require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedAdmin = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_lost_found";

  try {
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB at ${uri}`);

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@campus.edu").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "System Administrator";

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log(`Admin account ${adminEmail} already exists. Updating credentials...`);
      admin.name = adminName;
      admin.password = adminPassword;
      admin.role = "admin";
      await admin.save();
      console.log(`Admin account ${adminEmail} updated successfully.`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        phone: "1234567890"
      });
      console.log(`Admin account ${adminEmail} created successfully.`);
    }

    console.log("\n=================================");
    console.log("ADMIN ACCOUNT DETAILS:");
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     ${admin.role}`);
    console.log("=================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin account:", err);
    process.exit(1);
  }
};

seedAdmin();

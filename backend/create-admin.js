
require("dotenv").config();

const mongoose = require("mongoose");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const User = require("./models/User");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/campus_lost_found";

const email = "admin@campus.com";
const credentialsFile = path.join(
  __dirname,
  "admin-credentials.txt"
);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Account already exists:", email);
      console.log("Role:", existingUser.role);
      console.log("Existing password has not been changed.");
      return;
    }

    if (fs.existsSync(credentialsFile)) {
      console.log(
        "Credentials file already exists. No account created."
      );
      return;
    }

    const password = crypto
      .randomBytes(18)
      .toString("base64url");

    // Save credentials locally before creating the account.
    fs.writeFileSync(
      credentialsFile,
      `CAMPUS LOST & FOUND - ADMIN LOGIN

Email: ${email}
Password: ${password}
Role: admin
`,
      {
        encoding: "utf8",
        mode: 0o600,
        flag: "wx"
      }
    );

    try {
      await User.create({
        name: "Campus Admin",
        email,
        password,
        role: "admin"
      });
    } catch (error) {
      // Remove credentials if account creation fails.
      fs.unlinkSync(credentialsFile);
      throw error;
    }

    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("Credentials saved to admin-credentials.txt");
  } catch (error) {
    console.error("ERROR:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();

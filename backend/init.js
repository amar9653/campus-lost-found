
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/campus_lost_found";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@campus.edu";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Campus Admin";

// Campus Lost & Found Categories
const categories = [
  ["Mobile Phones", "Smartphones and mobile devices"],
  ["Laptops", "Laptops and notebooks"],
  ["Tablets", "Tablets and e-readers"],
  ["Chargers", "Mobile and laptop chargers"],
  ["Earphones", "Wired and wireless earbuds"],
  ["Headphones", "Headphones and headsets"],
  ["Power Banks", "Portable battery chargers"],
  ["USB Drives", "Pen drives and storage devices"],
  ["Wallets", "Wallets, purses and card holders"],
  ["Keys", "House, vehicle and locker keys"],
  ["Watches", "Wristwatches and smartwatches"],
  ["Jewellery", "Rings, chains and bracelets"],
  ["Glasses", "Spectacles and sunglasses"],
  ["Umbrellas", "Rain umbrellas"],
  ["Water Bottles", "Reusable water bottles"],
  ["Books", "Textbooks and reading books"],
  ["Notebooks", "Notebooks and diaries"],
  ["Stationery", "Pens, pencils and calculators"],
  ["ID Cards", "Student and employee ID cards"],
  ["Documents", "Personal and academic documents"],
  ["Certificates", "Academic and other certificates"],
  ["Backpacks", "School and college backpacks"],
  ["Handbags", "Handbags and purses"],
  ["Laptop Bags", "Laptop cases and bags"],
  ["Lunch Bags", "Lunch bags and lunch boxes"],
  ["Jackets", "Jackets and coats"],
  ["Hoodies", "Hoodies and sweatshirts"],
  ["Caps", "Caps and hats"],
  ["Shoes", "Shoes and footwear"],
  ["Sportswear", "Sports clothing and accessories"],
  ["Footballs", "Footballs and related equipment"],
  ["Cricket Equipment", "Bats, balls and cricket gear"],
  ["Badminton Equipment", "Rackets and shuttlecocks"],
  ["Gym Accessories", "Fitness and gym accessories"],
  ["Other", "Other lost or found campus items"]
];

async function init() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for initialization.");

    // ── Seed Admin User ──────────────────────────────────────────────
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        status: "Active"
      });
      console.log(`Admin created: ${ADMIN_EMAIL}`);
    }

    // ── Seed Categories ──────────────────────────────────────────────
    let added = 0;
    let existing = 0;

    for (const [name, description] of categories) {
      const result = await Category.updateOne(
        { name },
        {
          $setOnInsert: {
            name,
            description,
            isActive: true
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        added++;
      } else {
        existing++;
      }
    }

    console.log(
      `Categories: ${added} added, ${existing} already existed.`
    );

    console.log("\n==================================");
    console.log("INITIALIZATION COMPLETED");
    console.log("==================================");
    console.log(`Admin email:    ${ADMIN_EMAIL}`);
    console.log(`Admin password: ${ADMIN_PASSWORD}`);
    console.log("==================================");
  } catch (error) {
    console.error("Initialization failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

init();

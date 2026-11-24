
require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("./models/Category");

// Same MongoDB connection configuration as backend
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/campus_lost_found";

// Campus Lost & Found Categories
const categories = [
  // Electronics
  ["Mobile Phones", "Smartphones and mobile devices"],
  ["Laptops", "Laptops and notebooks"],
  ["Tablets", "Tablets and e-readers"],
  ["Chargers", "Mobile and laptop chargers"],
  ["Earphones", "Wired and wireless earbuds"],
  ["Headphones", "Headphones and headsets"],
  ["Power Banks", "Portable battery chargers"],
  ["USB Drives", "Pen drives and storage devices"],

  // Personal Items
  ["Wallets", "Wallets, purses and card holders"],
  ["Keys", "House, vehicle and locker keys"],
  ["Watches", "Wristwatches and smartwatches"],
  ["Jewellery", "Rings, chains and bracelets"],
  ["Glasses", "Spectacles and sunglasses"],
  ["Umbrellas", "Rain umbrellas"],
  ["Water Bottles", "Reusable water bottles"],

  // Academic Items
  ["Books", "Textbooks and reading books"],
  ["Notebooks", "Notebooks and diaries"],
  ["Stationery", "Pens, pencils and calculators"],
  ["ID Cards", "Student and employee ID cards"],
  ["Documents", "Personal and academic documents"],
  ["Certificates", "Academic and other certificates"],

  // Bags
  ["Backpacks", "School and college backpacks"],
  ["Handbags", "Handbags and purses"],
  ["Laptop Bags", "Laptop cases and bags"],
  ["Lunch Bags", "Lunch bags and lunch boxes"],

  // Clothing
  ["Jackets", "Jackets and coats"],
  ["Hoodies", "Hoodies and sweatshirts"],
  ["Caps", "Caps and hats"],
  ["Shoes", "Shoes and footwear"],
  ["Sportswear", "Sports clothing and accessories"],

  // Sports Equipment
  ["Footballs", "Footballs and related equipment"],
  ["Cricket Equipment", "Bats, balls and cricket gear"],
  ["Badminton Equipment", "Rackets and shuttlecocks"],
  ["Gym Accessories", "Fitness and gym accessories"],

  // Other
  ["Other", "Other lost or found campus items"],
  ["Other Items", "Other lost or found campus items"]
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log("MongoDB Connected Successfully!");
    console.log("Starting category seeding...\n");

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
        {
          upsert: true
        }
      );

      if (result.upsertedCount > 0) {
        added++;
        console.log(`Added: ${name}`);
      } else {
        existing++;
        console.log(`Already exists: ${name}`);
      }
    }

    console.log("\n================================");
    console.log("CATEGORY SEEDING COMPLETED");
    console.log("================================");
    console.log(`New categories added: ${added}`);
    console.log(`Existing categories: ${existing}`);
    console.log(`Total checked: ${categories.length}`);
    console.log("================================");

  } catch (error) {
    console.error("Category seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();

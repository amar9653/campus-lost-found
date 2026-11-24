const User = require("../models/User");
const Category = require("../models/Category");

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

const seedDatabase = async () => {
  try {
    // ── Seed Admin User ──────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || "admin@campus.edu";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Campus Admin";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        status: "Active"
      });
      console.log(`[SEED] Admin user created: ${adminEmail}`);
    } else {
      console.log(`[SEED] Admin user already exists: ${adminEmail}`);
    }

    // ── Seed Categories ──────────────────────────────────────────
    let added = 0;

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
      }
    }

    console.log(`[SEED] Categories: ${added} new, ${categories.length - added} already existed.`);
  } catch (error) {
    console.error("[SEED] Database seeding error:", error.message);
    // Don't crash the server if seeding fails
  }
};

module.exports = seedDatabase;


require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/Category");
const ItemReport = require("./models/ItemReport");
const Claim = require("./models/Claim");
const Notification = require("./models/Notification");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/campus_lost_found";

const DEMO_PASSWORD = "Demo@12345";

// Demo data must not be seeded into a production database.
if (process.env.NODE_ENV === "production") {
  console.error("Demo seeding is disabled in production.");
  process.exit(1);
}

const demoUsers = [
  {
    name: "Demo Administrator",
    email: "demo.admin@example.com",
    role: "admin"
  },
  {
    name: "Demo Student One",
    email: "demo.student1@example.com",
    role: "user"
  },
  {
    name: "Demo Student Two",
    email: "demo.student2@example.com",
    role: "user"
  }
];

const demoReports = [
  {
    type: "lost",
    itemName: "Demo Black Laptop",
    category: "Laptops",
    description: "Black laptop with a silver sticker on the lid.",
    location: "Central Library",
    status: "approved",
    owner: 1
  },
  {
    type: "lost",
    itemName: "Demo Blue Backpack",
    category: "Backpacks",
    description: "Blue backpack containing notebooks and stationery.",
    location: "Computer Lab",
    status: "approved",
    owner: 1
  },
  {
    type: "lost",
    itemName: "Demo Student ID Card",
    category: "ID Cards",
    description: "Student identity card lost near the canteen.",
    location: "College Canteen",
    status: "pending",
    owner: 2
  },
  {
    type: "lost",
    itemName: "Demo Wireless Earbuds",
    category: "Earphones",
    description: "White wireless earbuds inside a charging case.",
    location: "Auditorium",
    status: "rejected",
    owner: 2
  },
  {
    type: "lost",
    itemName: "Demo Wrist Watch",
    category: "Watches",
    description: "Black wrist watch with a round dial.",
    location: "Sports Ground",
    status: "approved",
    owner: 1
  },
  {
    type: "found",
    itemName: "Demo Brown Wallet",
    category: "Wallets",
    description: "Brown wallet found near the main entrance.",
    location: "Main Gate",
    status: "approved",
    owner: 1
  },
  {
    type: "found",
    itemName: "Demo Water Bottle",
    category: "Water Bottles",
    description: "Blue reusable water bottle found in classroom.",
    location: "Block A",
    status: "approved",
    owner: 2
  },
  {
    type: "found",
    itemName: "Demo Set of Keys",
    category: "Keys",
    description: "Three keys attached to a red keychain.",
    location: "Parking Area",
    status: "pending",
    owner: 1
  }
];

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

async function seedDemo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected.");

    // 1. Create demo users only if they do not exist.
    const users = [];

    for (const demo of demoUsers) {
      let user = await User.findOne({ email: demo.email });

      if (user) {
        // Do not overwrite an existing account.
        if (user.role !== demo.role) {
          throw new Error(
            `Demo email ${demo.email} already has a different role.`
          );
        }

        console.log(`Existing user: ${demo.email}`);
      } else {
        user = await User.create({
          ...demo,
          password: DEMO_PASSWORD,
          status: "Active"
        });

        console.log(`Created user: ${demo.email}`);
      }

      users.push(user);
    }

    // 2. Ensure demo categories exist.
    const categoryNames = [
      ...new Set(demoReports.map((r) => r.category))
    ];

    for (const name of categoryNames) {
      await Category.updateOne(
        { name },
        {
          $setOnInsert: {
            name,
            description: `Category for ${name}`,
            isActive: true
          }
        },
        { upsert: true }
      );

      const category = await Category.findOne({ name });

      if (!category.isActive) {
        throw new Error(`Required category is inactive: ${name}`);
      }
    }

    // 3. Create five Lost and three Found reports.
    const reports = [];

    for (let i = 0; i < demoReports.length; i++) {
      const data = demoReports[i];
      const owner = users[data.owner];

      // Demo item names are unique identifiers for this seed.
      let report = await ItemReport.findOne({
        itemName: data.itemName,
        user: owner._id
      });

      if (!report) {
        report = await ItemReport.create({
          type: data.type,
          itemName: data.itemName,
          category: data.category,
          description: data.description,
          location: data.location,
          eventDate: daysAgo(i + 1),
          contact: "Contact through campus administration",
          user: owner._id,
          status: data.status,
          isActive: data.status === "approved",
          rejectionReason:
            data.status === "rejected"
              ? "Insufficient item details. Please submit again."
              : null,
          images: []
        });

        console.log(`Created ${data.type}: ${data.itemName}`);
      } else {
        console.log(`Existing report: ${data.itemName}`);
      }

      reports.push(report);
    }

    // 4. Create demo ownership claims.
    const demoClaims = [
      {
        report: reports[5],
        claimant: users[2],
        status: "Pending",
        explanation:
          "This brown wallet belongs to me. I can identify its contents."
      },
      {
        report: reports[6],
        claimant: users[1],
        status: "Approved",
        explanation:
          "The blue water bottle belongs to me and has my initials."
      }
    ];

    const claims = [];

    for (const data of demoClaims) {
      let claim = await Claim.findOne({
        report: data.report._id,
        claimant: data.claimant._id
      });

      if (!claim) {
        claim = await Claim.create({
          report: data.report._id,
          claimant: data.claimant._id,
          ownershipExplanation: data.explanation,
          status: data.status,
          adminRemarks:
            data.status === "Approved"
              ? "Ownership details verified."
              : "",
          history: [
            {
              status: "Pending",
              date: new Date(),
              by: "Demo Student",
              notes: "Demo claim submitted"
            },
            ...(data.status === "Approved"
              ? [
                  {
                    status: "Approved",
                    date: new Date(),
                    by: "Demo Administrator",
                    notes: "Demo ownership verification"
                  }
                ]
              : [])
          ]
        });

        console.log(`Created claim: ${data.report.itemName}`);
      } else {
        console.log(`Existing claim: ${data.report.itemName}`);
      }

      claims.push(claim);
    }

    // 5. Create demo notifications without duplicates.
    const demoNotifications = [
      {
        recipient: users[0]._id,
        title: "Demo: New Report Submitted",
        message:
          "A student submitted a Lost Item report awaiting approval.",
        type: "info",
        relatedReport: reports[2]._id
      },
      {
        recipient: users[0]._id,
        title: "Demo: New Ownership Claim",
        message:
          "A student submitted a claim for Demo Brown Wallet.",
        type: "info",
        relatedClaim: claims[0]._id
      },
      {
        recipient: users[1]._id,
        title: "Demo: Report Approved",
        message:
          "Your Demo Black Laptop report has been approved.",
        type: "success",
        relatedReport: reports[0]._id
      },
      {
        recipient: users[2]._id,
        title: "Demo: Report Rejected",
        message:
          "Your Demo Wireless Earbuds report was rejected.",
        type: "error",
        relatedReport: reports[3]._id
      },
      {
        recipient: users[1]._id,
        title: "Demo: Claim Approved",
        message:
          "Your claim for Demo Water Bottle was approved.",
        type: "success",
        relatedClaim: claims[1]._id
      }
    ];

    for (const data of demoNotifications) {
      const existing = await Notification.findOne({
        recipient: data.recipient,
        title: data.title,
        relatedReport: data.relatedReport || null,
        relatedClaim: data.relatedClaim || null
      });

      if (!existing) {
        await Notification.create({
          ...data,
          isRead: false
        });
      }
    }

    console.log("\n==================================");
    console.log("DEMO DATA SEEDING COMPLETED");
    console.log("==================================");
    console.log("Demo accounts: 3");
    console.log("Lost reports: 5");
    console.log("Found reports: 3");
    console.log("Demo claims: 2");
    console.log("Demo notifications: 5");
    console.log("==================================");
    console.log("Password for new demo accounts:", DEMO_PASSWORD);
    console.log("==================================");
    console.log("Existing records were not deleted.");
  } catch (error) {
    console.error("Demo seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDemo();

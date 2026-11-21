// Set test environment variables BEFORE importing app or mongoose
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret_12345";

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const assert = (condition, description) => {
    if (condition) {
      console.log(`  ✓ PASS: ${description}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${description}`);
      failed++;
    }
  };

  try {
    console.log("\n--- Connecting to Local MongoDB for Testing ---");
    const testDbUri = "mongodb://127.0.0.1:27017/campus_lost_found_test";
    await mongoose.connect(testDbUri);
    console.log("Connected to MongoDB at:", testDbUri);

    // Clean test database before test suite
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }

    console.log("\n--- Testing Authentication Flow (Register & Login) ---");
    // 1. Register User 1
    const regRes1 = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Alice Smith",
        email: "alice@campus.edu",
        password: "password123",
        role: "user"
      });

    assert(regRes1.status === 201 && regRes1.body.success, "User 1 (Alice) registered successfully");
    const user1Token = regRes1.body.data.token;
    const user1Id = regRes1.body.data._id;
    assert(!!user1Token, "User 1 received JWT token");

    // 2. Register User 2
    const regRes2 = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Bob Jones",
        email: "bob@campus.edu",
        password: "password456",
        role: "user"
      });

    assert(regRes2.status === 201 && regRes2.body.success, "User 2 (Bob) registered successfully");
    const user2Token = regRes2.body.data.token;

    // 3. Login User 1
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alice@campus.edu",
        password: "password123"
      });

    assert(loginRes.status === 200 && loginRes.body.success, "User 1 login successful with valid password");
    assert(!!loginRes.body.data.token, "Login returns JWT token");

    // 4. Login with wrong password
    const wrongPassRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alice@campus.edu",
        password: "wrongpassword"
      });
    assert(wrongPassRes.status === 401, "Login fails with incorrect password (401)");

    // 5. Test Profile Route with JWT (/api/auth/me)
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${user1Token}`);

    assert(meRes.status === 200 && meRes.body.data.email === "alice@campus.edu", "Profile endpoint succeeds with valid Bearer token");

    // 6. Test Profile without JWT
    const meUnauth = await request(app).get("/api/auth/me");
    assert(meUnauth.status === 401, "Protected endpoint rejects unauthenticated request (401)");

    console.log("\n--- Testing Report Creation with JWT ---");
    // 7. Create Report without JWT (Should fail 401)
    const unauthReport = await request(app)
      .post("/api/reports")
      .send({
        type: "lost",
        itemName: "Blue Backpack",
        category: "Bags",
        description: "Navy blue bag with laptop inside",
        location: "Central Library",
        lostDate: "2026-11-20"
      });
    assert(unauthReport.status === 401, "Report creation rejected without JWT token (401)");

    // 8. Create Report with User 1 JWT
    const createRes = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        type: "lost",
        itemName: "Blue Backpack",
        category: "Bags",
        description: "Navy blue bag with laptop inside",
        location: "Central Library",
        lostDate: "2026-11-20",
        contact: "alice@campus.edu"
      });

    assert(createRes.status === 201 && createRes.body.success, "Report created successfully with User 1 JWT (201)");
    const reportId = createRes.body.data._id;
    assert(createRes.body.data.user.toString() === user1Id.toString(), "Report is correctly linked to User 1 ID");

    console.log("\n--- Testing Ownership Verification ---");
    // 9. User 2 attempts to UPDATE User 1's report (Should be Forbidden 403)
    const unauthUpdate = await request(app)
      .patch(`/api/reports/${reportId}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send({
        description: "Unauthorized update attempt by User 2"
      });

    assert(unauthUpdate.status === 403, "User 2 cannot update User 1's report (403 Forbidden - Ownership verification passed)");

    // 10. User 1 updates their OWN report (Should succeed 200)
    const authUpdate = await request(app)
      .patch(`/api/reports/${reportId}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        description: "Updated: Navy blue Dell backpack with laptop inside"
      });

    assert(
      authUpdate.status === 200 &&
      authUpdate.body.data.description === "Updated: Navy blue Dell backpack with laptop inside",
      "User 1 successfully updates own report (200 OK)"
    );

    // 11. User 2 attempts to WITHDRAW User 1's report (Should be Forbidden 403)
    const unauthWithdraw = await request(app)
      .patch(`/api/reports/${reportId}/withdraw`)
      .set("Authorization", `Bearer ${user2Token}`);

    assert(unauthWithdraw.status === 403, "User 2 cannot withdraw User 1's report (403 Forbidden - Ownership verification passed)");

    // 12. User 1 WITHDRAWS their OWN report (Should succeed 200)
    const authWithdraw = await request(app)
      .patch(`/api/reports/${reportId}/withdraw`)
      .set("Authorization", `Bearer ${user1Token}`);

    assert(
      authWithdraw.status === 200 &&
      authWithdraw.body.data.status === "withdrawn" &&
      authWithdraw.body.data.isActive === false,
      "User 1 successfully withdraws own report (200 OK)"
    );

    // 13. Public Search should no longer include withdrawn report
    const publicSearch = await request(app).get("/api/reports");
    assert(publicSearch.status === 200 && publicSearch.body.count === 0, "Withdrawn report not returned in public active search");

    // Clean up test database
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }

    console.log("\n=================================");
    console.log(`TOTAL TESTS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log("=================================\n");

  } catch (err) {
    console.error("Test error:", err);
    failed++;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(failed > 0 ? 1 : 0);
  }
};

runTests();

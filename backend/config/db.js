const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_lost_found";

  // Retry connection up to 5 times (handles Docker startup timing)
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/5 failed: ${error.message}`);
      if (attempt === 5) {
        if (process.env.NODE_ENV !== "test") {
          process.exit(1);
        }
        return;
      }
      // Wait 3 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

module.exports = connectDB;

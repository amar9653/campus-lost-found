const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_lost_found";
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not exit in test mode
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

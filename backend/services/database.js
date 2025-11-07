
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Mongoose connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    process.exit(1);
  }
};

module.exports=connectDB;
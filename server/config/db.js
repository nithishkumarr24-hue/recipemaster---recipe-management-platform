/* ============================================
   backend/config/db.js
   MongoDB connection — database name: "mongodb"
   ============================================ */
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Recipe = require("../models/Recipe");
const RECIPES = require("../data/recipes.json");

// Database name is fixed to "mongodb" as requested. Override the host/port
// via MONGODB_URI in a .env file if your MongoDB isn't running locally.
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mongodb";

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected → ${MONGODB_URI}`);
  } catch (err) {
    console.log("Local MongoDB connection failed. Starting in-memory MongoDB...");
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`In-memory MongoDB connected → ${uri}`);
      
      const count = await Recipe.countDocuments();
      if (count === 0) {
        await Recipe.insertMany(RECIPES);
        console.log(`Seeded ${RECIPES.length} recipes into the in-memory database.`);
      }
    } catch (memErr) {
      console.error("Failed to start in-memory MongoDB:", memErr.message);
      process.exit(1);
    }
  }
}

module.exports = connectDB;

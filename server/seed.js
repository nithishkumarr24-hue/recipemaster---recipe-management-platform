/* ============================================
   backend/seed.js
   One-off script: loads data/recipes.json into the
   "mongodb" database's recipes collection.

   Run with:  npm run seed   (from /backend)
   ============================================ */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Recipe = require("./models/Recipe");
const RECIPES = require("./data/recipes.json");

async function seed() {
  await connectDB();

  const existing = await Recipe.countDocuments();
  if (existing > 0) {
    console.log(`Recipes collection already has ${existing} documents — clearing before reseed.`);
    await Recipe.deleteMany({});
  }

  await Recipe.insertMany(RECIPES);
  console.log(`Seeded ${RECIPES.length} recipes into the "mongodb" database.`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

/* ============================================
   RECIPE MASTER — backend/server.js
   Express API backed by MongoDB (database: "mongodb"),
   serving Indian recipe data to the React frontend.
   ============================================ */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const Recipe = require("./models/Recipe");
const Favorite = require("./models/Favorite");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ============================================
   GET /api/recipes
   Query params: diet, category, search, sort
   ============================================ */
app.get("/api/recipes", async (req, res) => {
  try {
    const { diet, category, search, sort } = req.query;
    const query = {};

    if (diet) query.diet = diet;
    if (category && category !== "All") query.category = category;
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ title: regex }, { ingredients: regex }];
    }

    let sortSpec = {};
    switch (sort) {
      case "time-asc": sortSpec = { time: 1 }; break;
      case "time-desc": sortSpec = { time: -1 }; break;
      case "spice-asc": sortSpec = { spice: 1 }; break;
      case "spice-desc": sortSpec = { spice: -1 }; break;
      default: sortSpec = { createdAt: 1 };
    }

    const [recipes, totalForDiet] = await Promise.all([
      Recipe.find(query).sort(sortSpec).select("-_id -__v"),
      Recipe.countDocuments(diet ? { diet } : {})
    ]);

    res.json({ count: recipes.length, totalForDiet, recipes });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes", details: err.message });
  }
});

/* ============================================
   GET /api/recipes/:id
   ============================================ */
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ id: req.params.id }).select("-_id -__v");
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipe", details: err.message });
  }
});

/* ============================================
   GET /api/categories
   ============================================ */
app.get("/api/categories", (req, res) => {
  res.json(["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Desserts"]);
});

/* ============================================
   FAVORITES (per client id, sent as header, stored in MongoDB)
   ============================================ */
app.get("/api/favorites", async (req, res) => {
  try {
    const clientId = req.header("x-client-id") || "anonymous";
    const favs = await Favorite.find({ clientId }).select("recipeId -_id");
    res.json({ favorites: favs.map((f) => f.recipeId) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites", details: err.message });
  }
});

app.post("/api/favorites/:id", async (req, res) => {
  try {
    const clientId = req.header("x-client-id") || "anonymous";
    const recipeId = req.params.id;

    const existing = await Favorite.findOne({ clientId, recipeId });
    if (existing) {
      await existing.deleteOne();
    } else {
      await Favorite.create({ clientId, recipeId });
    }

    const favs = await Favorite.find({ clientId }).select("recipeId -_id");
    res.json({ favorites: favs.map((f) => f.recipeId) });
  } catch (err) {
    res.status(500).json({ error: "Failed to update favorite", details: err.message });
  }
});

/* ============================================
   Serve the built React frontend in production
   (run `npm run build` inside /frontend first)
   ============================================ */
const frontendBuildPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(frontendBuildPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendBuildPath, "index.html"), (err) => {
    if (err) next();
  });
});

/* ============================================
   START
   ============================================ */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Recipe Master API running on http://localhost:${PORT}`);
  });
});

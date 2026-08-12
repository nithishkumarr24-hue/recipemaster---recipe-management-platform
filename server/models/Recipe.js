/* ============================================
   backend/models/Recipe.js
   Mongoose schema for a recipe document
   ============================================ */
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    diet: { type: String, enum: ["veg", "non-veg"], required: true },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snacks", "Desserts"],
      required: true
    },
    desc: { type: String, required: true },
    time: { type: Number, required: true },
    spice: { type: Number, required: true, min: 0, max: 4 },
    servings: { type: Number, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true }
  },
  { timestamps: true, versionKey: false }
);

// text index so /api/recipes?search= can use $text as well as a plain regex fallback
recipeSchema.index({ title: "text", ingredients: "text" });

module.exports = mongoose.model("Recipe", recipeSchema);

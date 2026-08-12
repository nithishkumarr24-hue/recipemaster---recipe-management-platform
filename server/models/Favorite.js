/* ============================================
   backend/models/Favorite.js
   Tracks which recipe ids each client has favorited
   ============================================ */
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    recipeId: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
);

favoriteSchema.index({ clientId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);

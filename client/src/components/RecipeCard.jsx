import React from "react";
import { formatTime, spiceLevels, SPICE_MAX } from "../utils.js";

function DietMark({ diet }) {
  return diet === "veg" ? (
    <span className="diet-mark veg" aria-label="Vegetarian">
      <span className="dot"></span>
    </span>
  ) : (
    <span className="diet-mark nonveg" aria-label="Non-vegetarian">
      <span className="tri"></span>
    </span>
  );
}

export default function RecipeCard({ recipe, index, isFav, onOpen, onToggleFavorite }) {
  const delay = `${Math.min(index, 14) * 0.045}s`;

  return (
    <article
      className="recipe-card"
      style={{ "--card-delay": delay }}
      tabIndex={0}
      role="button"
      aria-label={`Open recipe: ${recipe.title}`}
      onClick={() => onOpen(recipe)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(recipe);
        }
      }}
    >
      <div className="card-top">
        <span className="card-top-left">
          <DietMark diet={recipe.diet} />
          <span className="card-category">{recipe.category}</span>
        </span>
        <button
          className={`fav-btn${isFav ? " active" : ""}`}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>

      <h2 className="card-title">{recipe.title}</h2>
      <p className="card-desc">{recipe.desc}</p>

      <div className="card-meta">
        <span className="meta-time">⏱ {formatTime(recipe.time)}</span>
        <span className="spice-level" aria-label={`Spice level ${recipe.spice} of ${SPICE_MAX}`}>
          {spiceLevels(recipe.spice).map((lit, i) => (
            <span key={i} className={lit ? "lit" : "unlit"}>🌶️</span>
          ))}
        </span>
      </div>
    </article>
  );
}

import React, { useEffect, useRef, useState } from "react";
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

export default function RecipeModal({ recipe, isFav, onClose, onToggleFavorite }) {
  const closeRef = useRef(null);
  const [checked, setChecked] = useState(() => new Set());

  useEffect(() => {
    if (!recipe) return;
    setChecked(new Set());
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [recipe, onClose]);

  if (!recipe) return null;

  const toggleIngredient = (i) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div
      className="modal-backdrop open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="recipe-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button className="modal-close" aria-label="Close recipe" onClick={onClose} ref={closeRef}>
          ✕
        </button>
        <div className="modal-scroll">
          <p className="modal-category">
            <DietMark diet={recipe.diet} />
            &nbsp;{recipe.category}
          </p>
          <h2 className="modal-title" id="modalTitle">{recipe.title}</h2>
          <p className="modal-desc">{recipe.desc}</p>

          <div className="modal-stats">
            <div className="stat">
              <span className="stat-label">Time</span>
              <span className="stat-value">{formatTime(recipe.time)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Servings</span>
              <span className="stat-value">{recipe.servings}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Spice</span>
              <span
                className="stat-value spice-level"
                aria-label={`Spice level ${recipe.spice} of ${SPICE_MAX}`}
              >
                {spiceLevels(recipe.spice).map((lit, i) => (
                  <span key={i} className={lit ? "lit" : "unlit"}>🌶️</span>
                ))}
              </span>
            </div>
            <div className="stat">
              <button
                className={`fav-btn${isFav ? " active" : ""}`}
                style={{ fontSize: 14, display: "flex", gap: 6, alignItems: "center" }}
                onClick={() => onToggleFavorite(recipe.id)}
              >
                {isFav ? "♥ Saved" : "♡ Save"}
              </button>
            </div>
          </div>

          <div className="modal-columns">
            <div>
              <h3>Ingredients</h3>
              <ul className="ingredient-list">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} style={{ "--i": i }} className={checked.has(i) ? "checked" : ""}>
                    <input
                      type="checkbox"
                      id={`ing-${i}`}
                      checked={checked.has(i)}
                      onChange={() => toggleIngredient(i)}
                    />
                    <label htmlFor={`ing-${i}`}>{ing}</label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Full Preparation</h3>
              <ol className="steps-list">
                {recipe.steps.map((step, i) => (
                  <li key={i} style={{ "--i": i }}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

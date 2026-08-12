import React from "react";

const FLOAT_SPICES = ["🌶️", "🍃", "🫓", "🥘", "🌿", "🍛", "🧄", "🍚"];

export default function Entrance({ open, onChoose }) {
  return (
    <div className={`entrance${open ? "" : " closed"}`}>
      <div className="entrance-decor" aria-hidden="true">
        {FLOAT_SPICES.map((s, i) => (
          <span key={i} className={`float-spice s${i + 1}`}>{s}</span>
        ))}
      </div>

      <div className="entrance-inner">
        <span className="brand-mark large spin-in">🌿</span>
        <h1 className="entrance-title reveal-title">Recipe Master</h1>
        <p className="entrance-tagline reveal-fade">Recipe Management Platform</p>
        <p className="entrance-sub reveal-fade">
          an Indian kitchen, kept two ways — choose your shelf
        </p>

        <div className="entrance-choices">
          <button className="diet-card rise-in d1" onClick={() => onChoose("veg")}>
            <span className="diet-icon veg-icon" aria-hidden="true">
              <span className="veg-dot"></span>
            </span>
            <span className="diet-name">Vegetarian</span>
            <span className="diet-desc">Dals, paneer, sabzis &amp; more — no meat, no egg.</span>
          </button>

          <button className="diet-card rise-in d2" onClick={() => onChoose("non-veg")}>
            <span className="diet-icon nonveg-icon" aria-hidden="true">
              <span className="nonveg-triangle"></span>
            </span>
            <span className="diet-name">Non-Vegetarian</span>
            <span className="diet-desc">Chicken, mutton, fish &amp; egg dishes, cooked properly.</span>
          </button>
        </div>

        <p className="entrance-hint reveal-fade">
          You can switch shelves any time from the top of the page.
        </p>
      </div>
    </div>
  );
}

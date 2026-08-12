import React from "react";

export default function Header({
  visible,
  diet,
  search,
  onSearchChange,
  onSwitchDiet,
  categories,
  activeCategory,
  onCategoryChange
}) {
  return (
    <header className={`site-header${visible ? "" : " hidden"}`}>
      <div className="header-inner">
        <div className="brand">
          <span className="brand-mark">🌿</span>
          <div className="brand-text">
            <h1>Recipe Master</h1>
            <p className="tagline">
              {diet === "veg"
                ? "vegetarian shelf — recipe management platform"
                : diet === "non-veg"
                ? "non-vegetarian shelf — recipe management platform"
                : "recipe management platform"}
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-wrap">
            <label htmlFor="search" className="visually-hidden">
              Search recipes or ingredients
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search a dish or an ingredient…"
              autoComplete="off"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className="search-icon">⌕</span>
          </div>
          <button className="switch-diet-btn" onClick={onSwitchDiet}>
            Switch shelf
          </button>
        </div>
      </div>

      <nav className="category-rail" aria-label="Filter by meal">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-pill${cat === activeCategory ? " active" : ""}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>
    </header>
  );
}

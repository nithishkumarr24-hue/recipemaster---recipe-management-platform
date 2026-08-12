import React from "react";
import RecipeCard from "./RecipeCard.jsx";

export default function RecipeGrid({
  recipes,
  totalForDiet,
  hasFilters,
  sort,
  onSortChange,
  favorites,
  onOpen,
  onToggleFavorite,
  loading
}) {
  return (
    <main>
      <section className="results-bar">
        <p id="resultsCount">
          {loading
            ? "Loading recipes…"
            : hasFilters
            ? `Showing ${recipes.length} of ${totalForDiet} recipes`
            : `Showing all ${totalForDiet} recipes`}
        </p>
        <div className="sort-wrap">
          <label htmlFor="sortSelect">Sort</label>
          <select id="sortSelect" value={sort} onChange={(e) => onSortChange(e.target.value)}>
            <option value="default">Ledger order</option>
            <option value="time-asc">Quickest first</option>
            <option value="time-desc">Slowest first</option>
            <option value="spice-asc">Mildest first</option>
            <option value="spice-desc">Boldest first</option>
          </select>
        </div>
      </section>

      <section className="recipe-grid">
        {recipes.map((recipe, i) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            index={i}
            isFav={favorites.has(recipe.id)}
            onOpen={onOpen}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </section>

      {!loading && recipes.length === 0 && (
        <p className="empty-state">
          Nothing matches that search. Try a different dish or ingredient — or clear the filter above.
        </p>
      )}
    </main>
  );
}

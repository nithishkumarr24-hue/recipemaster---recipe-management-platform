import React, { useEffect, useState, useCallback } from "react";
import Entrance from "./components/Entrance.jsx";
import Header from "./components/Header.jsx";
import RecipeGrid from "./components/RecipeGrid.jsx";
import RecipeModal from "./components/RecipeModal.jsx";
import { fetchRecipes, fetchCategories, fetchFavorites, toggleFavorite as apiToggleFavorite } from "./api.js";

export default function App() {
  const [diet, setDiet] = useState(null);
  const [entranceOpen, setEntranceOpen] = useState(true);
  const [categories, setCategories] = useState(["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Desserts"]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [recipes, setRecipes] = useState([]);
  const [totalForDiet, setTotalForDiet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    fetchFavorites()
      .then((data) => setFavorites(new Set(data.favorites)))
      .catch(() => {});
  }, []);

  const loadRecipes = useCallback(() => {
    if (!diet) return;
    setLoading(true);
    fetchRecipes({ diet, category, search, sort })
      .then((data) => {
        setRecipes(data.recipes);
        setTotalForDiet(data.totalForDiet);
      })
      .catch(() => {
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, [diet, category, search, sort]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const handleChooseDiet = (chosen) => {
    setDiet(chosen);
    setCategory("All");
    setSearch("");
    setEntranceOpen(false);
    window.scrollTo({ top: 0 });
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    apiToggleFavorite(id).catch(() => {});
  };

  const hasFilters = Boolean(search) || category !== "All";

  return (
    <>
      <div className="grain-overlay" aria-hidden="true"></div>

      <Entrance open={entranceOpen} onChoose={handleChooseDiet} />

      <Header
        visible={!entranceOpen}
        diet={diet}
        search={search}
        onSearchChange={setSearch}
        onSwitchDiet={() => setEntranceOpen(true)}
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
      />

      {!entranceOpen && (
        <RecipeGrid
          recipes={recipes}
          totalForDiet={totalForDiet}
          hasFilters={hasFilters}
          sort={sort}
          onSortChange={setSort}
          favorites={favorites}
          onOpen={setSelectedRecipe}
          onToggleFavorite={handleToggleFavorite}
          loading={loading}
        />
      )}

      <footer className="site-footer">
        <p>Recipe Master — every Indian dish, kept in one well-loved ledger.</p>
      </footer>

      <RecipeModal
        recipe={selectedRecipe}
        isFav={selectedRecipe ? favorites.has(selectedRecipe.id) : false}
        onClose={() => setSelectedRecipe(null)}
        onToggleFavorite={handleToggleFavorite}
      />
    </>
  );
}

const BASE = "/api";

function getClientId() {
  let id = localStorage.getItem("rm_client_id");
  if (!id) {
    id = "client-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("rm_client_id", id);
  }
  return id;
}

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-client-id": getClientId(),
      ...(options.headers || {})
    }
  });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json();
}

export function fetchRecipes({ diet, category, search, sort }) {
  const params = new URLSearchParams();
  if (diet) params.set("diet", diet);
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);
  return request(`/recipes?${params.toString()}`);
}

export function fetchRecipe(id) {
  return request(`/recipes/${id}`);
}

export function fetchCategories() {
  return request("/categories");
}

export function fetchFavorites() {
  return request("/favorites");
}

export function toggleFavorite(id) {
  return request(`/favorites/${id}`, { method: "POST" });
}

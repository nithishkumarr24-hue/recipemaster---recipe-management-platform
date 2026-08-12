# Recipe Master — Recipe Management Platform

A full-stack Indian recipe app split into two modules:

- **Frontend** — React (Vite) — `/frontend`
- **Backend** — Express + MongoDB (Mongoose) — `/backend/server.js`

31 vegetarian and non-vegetarian Indian recipes across Breakfast, Lunch,
Dinner, Snacks, and Desserts, with search, sort, favorites, and a themed
"Recipe Master" entrance gate with animations.

## Project structure

```
antigravity/
├── backend/
│   ├── server.js          # Express API
│   ├── config/db.js       # MongoDB connection (database: "mongodb")
│   ├── models/
│   │   ├── Recipe.js      # Mongoose recipe schema
│   │   └── Favorite.js    # Mongoose favorite schema
│   ├── data/recipes.json  # seed data
│   ├── seed.js            # loads data/recipes.json into MongoDB
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api.js         # fetch wrapper for the backend API
│   │   ├── utils.js
│   │   ├── styles/index.css
│   │   └── components/
│   │       ├── Entrance.jsx
│   │       ├── Header.jsx
│   │       ├── RecipeGrid.jsx
│   │       ├── RecipeCard.jsx
│   │       └── RecipeModal.jsx
│   └── package.json
└── package.json           # root scripts to run both together
```

## Database

MongoDB is used for storage, with the database named **`mongodb`**
(`mongodb://127.0.0.1:27017/mongodb` by default). It holds two collections:

- `recipes` — the full recipe catalog
- `favorites` — per-browser favorited recipe ids (keyed by an `x-client-id`
  header the frontend generates automatically)

Copy `backend/.env.example` to `backend/.env` and adjust `MONGODB_URI` if
your MongoDB isn't running locally (e.g. a MongoDB Atlas connection string —
just make sure the path segment after the host stays `/mongodb` if you want
to keep that database name).

## Setup

```bash
npm run install:all
```

This installs dependencies for both `backend` and `frontend`.

Make sure MongoDB is running, then seed the database once:

```bash
cd backend
npm run seed
```

This loads the 31 recipes from `data/recipes.json` into the `mongodb`
database's `recipes` collection (safe to re-run — it clears and reloads).

## Run in development

```bash
npm run dev
```

This starts the Express API on `http://localhost:5000` and the Vite dev
server on `http://localhost:5173` (with `/api` proxied to the backend), using
`concurrently`.

You can also run each module on its own:

```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

## Build for production

```bash
npm run build   # builds the React app into frontend/dist
npm start        # builds, then serves everything from the Express server
```

In production, `server.js` serves the built React app directly, so a single
Express process (port 5000 by default) handles both the API and the site.

## API reference

| Method | Route                     | Description                                   |
|--------|---------------------------|------------------------------------------------|
| GET    | `/api/recipes`            | List recipes. Query: `diet`, `category`, `search`, `sort` |
| GET    | `/api/recipes/:id`        | Get a single recipe                           |
| GET    | `/api/categories`         | List meal categories                          |
| GET    | `/api/favorites`          | Get favorites for the current client          |
| POST   | `/api/favorites/:id`      | Toggle a recipe as favorite                   |

The frontend identifies itself with an `x-client-id` header (a random ID
generated once and stored in `localStorage`) so favorites persist per browser
without requiring login. Both recipes and favorites now live in MongoDB.


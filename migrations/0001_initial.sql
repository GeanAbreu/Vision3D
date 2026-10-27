CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL CHECK (price >= 0),
  delivery_time TEXT,
  image_url TEXT,
  weight REAL NOT NULL DEFAULT 0.3 CHECK (weight > 0),
  width REAL NOT NULL DEFAULT 15 CHECK (width > 0),
  height REAL NOT NULL DEFAULT 10 CHECK (height > 0),
  length REAL NOT NULL DEFAULT 20 CHECK (length > 0),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

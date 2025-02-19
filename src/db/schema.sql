-- Suppression des tables si elles existent
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS categories;

-- Création de la table des catégories
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Création de la table des mots avec clé étrangère vers les catégories
CREATE TABLE words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(word, category_id)
);
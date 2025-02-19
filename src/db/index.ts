import Database from 'better-sqlite3';
import { join } from 'path';

// Initialisation de la base de données
const db = new Database(join(process.cwd(), 'words.db'));

// Préparation des requêtes
const addCategoryStmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
const getCategoriesStmt = db.prepare('SELECT * FROM categories ORDER BY name');
const addWordStmt = db.prepare('INSERT INTO words (word, category_id) VALUES (?, ?)');
const getWordsByCategoryStmt = db.prepare('SELECT * FROM words WHERE category_id = ? ORDER BY word');
const getRandomWordStmt = db.prepare('SELECT word FROM words WHERE category_id = ? ORDER BY RANDOM() LIMIT 1');

// Initialisation des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(word, category_id)
  );
`);

// Opérations sur les catégories
export const addCategory = (name: string) => {
  try {
    const result = addCategoryStmt.run(name);
    return result.lastInsertRowid;
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('Cette catégorie existe déjà');
    }
    throw error;
  }
};

export const getCategories = () => {
  return getCategoriesStmt.all();
};

// Opérations sur les mots
export const addWord = (word: string, categoryId: number) => {
  try {
    const result = addWordStmt.run(word, categoryId);
    return result.lastInsertRowid;
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('Ce mot existe déjà dans cette catégorie');
    }
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      throw new Error('Catégorie invalide');
    }
    throw error;
  }
};

export const getWordsByCategory = (categoryId: number) => {
  return getWordsByCategoryStmt.all(categoryId);
};

export const getRandomWord = (categoryId: number) => {
  return getRandomWordStmt.get(categoryId)?.word || null;
};

export default db;
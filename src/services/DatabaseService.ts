import initSqlJs from 'sql.js';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: any;

  private constructor() { }

  static async getInstance() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      await DatabaseService.instance.initDatabase();
    }
    return DatabaseService.instance;
  }

  private async initDatabase() {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    // Récupérer la base de données du localStorage si elle existe
    const savedDb = localStorage.getItem('wordGeneratorDb');
    if (savedDb) {
      const buf = new Uint8Array(JSON.parse(savedDb)).buffer;
      this.db = new SQL.Database(new Uint8Array(buf));
    } else {
      // Sinon créer une nouvelle base de données
      this.db = new SQL.Database();
      this.createTables();
    }
  }

  private createTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL,
        category_id INTEGER,
        FOREIGN KEY(category_id) REFERENCES categories(id)
      );
    `);

    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    const data = this.db.export();
    const buf = new Uint8Array(data).toString();
    localStorage.setItem('wordGeneratorDb', JSON.stringify(Array.from(data)));
  }

  async addCategory(name: string): Promise<number> {
    const stmt = this.db.prepare('INSERT INTO categories (name) VALUES (?)');
    stmt.run([name]);
    this.saveToLocalStorage();
    return this.db.exec('SELECT last_insert_rowid()')[0].values[0][0];
  }

  getCategories(): Array<{id: number, name: string}> {
    const result = this.db.exec('SELECT id, name FROM categories');
    if (result.length === 0) return [];
    
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      name: row[1]
    }));
  }

  async addWord(word: string, categoryId: number): Promise<number> {
    const stmt = this.db.prepare('INSERT INTO words (word, category_id) VALUES (?, ?)');
    stmt.run([word, categoryId]);
    this.saveToLocalStorage();
    return this.db.exec('SELECT last_insert_rowid()')[0].values[0][0];
  }

  getWordsByCategory(categoryId: number): Array<{id: number, word: string}> {
    const result = this.db.exec('SELECT id, word FROM words WHERE category_id = ?', [categoryId]);
    if (result.length === 0) return [];
    
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      word: row[1]
    }));
  }
}
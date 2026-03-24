import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('finance.db');

export const initDB = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        amount REAL,
        category TEXT,
        type TEXT,
        date TEXT
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const insertTransaction = async (item: {
  title: string;
  amount: number;
  category: string;
  type: string;
  date: string;
}) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO transactions (title, amount, category, type, date)
       VALUES (?, ?, ?, ?, ?)`,
      [item.title, item.amount, item.category, item.type, item.date]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting transaction:', error);
    throw error;
  }
};

export const fetchTransactions = async () => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM transactions ORDER BY date DESC`);
    return result;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const deleteTransaction = async (id: number) => {
  try {
    await db.runAsync(`DELETE FROM transactions WHERE id = ?`, [id]);
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
};

export const deleteAllTransactions = async () => {
  try {
    await db.runAsync(`DELETE FROM transactions`);
    console.log('All transactions deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting all transactions:', error);
    return false;
  }
};

export default db;
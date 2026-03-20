const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

async function getDbConnection() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await getDbConnection();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cleaning_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_name TEXT,
      floor_number TEXT,
      room_number TEXT,
      cleaner_name TEXT,
      cleaner_id TEXT,
      cleaning_status TEXT,
      cleaning_type TEXT,
      priority TEXT,
      issues_found TEXT,
      notes TEXT,
      before_image TEXT,
      after_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Database initialized');
  return db;
}

module.exports = {
  getDbConnection,
  initDb
};

const sqlite3 = require('sqlite3').verbose();

export const db = new sqlite3.Database('./src/services/users.db', (err: Error) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database.');
});
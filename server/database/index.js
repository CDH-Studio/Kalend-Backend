const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('database/Kalend.db', (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the Kalend SQLite Database');
});

module.exports = db

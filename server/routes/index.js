let express = require('express');
let router = express.Router();
const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('database/Kalend.db', (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the Kalend SQLite Database');
});

router.get('/', function(req, res){
	res.render('index.html');
}); 

router.get('/api/test', function(req, res){
	let data = {test: 'This is test data'};
	res.send(data);
});

router.get('/api/users', function(req, res){
	db.all('SELECT * FROM USER', function(err, rows) {
		if(err) {
			console.log(err);
			return err.message;
		}
		res.send(JSON.stringify(rows));
	});
});

module.exports = router;

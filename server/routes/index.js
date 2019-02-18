let express = require('express');
let router = express.Router();
let request = require('request');
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

router.get('/api/analyzepicture', function(req, res){
	request('http://localhost:5000/analyzepicture', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('This is the body:', body); // Print the google web page.\
			res.send(body);
		}
	});
	
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

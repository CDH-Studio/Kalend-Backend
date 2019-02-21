const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = app => {
	app.use(bodyParser.json({ limit: '5MB', type:'application/json'}));
	app.use(bodyParser.urlencoded({limit: '5MB', extended: true}));
	app.use(morgan('dev'));
}; 
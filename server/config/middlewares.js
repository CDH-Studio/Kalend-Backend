const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const sess = {
	secret: 'keyboard cat',
	cookie: {},
	resave: false,
    saveUninitialized: true
}
  
if (app.get('env') === 'production') {
	app.set('trust proxy', 1) // trust first proxy
	sess.cookie.secure = true // serve secure cookies
}


module.exports = app => {
	app.use(bodyParser.json({ limit: '5MB', type:'application/json'}));
	app.use(bodyParser.urlencoded({limit: '5MB', extended: true}));
	app.use(session(sess));
	app.use(cookieParser())
	app.use(morgan('dev'));
}; 

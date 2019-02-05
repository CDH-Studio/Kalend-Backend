const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const middlewareConfig = require('./config/middlewares');

const app = express();
const port = 8080;

//Middleware
middlewareConfig(app);

//views
app.set('views',  path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Body parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Routes
app.use('/', index);

app.listen(port, () => {
	console.log('Server running on port', port);
});

/*
//const socket_io = require("socket.io");
//const io = socket_io();

// app.use("/api", driverLocation);
// app.use("/api", drivers);

io.listen(app.listen(port, () => {
	console.log("Server running on port", port);
}));

app.io = io.on("connection", (socket) => {
	console.log("Socket connected: " + socket.id);

	socket.on("sendData", (obj) => {
		console.log("Recieved in the server", obj)
	})
});
*/

const userQueries =  require('../database/queries/userqueries');
const schoolInfoQueries =  require('../database/queries/schoolInfoqueries');
const eventQueries =  require('../database/queries/eventsQueries');
const calendarCalls = require('../services/googleCalendar'); 
const tokenGenerator = require('../services/googleTokenGeneration');

const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/api/analyzepicture', (req, res) => {
	request.post({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		url:     'http://localhost:5000/analyzepicture',
		body: req.body.data
	}, function(error, response, body){
		res.send(body);
	});
	
});

router.post('/api/logUser', async (req, res) => {
	const { serverAuthCode, calendarID} = req.body;
	let {id, email, name, photo} = req.body.user;


	let tokenData = await tokenGenerator.serverAuthentication(serverAuthCode);
	let { refresh_token, access_token }  = tokenData;
	let user = {id, name, email, photo, serverAuthCode, accessToken: access_token, calendarID};
	let columns;
	let values;

	if (refresh_token) {
		
		user.refreshToken = refresh_token;
		columns = ['FULLNAME', 'EMAIL', 'SERVERAUTHCODE', 'CALENDARID', 'ACCESSTOKEN', `REFRESHTOKEN`]
		values = [name, email, serverAuthCode, calendarID, access_token, refresh_token, id]
	} else {
		columns = ['FULLNAME', 'EMAIL', 'SERVERAUTHCODE', 'CALENDARID', 'ACCESSTOKEN']
		values = [name, email, serverAuthCode, calendarID, access_token, id]
	}
 	

	userQueries.getUser(id)
		.then((row) => {
			if (row) {
			

				userQueries.updateUser(columns, values)
					.then( () => {
						req.session.userID = id;
						res.send(true);
					}).catch(err => {
						res.send(false);
					});
			} else {
				userQueries.insertUser(user)
					.then(id => {
						req.session.userID = id;
						res.send(true);
					})
					.catch(err => {
						console.log('err', err);
						res.send(false);
					});
			}
		})
		.catch((err) => {
			console.log(err);
			res.send(false);
		});
});

router.post('/api/updateUser', (req, res) => {
	const { values, columns } = req.body;
	const userID = req.session.userID;

	userQueries.updateUser(columns, [...values, userID])
		.then( () => {
			res.send(true);
		}).catch(err => {
			res.send(false);
		});
});


router.post('/api/storeSchoolInfo', (req, res) => {
	const { startDate, endDate, value } = req.body;
	const id = req.session.userID;
	const schoolID = value;
	console.log('req.sessions.school', req.session.schoolInfo)
	let schoolInfo = {id, startDate, endDate, schoolID};

	schoolInfoQueries.getSchoolInfo(id, schoolID) 
		.then((rows) => {
			if (rows.length > 0) {
				schoolInfoQueries.updateSchoolInfo(schoolInfo)
					.then(data => {
						req.session.schoolInfo = data;
						res.send(true);
						return;
					})
					.catch(err => {
						console.log('err', err);
						res.send(false);
						return err;
					});
			} else {
				schoolInfoQueries.insertSchoolInfo(schoolInfo)
					.then(data => {
						req.session.schoolInfo = data;
						res.send(true);
						return;
					})
					.catch(err => {
						console.log('err', err);
						res.send(false);
						return err;
					});
			}

		}).catch((err) => {
			res.send(false);
			return err;
		})
});

router.post('/api/storeGeneratedCalendars', async (req,res) =>  {
	console.log('length', req.body.length);
	let promises = [];
	await req.body.forEach(event => {
		promises.push(eventQueries.insertEvent(event, req.session.userID));
	});

	Promise.all(promises).then(() => {
		res.send(true);
	})
	.catch(err => {
		res.send(false);
	});
	
});

router.post('/api/storeUserHours', (req, res) => {
	const { startDate, endDate, value } = req.body;
	const id = req.session.userID;
	console.log('id', id);
	console.log('req.body', req.body);
	if (req.session.info.schoolInfo != undefined) {
		res.send(req.session.info.schoolInfo);
		return;
	} 

	db.run('INSERT INTO UserSchoolInfo VALUES (?,?,?,?)', [id, value, startDate, endDate], (err) => {
	 	if (err) {
	 		console.log(err);
			res.send(false)
			return err.message;
		}
		req.session.info.schoolInfo = { startDate, endDate, value};
		req.session.save();
		res.send(true);

		return;
	 });

});

router.get('/api/getEvents', (req,res) =>  {
	console.log('ID', req.session.userID);
	if (req.session.userID) {
		
		eventQueries.getEvents(req.session.userID)
			.then(events => {
				console.log('here', events);
				res.send(events);
			});
	}
});

module.exports = router;



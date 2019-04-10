const userQueries =  require('../database/queries/userqueries');
const schoolInfoQueries =  require('../database/queries/schoolInfoqueries');
const eventQueries =  require('../database/queries/eventsQueries');
const unavailableHoursQueries = require('../database/queries/unavailablehours');
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
	const { serverAuthCode} = req.body;
	let {id, email, name, photo} = req.body.user;

	let tokenData = await tokenGenerator.serverAuthentication(serverAuthCode);
	let { refresh_token, access_token }  = tokenData;
	let user = {id, name, email, photo, serverAuthCode, accessToken: access_token};
	let columns;
	let values;

	if (refresh_token) {
		user.refreshToken = refresh_token;
		columns = ['FULLNAME', 'EMAIL', 'SERVERAUTHCODE', 'ACCESSTOKEN', `REFRESHTOKEN`]
		values = [name, email, serverAuthCode, access_token, refresh_token, id]
	} else {
		columns = ['FULLNAME', 'EMAIL', 'SERVERAUTHCODE','ACCESSTOKEN']
		values = [name, email, serverAuthCode, access_token, id]
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
	req.body.forEach(event => {
		promises.push(eventQueries.insertEvent(event, req.session.userID));
	});

	Promise.all(promises).then(() => {
		res.send(true);
	})
	.catch(err => {
		console.log('err', err);
		res.send(false);
	});
	
});

router.post('/api/storeUserHours', (req, res) => {
	if (req.session.userID) {
		let promises = [];

		if(req.body.length > 0) {
			req.body.forEach(hour => {
				promises.push(unavailableHoursQueries.upsertUnavailableHoursInfo(hour, req.session.userID))
			});
		}

		Promise.all(promises).then(() => {
			res.send(true);
		})
		.catch(err => {
			console.log('err', err);
			res.send(false);
		});
	} else {
		res.send(false);
	}

});

router.get('/api/getEvents', (req,res) =>  {
	if (req.session.userID) {
		
		eventQueries.getEvents(req.session.userID)
			.then(events => {
				res.send(events);
			});
	}
});

router.get('/api/getUserInfo', (req,res) =>  {
	if (req.session.userID) {	
		userQueries.getUser(req.session.userID)
			.then(info => {
				res.send(info);
			});
	}
});

router.post('/api/getUserValues', (req,res) =>  {
	if (req.session.userID) {
		if (req.body) {
			const { columns } = req.body;
			userQueries.getUserInfo(columns, req.session.userID)
				.then(info => {
					res.send(info);
				});
		} 
	}
});
  

module.exports = router;



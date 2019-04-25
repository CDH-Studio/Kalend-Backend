let db = require('../index');
let helper = require('../helper');

/**
 * Update Event entity in the database
 * 
 * @param {Object} event object that containts event information
 * @param {String} userid id of the user the event corresponds to
 */
const insertEvent = (event, userid) => {
	let  {summary, category, start, end, recurrence, location, description, created, updated, id} = event;
	let allDay = false;

	if (start.date){
		start.dateTime = new Date(start.date).toISOString();
		end.dateTime = new Date( end.date).toISOString();
		allDay = true;
	} 
	console.log('ID of the event',id );
	return new Promise((resolve, reject) => {
		db.run('INSERT INTO UserEvent(ID,USERID,CATEGORY,START,END,SUMMARY,RECURRENCE,LOCATION,DESCRIPTION,CREATED,UPDATED, ALLDAY) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [ id, 
			userid, 
			category, 
			start.dateTime, 
			end.dateTime,
			summary,
			recurrence,
			location,
			description,
			created,
			updated,
			allDay 
			], function(err) {
			console.log('err', err)
			if (err) reject(err);
			resolve();
		});
	});
}

/**
 * Update Event entity in the database
 * 
 * @param {Array} columns array of strings that represent columns to be updated 
 * @param {Array} values aray of values corresponding to columns to be updated 
 */
const updateEvent = (event) => {

	const {summary, start, end, recurrence, location, description, updated, id, category} = event;
	let allDay = false;
	let columns = ['START', 'END', 'SUMMARY', 'RECURRENCE', 'LOCATION', 'DESCRIPTION', 'UPDATED','ALLDAY']	
	let recrr = (recurrence) ? recurrence[0] : recurrence
	if (start.date){
		start.dateTime = new Date(start.date).toISOString();
		end.dateTime = new Date( end.date).toISOString();
		allDay = true;
	} 
	let values = [start.dateTime, end.dateTime, summary, recrr, location, description, updated, allDay, id];
	if (category) {
		columns = ['START', 'END', 'SUMMARY', 'RECURRENCE', 'LOCATION', 'DESCRIPTION', 'UPDATED','ALLDAY', 'CATEGORY']
		values = [start.dateTime, end.dateTime, summary, recrr, location, description, updated, allDay,category, id]
	}
	let set = helper.arrayToQuerySETString(columns);
	return new Promise((resolve, reject) => {
		db.run( `UPDATE UserEvent SET ${set} WHERE ID = ?`, values, function(err) {
			if (err) reject(err);
			resolve(true);
		  });
	});
}


/**
 * Deactivate Event entity
 * 
 * @param {String} id ID of the Event
 */
const deleteEvent = async (id) => {
	return new Promise( async (resolve, reject) => {
		db.run( `UPDATE UserEvent SET ACTIVE = FALSE WHERE ID = ?`, [id], function(err) {
			if (err) reject(err);
			resolve(true);
		});
	});
}


/**
 * Delete Event entity from the database
 * 
 * @param {String} id ID of the Event
 */
const upsertEvent = async (event) => {
	let {id} = event;
	return new Promise( async (resolve, reject) => {
		getEvent(id)
			.then(row => {
				if (row) {
					updateEvent(event)
						.then(success => resolve(success))
						.catch(err => reject(err));
				} else {
					insertEvent(event, event.userID)
						.then(success => resolve(success))
						.catch(err => reject(err));
				}
			})
			.catch(err => {
				reject(err)
				console.log('err upserting event', err);
			});
	});
}

/**
 * Get Event entity from the database
 * 
 * @param {String} eventID ID of the Event
 */
const getEvent = (eventID) => {
	return new Promise( (resolve, reject) => {
		db.get(`SELECT * FROM UserEvent WHERE ID = ?`,[eventID], (err, rows ) => {
			if(err) reject(err);
			resolve(rows);
		});
	});
}

/**
 * Get all Events for the specific user
 * 
 * @param {String} userID ID of the user
 */
const getEvents = (userID) => {
	return new Promise( (resolve, reject) => {
		db.all(`SELECT * FROM UserEvent WHERE USERID = ? AND ACTIVE = TRUE`,[userID], (err, rows ) => {
			if(err) reject(err);
			resolve(rows);
		});
	});
}

module.exports = {	
	insertEvent,
	updateEvent,
	deleteEvent,
	getEvent,
	getEvents,
	upsertEvent
};
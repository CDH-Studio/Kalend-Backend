let db = require('../index');
/**
 * Update Event entity in the database
 * 
 * @param {Object} event object that containts event information
 * @param {String} userid id of the user the event corresponds to
 */
const insertEvent = (event, userid) => {
	let  {summary,start, end, recurrence, selected} = event;
	let allDay = false;

	if (start.date){
		start.dateTime = new Date(start.date).toISOString();
		end.dateTime = new Date( end.date).toISOString();
		allDay = true;
    } 
    
	return new Promise((resolve, reject) => {
		db.run('INSERT INTO GeneratedCalendars(USERID, START, END, SUMMARY, RECURRENCE, SELECTED, ALLDAY) VALUES (?,?,?,?,?,?)', [ userid, 
			start.dateTime, 
			end.dateTime,
			summary,
            recurrence,
            selected,
			allDay 
			], function(err) {
			console.log('err', err)
			if (err) reject(err);
			resolve();
		});
	});
}

module.exports = {	
	insertEvent
};
let db = require('../index');

const insertEvent = async (event, userid) => {
	const {summary, category, start, end, recurrence, location, description, created, updated, id} = event;

	return new Promise((resolve, reject) => {
        db.run('INSERT INTO UserEvent(ID,USERID,CATEGORY,START,END,SUMMARY,RECURRENCE,LOCATION,DESCRIPTION,CREATED,UPDATED) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [ id, 
            userid, 
            category, 
            start.dateTime, 
            end.dateTime,
            summary,
            recurrence,
            location,
            description,
            created,
            updated 
            ], function(err) {
            console.log('err', err)
            if (err) reject(err);
            resolve();
        });
	});
}

const updateEvent = async (data) => {
    const {id, startDate, endDate, schoolID} = data;
	return new Promise( async (resolve, reject) => {
        db.run( 'UPDATE UserEvent SET start = ?, end = ? WHERE userid = ?', [startDate, endDate, id], function(err) {
           
            if (err) reject(err);
            resolve({startDate, endDate, schoolID});
            console.log(`Row(s) updated: ${this.changes}`);
          });
	});
}

const deleteEvent = async (id) => {
	return new Promise( async (resolve, reject) => {

	});
}

const getEvent = async (id) => {
	return new Promise( (resolve, reject) => {
		db.all(`SELECT * FROM UserEvent WHERE ID = ?`,[id], (err, rows ) => {
            if(err) reject(err);
            resolve(rows);
        });
	});
}

module.exports = {	
	insertEvent,
    updateEvent,
    deleteEvent,
    getEvent
};
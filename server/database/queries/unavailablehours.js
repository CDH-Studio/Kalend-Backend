let db = require('../index');

/**
 * Insert User's semester information for a specific school
 * 
 * @param {Object} data User's school information
 */
const insertUnavailableHoursInfo = (data, userID) => {
	console.log('data', data);
	const {START,END,WEEK,CATEGORY} = data;

	return new Promise((resolve, reject) => {
		db.run('INSERT INTO UnavailableHours(START, END, WEEK, CATEGORY, USERID) VALUES (?,?,?,?,?)', [START, END, WEEK, CATEGORY, userID], function(err) {
			if (err) reject(err);
			resolve(true);
		});
	});
}

/**
 * Insert User's semester information for a specific school
 * 
 * @param {Object} data User's school information
 */
const upsertUnavailableHoursInfo = (data, userID) => {
	return new Promise((resolve, reject) => {
		getUnavailableHoursInfo(data, userID).then(row => {
			if (row) {
				updateUnavailableHoursInfo(data, userID)
					.then(success => resolve(success))
					.catch(err => reject(err));
			} else {
				insertUnavailableHoursInfo(data, userID)
					.then(success => resolve(success))
					.catch(err => reject(err));
			}
		});
	});
}

/**
 * Update User's semester information for a specific school
 * 
 * @param {Object} data User's school information
 */
const updateUnavailableHoursInfo = (data, userID) => {
	const {START, END, WEEK, CATEGORY} = data;
	return new Promise((resolve, reject) => {
		db.run('UPDATE UnavailableHours SET START = ?, END = ? WHERE USERID = ? AND CATEGORY = ? AND WEEK = ?', [START, END, userID, CATEGORY, WEEK], function(err) {
			if (err) reject(err);
			resolve(true);
			console.log(`Row(s) updated: ${this.changes}`);
		  });
	});
}

/**
 * Delete's User's semester information for a specific school
 * 
 * @param {String} id ID of the User the schoolInfo corresponds to
 */
const deleteUnavailableHoursInfo = (id) => {
	return new Promise((resolve, reject) => {

	});
}

/**
 * Get User's Unavailable Hours information
 * 
 * @param {String} id ID of the User the schoolInfo corresponds to
 */
const getUnavailableHoursInfo = (data, userID) => {
	let {CATEGORY, WEEK} = data
	return new Promise( (resolve, reject) => {
		db.get(`SELECT * FROM UnavailableHours WHERE USERID = ? AND CATEGORY = ? AND WEEK = ?`,[userID, CATEGORY, WEEK], (err, row ) => {
			if(err) reject(err);
			resolve(row);
		});
	});
}

module.exports = {	
	getUnavailableHoursInfo,
	updateUnavailableHoursInfo,
	insertUnavailableHoursInfo,
	deleteUnavailableHoursInfo,
	upsertUnavailableHoursInfo
};
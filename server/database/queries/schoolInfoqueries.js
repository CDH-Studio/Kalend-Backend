let db = require('../index');

/**
 * Insert User's semester information for a specific school
 * 
 * @param {Object} data User's school information
 */
const insertSchoolInfo = (data) => {
	const {id, startDate, endDate, schoolID} = data;
	return new Promise((resolve, reject) => {
		db.run('INSERT INTO UserSchoolInfo(USERID, SCHOOLID, START, END) VALUES (?,?,?,?)', [id, schoolID, startDate, endDate], function(err) {
			if (err) reject(err);
			resolve({startDate, endDate, schoolID});
		});
	});
}

/**
 * Update User's semester information for a specific school
 * 
 * @param {Object} data User's school information
 */
const updateSchoolInfo = (data) => {
	const {id, startDate, endDate, schoolID} = data;
	return new Promise((resolve, reject) => {
		db.run('UPDATE UserSchoolInfo SET START = ?, END = ? WHERE USERID = ? AND SCHOOLID = ?', [startDate, endDate, id, schoolID], function(err) {
			if (err) reject(err);
			resolve({startDate, endDate, schoolID});
			console.log(`Row(s) updated: ${this.changes}`);
		  });
	});
}

/**
 * Delete's User's semester information for a specific school
 * 
 * @param {String} id ID of the User the schoolInfo corresponds to
 * @param {String} schoolID ID of the school which is a foreign key for School table
 */
const deleteSchoolInfo = (id, schoolID) => {
	return new Promise((resolve, reject) => {

	});
}

/**
 * Get User's semester information for a specific school
 * 
 * @param {String} id ID of the User the schoolInfo corresponds to
 * @param {String} schoolID ID of the school which is a foreign key for School table
 */
const getSchoolInfo = (id, schoolID) => {
	return new Promise( (resolve, reject) => {
		db.all(`SELECT * FROM UserSchoolInfo WHERE USERID = ? AND SCHOOLID = ?`,[id, schoolID], (err, rows ) => {
			if(err) reject(err);
			resolve(rows);
		});
	});
}

module.exports = {	
	getSchoolInfo,
	insertSchoolInfo,
	updateSchoolInfo
};
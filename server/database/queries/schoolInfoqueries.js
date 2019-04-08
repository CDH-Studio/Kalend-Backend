let db = require('../index');

const insertSchoolInfo = async (data) => {
	const {id, startDate, endDate, schoolID} = data;

	return new Promise((resolve, reject) => {
		db.run('INSERT INTO UserSchoolInfo VALUES (?,?,?,?)', [id, schoolID, startDate, endDate], function(err) {
            if (err) reject(err);
            resolve({startDate, endDate, schoolID});
        });
	});
}

const updateSchoolInfo = async (data) => {
    const {id, startDate, endDate, schoolID} = data;
	return new Promise( async (resolve, reject) => {
        db.run( 'UPDATE UserSchoolInfo SET start = ?, end = ? WHERE userid = ?', [startDate, endDate, id], function(err) {
            if (err) reject(err);
            resolve({startDate, endDate, schoolID});
            console.log(`Row(s) updated: ${this.changes}`);
          });
	});
}

const deleteSchoolInfo = async (id) => {
	return new Promise( async (resolve, reject) => {

	});
}

const getSchoolInfo = async (id, schoolID) => {
	return new Promise( (resolve, reject) => {
		db.all(`SELECT USERID FROM UserSchoolInfo WHERE USERID = ? AND SCHOOLID = ?`,[id, schoolID], (err, rows ) => {
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
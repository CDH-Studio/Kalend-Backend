let db = require('../index');
let helper = require('../helper');

const insertUser = async (data) => {
	const {id, email, name, serverAuthCode} = data;

	return new Promise((resolve, reject) => {
		db.run('INSERT INTO USER(ID, EMAIL, FULLNAME, SERVERAUTHCODE) VALUES(?,?,?,?)', [id , email, name, serverAuthCode], (err) => {
			if (err) reject(err);
			resolve(id);
		});
	});
}

const updateUser = async (columns,values) => {
	const set = helper.arrayToSetQueryString(columns);	
	console.log('set', set);

	return new Promise( async (resolve, reject) => {
		db.run( `UPDATE USER SET ${set} WHERE ID = ?`, values, function(err) {
            if (err) reject(err);
            resolve();
            console.log(`Row(s) updated: ${this.changes}`);
          });
	});
}

const deleteUser = async (id) => {
	return new Promise( async (resolve, reject) => {

	});
}

const getUser = async (id) => {
	return new Promise( (resolve, reject) => {
		db.all(`SELECT ID FROM User WHERE ID = ?`,[id], (err, rows ) => {
			if(err) reject(err);
			resolve(rows);
		});
	});
}

module.exports = {	
	insertUser,
	getUser,
	updateUser
};
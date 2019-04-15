import { insertAccessRule } from '../services/googleCalendar'; 

/**
 * Function called in compare schedule
 * 
 * @param {Strings} email The email of the person that will see the user's calendar
 * @param {Strings} calendarID user's calendarID
 */
export const addPermissionPerson = (email, calendarID, accesstoken) => {
	let data = {
		'role': 'freeBusyReader',
		'scope': {
			'type': 'user',
			'value': email
		}
	};

	return new Promise((resolve, reject) => {
		insertAccessRule(calendarID, {ACCESSTOKEN: accesstoken, info:data}, {sendNotifications: false}).then(data => {
			if (data.error)  reject('Cannot add that person');
			resolve(data);
		});
	});
};

module.exports = { 
	addPermissionPerson
};

const request = require('request');

let apiHelperCall = (URL, method, data) => {
    let fetch = request.get;

	let fetchData = {
		url: URL,
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + data.ACCESSTOKEN,
			'Content-Type': 'application/json',
		}
	};

	if (method == 'POST') {
        fetchData.body = JSON.stringify(data.info);
        fetch = request.post
    }

	return  new Promise((resolve) => {
        fetch(fetchData, (error, response, body) => {
            resolve(JSON.parse(body));
        });
    });
};


/**
 * Returns a list of events for the specified calendar
 * https://developers.google.com/calendar/v3/reference/events/list
 * 
 * @param {String} calendarId The calendar identifier
 * @param {Object} data The JSON object containing the optinal information for the API
 * @param {Object} query Query parameter object to be appended to the URL
 * 
 * @returns {Promise} A promise containing an object with the information of every events in the specified calendar
 */
let listEvents = (calendarId, data, query) => {
	return apiHelperCall('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events', 'GET', data, query);
};


module.exports = { 
    listEvents
};
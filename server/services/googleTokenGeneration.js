var request = require("request");
const client_secret = require("../client-secret")

/**
 * Gets a new accessToken and a refreshToken (if we didn't get one yet) from the serverAuthToken
 * 
 * @param {String} code The serverAuthCode which would be sent by the client
 */
function serverAuthentication(code) {
	var data = {
		code,
		client_secret: client_secret.CLIENT_SECRET,
		client_id: client_secret.CLIENT_ID,
		grant_type: "authorization_code",
		redirect_uri: "http://localhost"
	};

	makeRequest(data);
}

/**
 * Gets a new accessToken from the refreshToken
 * 
 * @param {String} refresh_token The refreshToken of the user
 */
function getNewAccessToken(refresh_token) {
	var data = {
		client_secret: client_secret.CLIENT_SECRET,
		client_id: client_secret.CLIENT_ID,
		refresh_token,
		grant_type: "refresh_token"
	};

	makeRequest(data);
}

/**
 * Calls Google's server to get information about the accessToken and/or refreshToken
 * 
 * @param {Object} data The data to be sent to Google
 */
function makeRequest(data) {
	request({
			url: "https://www.googleapis.com/oauth2/v4/token" + getQueryParam(data),
			method: "POST"
		},
		function(error, response, body) {
			if (error || response.statusCode !== 200) {
				return updateDatabase(error || {statusCode: response.statusCode});
			}
			updateDatabase(null, JSON.parse(body));
		}
	);
}

/**
 * Updates the database according to the data sent back from Google's server
 * 
 * @param {Object} error Describes the error of the request call
 * @param {Object} data The data that was sent from the server
 */
function updateDatabase(error, data) {
	if (error) {
		console.log(error);
	} else {
		// Update database
		console.log(data);
	}
}

/**
 * Returns a string that is appendable to a URL
 * 
 * @param {Object} query Query parameter object to be appended to the URL
 * @returns {String} A parameter string to be appended to a URL
 */
function getQueryParam(query) {
	let text = "?";
	let keys = Object.keys(query);

	for (let i = 0; i < keys.length; i++) {
		text += keys[i] + "=" + query[keys[i]] + "&";
	}

	return text.substr(0, text.length - 1);
}

// Exports the two functions to be called outside this file
module.exports = [
	getNewAccessToken,
	serverAuthentication
];
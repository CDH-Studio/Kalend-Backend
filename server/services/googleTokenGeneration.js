const request = require("request");
const client_secret = require("../config/client-secret");

/**
 * Gets a new accessToken and a refreshToken (if we didn't get one yet) from the serverAuthToken
 * 
 * @param {String} code The serverAuthCode which would be sent by the client
 */
let serverAuthentication = (code) => {
	let data = {
		code,
		client_secret: client_secret.CLIENT_SECRET,
		client_id: client_secret.CLIENT_ID,
		grant_type: "authorization_code",
		redirect_uri: "http://localhost",
		access_type: 'offline'
	};
	return makeRequest(data);
}

/**
 * Gets a new accessToken from the refreshToken
 * 
 * @param {String} refresh_token The refreshToken of the user
 */
let getNewAccessToken = (refresh_token) => {
	let data = {
		client_secret: client_secret.CLIENT_SECRET,
		client_id: client_secret.CLIENT_ID,
		refresh_token,
		grant_type: "refresh_token"
	};
	
	return makeRequest(data);
}

/**
 * Calls Google's server to get information about the accessToken and/or refreshToken
 * 
 * @param {Object} data The data to be sent to Google
 */
let makeRequest = (data) => {
	return new Promise(function(resolve, reject){
		request({
			url: "https://www.googleapis.com/oauth2/v4/token" + getQueryParam(data),
			method: "POST"
		},
			function(error, response, body) {
			
				if (error || response.statusCode !== 200) {
					reject(error);
				}
				resolve(JSON.parse(body));
			}
		);
	});	
}

/**
 * Returns a string that is appendable to a URL
 * 
 * @param {Object} query Query parameter object to be appended to the URL
 * @returns {String} A parameter string to be appended to a URL
 */
let getQueryParam = (query) => {
	let text = "?";
	let keys = Object.keys(query);

	for (let i = 0; i < keys.length; i++) {
		text += keys[i] + "=" + query[keys[i]] + "&";
	}

	return text.substr(0, text.length - 1);
}

// Exports the two functions to be called outside this file
module.exports = {
	getNewAccessToken,
	serverAuthentication
};
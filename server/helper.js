const calendarCalls = require('./services/googleCalendar'); 
const userQueries =  require('./database/queries/userqueries');
const eventsQueries =  require('./database/queries/eventsqueries');
const tokenGenerator = require('./services/googleTokenGeneration');

const updateUsersData = () => {
    userQueries.getUsers()
        .then(users => {    
            users.forEach(async (user) => {
                let { CALENDARID, ID, REFRESHTOKEN, ACCESSTOKEN} = user;

                if (REFRESHTOKEN) {
                    ACCESSTOKEN = await updateUsersAccessToken({REFRESHTOKEN, ID});
                } 
                if (CALENDARID) {
                    
                    calendarCalls.listEvents(CALENDARID, {ACCESSTOKEN})
                        .then( body => {
                            if (body.error) return;

                            body.items.forEach(event => {
                                event.userID = ID;
                                eventsQueries.upsertEvent(event)
                            });
                        })
                        .catch(err => {
                            console.log('err grabbing events', err)
                        });
                };
            });
        })
        .catch(err => {
            console.log('err updating all users data', err);
        });
}

const updateUsersAccessToken = async (data) => {
    let {REFRESHTOKEN, ID} = data;
    return new Promise( (resolve, reject) => {
        tokenGenerator.getNewAccessToken(REFRESHTOKEN)
            .then(tokenData => {
                let {access_token} = tokenData;
                userQueries.updateUser(['ACCESSTOKEN'],[access_token, ID]);
                resolve(access_token);
            })
            .catch(err => {
                console.log('err getting new Accesstoken using refresh token');
                reject(err);
            });
    });
}

module.exports = {
    updateUsersData
}
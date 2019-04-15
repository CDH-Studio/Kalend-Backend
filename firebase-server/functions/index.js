const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
// const sendNotification = require('./helper');


// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('notifications/105488615070892327566').push({'newewew': 'works'}).then((snapshot) => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      return res.redirect(303, snapshot.ref.toString());
    });
  });


exports.sendNotification = functions.database.ref('notifications/{id}/{messageId}/')
    .onWrite((change, context) => {

       
         // Grab the current value of what was written to the Realtime Database
        const writtenContent = change.after.val();
        let messageID  = context.params.messageId;
        const userID = context.params.id;
        let data;
        
        if('name' in writtenContent) data = writtenContent;
        else data = writtenContent[messageID]
        
        var options = {
          priority: "high",
        };
        const payload = {
            data: {
                title: `Sharing Request`,
                body: `${data.name} would like to share calendars with you`  
            }
        }
        return admin.messaging().sendToTopic(userID, payload, options)
          
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });






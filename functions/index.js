
var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

var serviceAccount = require("./pwagram");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://pwagram-f75be.firebaseio.com/'
});

exports.storePostData = functions.https.onRequest(function (request, response) {
    cors(request, response, function () {
        admin.database().ref('posts').push({
            id: request.body.id,
            title: request.body.title,
            location: request.body.location,
            image: request.body.image
        })
            .then(function () {
                webpush.setVapidDetails('mailto:maniksharma98144@gmail.com.com', 'BOTabUk2Wn6meHPVPgy1v7e56O1Mgf06PvzgM-5XdIi-olxCWPIf3j1GmlknPk5Ixv7IvwHQqTxD1WsTVZLAchM', 'ZcD8ctn0gzif35Lek-CacM1Ahq4LpgJfFDDnUAwtIos');
                return admin.database().ref('subscriptions').once('value');
            })
            .then(function (subscriptions) {
                subscriptions.forEach(function (sub) {
                    var pushConfig = {
                        endpoint: sub.val().endpoint,
                        keys: {
                            auth: sub.val().keys.auth,
                            p256dh: sub.val().keys.p256dh
                        }
                    };

                    webpush.sendNotification(pushConfig, JSON.stringify({
                        title: 'New Post',
                        content: 'New Post added!',
                        openUrl: '/help'
                    }))
                        .catch(function (err) {
                            console.log(err);
                        })
                });
                response.status(201).json({ message: 'Data stored', id: request.body.id });
            })
            .catch(function (err) {
                response.status(500).json({ error: err });
            });
    });
});

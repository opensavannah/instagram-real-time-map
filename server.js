"use strict";

var express = require("express");
var app = express();
var io = require('socket.io').listen(app.listen(port));
var Instagram = require('instagram-node-lib');
var nodeEnv = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 5000;

// Replace the ngrok url with your local ngrok URL, see README.md
var url = (env === 'development') ? 'http://localhost:' + port : 'https://instagram-real-time-map.herokuapp.com';

console.log(process.env.NODE_ENV);

/**
 * Configuration
 */

// Instagram
var clientID = '07ad147eeab64e43a8fde7b7d715e170',
    clientSecret = 'e03b2ce737bb4c759461ff7aca022688';



/**
 * Server
 */

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.errorHandler());

    if ('development' === env) {
    	app.use(express.static(__dirname + '/app'));
    	app.use(express.static(__dirname + '/.tmp'));
    } else {
    	app.use(express.static(__dirname + '/dist'));
    }

});

console.log("Listening on " + url);


/**
 * Render your index/view "my choice was not use jade"
 */
// app.get("/views", function(req, res){
    // res.render("index");
// });


// Socket.io on Heroku https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
// io.configure(function () {
//   io.set("transports", [
//     'websocket'
//     , 'xhr-polling'
//     , 'flashsocket'
//     , 'htmlfile'
//     , 'jsonp-polling'
//     ]);
//   io.set("polling duration", 10);
// });


// check subscriptions
// https://api.instagram.com/v1/subscriptions?client_secret=YOUR_CLIENT_ID&client_id=YOUR_CLIENT_SECRET

// First connection
io.sockets.on('connection', function (socket) {
	Instagram.tags.recent({
		name: 'awesome',
		complete: function(data) {
			socket.emit('initialAdd', { initialAdd: data });
		}
	});
});

/**
 * Needed to receive the handshake
 */
app.get('/callback', function(req, res){
    var handshake =  Instagram.subscriptions.handshake(req, res);
});

/**
 * for each new post Instagram send us the data
 */
app.post('/callback', function(req, res) {
    var data = req.body;

    // Grab the hashtag "tag.object_id"
    // concatenate to the url and send as a argument to the client side
    data.forEach(function(tag) {
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+clientID;
      sendMessage(url);

    });
    res.end();
});

/**
 * Send the url with the hashtag to the client side
 * to do the ajax call based on the url
 * @param  {[string]} url [the url as string with the hashtag]
 */
function sendMessage(url) {
  io.sockets.emit('add', { add: url });
}




/**
 * Set the configuration
 */
Instagram.set('client_id', clientID);
Instagram.set('client_secret', clientSecret);
Instagram.set('callback_url', url + '/callback');
Instagram.set('redirect_uri', url);
Instagram.set('maxSockets', 10);

/**
 * Uses the library "instagram-node-lib" to Subscribe to the Instagram API Real Time
 * with the tag "hashtag" lollapalooza
 * @type {String}
 */
Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'awesome',
  aspect: 'media',
  callback_url: url + '/callback',
  type: 'subscription',
  id: '#'
});

/**
 * Uses the library "instagram-node-lib" to Subscribe to the Instagram API Real Time
 * with the tag "hashtag" lollapalooza2013
 * @type {String}
 */
Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'awesome',
  aspect: 'media',
  callback_url: url + '/callback',
  type: 'subscription',
  id: '#'
});

/**
 * Uses the library "instagram-node-lib" to Subscribe to the Instagram API Real Time
 * with the tag "hashtag" lolla2013
 * @type {String}
 */
Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'awesome',
  aspect: 'media',
  callback_url: url +'/callback',
  type: 'subscription',
  id: '#'
});


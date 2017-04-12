var secret = require('./secret.js');

var Twit = require('twit');
const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');
const FormData = require("form-data");

const server = new Hapi.Server({
	connections: {
		routes: {
			files: {
				relativeTo: Path.join(__dirname, 'public')
			}
		}
	}
});

server.connection({
	port: (process.env.PORT || 3000)
});

server.register([Blipp, Inert, Vision], () => {});

server.views({
	engines: {
		html: Handlebars
	},
	path: 'views',
	layoutPath: 'views/layout',
	layout: 'layout',
	helpersPath: 'views/helpers'
});

var client = new Twit({
	consumer_key: secret.consumer_key,
	consumer_secret: secret["consumer_secret"],
	access_token: secret["access_token"],
	access_token_secret: secret["access_token_secret"]
});

//routes

server.route({
	method: 'GET',
	path: '/user/{user_name}',
	handler: function (request, reply) {
		var userName = encodeURIComponent(request.params.user_name);
		console.log(userName);
		
		var userName = 'from:' + encodeURIComponent(request.params.user_name);
		console.log(userName);
		
		var tweetString = [];

		client.get('search/tweets', {
			//geocode: "25.719056,-80.276869,1mi",
			q: userName,
			count: 100
		}, function (err, tweets, response) {
			
			var tLength = tweets.statuses.length;
			var userTweets = tweets["statuses"];
			
			var string = "number of tweets: " + tLength;
			tweetString.push(string);
			tweetString.push("");

			for (var i = 0; i < tLength; i++) {
				tweetString.push(userTweets[i]["text"]);
				tweetString.push('<a href="https://twitter.com/' + userTweets[i]["user"]["screen_name"] + '">@' + userTweets[i]["user"]["screen_name"] + '</a>');
				tweetString.push(userTweets[i]["created_at"]);
				tweetString.push("");
			}
			
			//Generates tempo between 180 and 120 based on number of tweets in the last week
			var tempo = ((tLength) / 100) * (180 - 120) + 120;
			console.log('tempo: ' + tempo);

			reply.view('tweets', {
				tweetString: tweetString,
				tweetsAmount: tLength,
				tempo: tempo
			});
		});
	}
});

server.route({
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: './',
			listing: false,
			index: false
		}
	}
});


server.start((err) => {

	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);

	
});

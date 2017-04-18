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
	path: '/',
	handler: {
		view: 'index'
	}
});

server.route({
	method: 'POST',
	path: '/form',
	handler: function (request, reply) {
		var payload = request.payload;
	
		reply().redirect('/user/' + payload.userName);
	}
});

server.route({
	method: 'GET',
	path: '/user/{user_name}',
	handler: function (request, reply) {		
		var userName = 'from:' + encodeURIComponent(request.params.user_name);
		
		var tweetString = [];

		client.get('search/tweets', {
			//geocode: "25.719056,-80.276869,1mi",
			q: userName,
			count: 100
		}, function (err, tweets, response) {
			var factor1 = 0,
				factor2 = 0;
			var factor3 = tweets.statuses[0].user.followers_count;
			
			//grab information from user tweets to randomize melody
			for (tweet of tweets.statuses) {				
				factor1 += tweet.id;
				
				factor2 += tweet.entities.hashtags.length;
				factor2 += tweet.entities.symbols.length;
				factor2 += tweet.entities.user_mentions.length;
				factor2 += tweet.entities.urls.length;
			}
			
			//reduce the follower count into a manageable number of notes, so as not to go crashing anyones laptop	
			factor3 = factor3 / (Math.pow(10, (factor3.toString().length - 2)));
						
			console.log('f1: ' + factor1);
			console.log('f2: ' + factor2);
			console.log('f3: ' + factor3);
			
			factor2 = factor1 / factor2;
			factor3 = factor2 / factor3;
			
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
				tempo: tempo,
				factor1: factor1,
				factor2: factor2,
				factor3: factor3
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

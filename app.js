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
	handler: function (request, reply) {
		var tweetString = [];

		client.get('search/tweets', {
			//geocode: "25.719056,-80.276869,1mi",
			q: 'from:realdonaldtrump',
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

			reply.view('index', {
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


/*
client.get('search/tweets', {
    q: 'node.js',
    count: "1"
}, function (error, tweets, response) {

    //console.log(tweets.statuses);
    console.log(tweets["statuses"][0]["text"]);
    console.log(tweets["statuses"][0]["user"]["screen_name"]);
    console.log(tweets["statuses"][0]["user"]["url"]);
    //console.log(tweets["statuses"][0]["user"]);


});
*/

//search for 5 movie tweets not scary with positive attitude


//var count = 5;
//client.get('search/tweets', {
//    q: 'phil collins',
//    count: count
//}, function (error, tweets, response) {
//
//    for (var i = 0; i < count; i++) {
//        console.log(tweets["statuses"][i]["text"]);
//        console.log(tweets["statuses"][i]["user"]["screen_name"]);
//        console.log(tweets["statuses"][i]["user"]["url"]);
//        console.log(tweets["statuses"][i]["created_at"]);
//        console.log("");
//    }
//
//});


//Finding tweets based off of geo location

//client.get('search/tweets', {
//    q: 'trump',
//    geocode: "25.719056,-80.276869,1mi"
//}, function (error, tweets, response) {
//
//    for (var i = 0; i < tweets["statuses"].length; i++) {
//        console.log(tweets["statuses"][i]["text"]);
//        console.log(tweets["statuses"][i]["user"]["screen_name"]);
//        console.log(tweets["statuses"][i]["user"]["url"]);
//        console.log(tweets["statuses"][i]["user"]["created_at"]);
//        console.log("");
//    }
//});




//Finding tweets based off of  date

/*
client.get('search/tweets', {
    q: 'banana since:2016-04-02'
}, function (err, tweets, response) {

    console.log("number of tweets: " + tweets["statuses"].length);
    for (var i = 0; i < tweets["statuses"].length; i++) {
        console.log(tweets["statuses"][i]["text"]);
        console.log(tweets["statuses"][i]["user"]["screen_name"]);
        console.log(tweets["statuses"][i]["user"]["url"]);
        console.log(tweets["statuses"][i]["user"]["created_at"]);
        console.log("");
    }
})
*/

////Finding tweets based off of geo location and date

//client.get('search/tweets', {
//    q: ' since:2017-03-01',
//    geocode: "25.719056,-80.276869,1mi"
//}, function (err, tweets, response) {
//
//    console.log("number of tweets: " + tweets["statuses"].length);
//    for (var i = 0; i < tweets["statuses"].length; i++) {
//        console.log(tweets["statuses"][i]["text"]);
//        console.log(tweets["statuses"][i]["user"]["screen_name"]);
//        console.log(tweets["statuses"][i]["user"]["url"]);
//        console.log(tweets["statuses"][i]["user"]["created_at"]);
//        console.log("");
//    }
//});


server.start((err) => {

	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);

	
});

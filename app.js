var secret = require('./secret.js');

var Twit = require('twit');


var client = new Twit({
    consumer_key: secret.consumer_key,
    consumer_secret: secret["consumer_secret"],
    access_token: secret["access_token"],
    access_token_secret: secret["access_token_secret"]
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


client.get('search/tweets', {
    q: ' since:2017-03-01',
    geocode: "25.719056,-80.276869,1mi"
}, function (err, tweets, response) {

    console.log("number of tweets: " + tweets["statuses"].length);
    for (var i = 0; i < tweets["statuses"].length; i++) {
        console.log(tweets["statuses"][i]["text"]);
        console.log(tweets["statuses"][i]["user"]["screen_name"]);
        console.log(tweets["statuses"][i]["user"]["url"]);
        console.log(tweets["statuses"][i]["user"]["created_at"]);
        console.log("");
    }
});



const Handlebars = require('handlebars');

Handlebars.registerHelper('tweets', function (context, options) {
	var ret = "";
	var parsing = context;

	for (tweet in parsing) {
		var wordHTML = parsing[tweet] + '</br>';
		ret += wordHTML;
	}

	return ret;
});

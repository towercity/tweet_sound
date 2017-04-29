const Handlebars = require('handlebars');

Handlebars.registerHelper('toArray', function (context, options) {
	var ret = "[";
	var parsing = context;

	for (note in parsing) {
		var wordHTML = "'" + parsing[note] + "',";
		ret += wordHTML;
	}
	
	ret += '];';

	return ret;
});

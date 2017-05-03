# Tweet_Sound

This app looks at all of a twitter user's tweets from the last week (limited to the most recent 100) and generates a short musical composition based on them.

## How to use

On the front page, simply type in the twitter hand you would like to hear and press enter. A page with a list of the user's most reent tweets will load, and the song generated from their tweets will play.

## How it works

The song is generated from a number of variables.

First, the tempo comes from the number of tweets the user has made in the last week, using `((nuber_of_tweets) / 100) * (180 - 120) + 120` to keep the tempo within the range of 120 to 180 beats per minute.

Second, each tweet from the last week creates a note, and the notes are played in order.

The following function generates note lenghts based on tweet lenghts:

	gatherNoteLengths: function (lenghtsArray) {
		var notesArray = [];

		lenghtsArray.forEach(function (length) {
			if (length >= 120) {
				notesArray.push('4n');
			} else if (120 > length && length >= 90) {
				notesArray.push('8n');
			} else if (90 > length && length >= 60) {
				notesArray.push('16n');
			} else if (60 > length && length >= 30) {
				notesArray.push('32n');
			} else if (length >= 0) {
				notesArray.push('64n');
			}
		});

		return notesArray;
	}
	
A short tweet will produce a sixty-fourth note, while a long tweet will produce a quarter note.

Later, the note tones are generated based on each tweet's unique tweet id.

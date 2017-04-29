module.exports = {
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
	},

	scale: ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4',
		    'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5',
		    'G5'],

	findNote: function(factor) {
		return this.scale[factor % this.scale.length];
	},
	
	createMelody: function (length) {
		var melody = [];
		for (i = length; i > 0; i--) {
			melody.push(this.scale[i % this.scale.length]);
		}

		return melody;
	}
}

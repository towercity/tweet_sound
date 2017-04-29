function initSong(tempo, factor1, factor2, factor3) {
	var startTime = 0;
	var startTime = '8m';

	Tone.Transport.bpm.value = tempo;
	Tone.Transport.timeSignature = [4, 4];

	var merge = new Tone.Merge();
	var improvs = new Tone.Merge();

	var reverb = new Tone.Freeverb({
		"roomSize": 0.4,
		"wet": 0.5
	});
	
	var improverb = new Tone.Freeverb({
		"roomSize": 0.8,
		"wet": 0.2
	});

	merge.chain(reverb, Tone.Master);
	improvs.chain(improverb, Tone.Master);

	//Kick drum
	var kick = new Tone.MembraneSynth({
		"envelope": {
			"sustain": 0,
			"attack": 0.02,
			"decay": 0.8
		},
		"octaves": 10
	}).toMaster();

	var kickPart = new Tone.Loop(function (time) {
		kick.triggerAttackRelease("C2", "8n", time);
	}, "4n").start(startTime);

	//Bass 
	var bass = new Tone.MonoSynth({
		"volume": -10,
		"envelope": {
			"attack": 1,
			"decay": 0.3,
			"release": 2,
		},
		"filterEnvelope": {
			"attack": 0.001,
			"decay": 0.01,
			"sustain": 0.5,
			"baseFrequency": 200,
			"octaves": 2.6
		}
	}).toMaster();

	var bassPart = new Tone.Sequence(function (time, note) {
		bass.triggerAttackRelease(note, "4n", time);
	}, ['G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2', 'G2',
	    'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2', 'C2']).start(startTime);
	//bassPart.probability = 0.9;

	//Mids polysynth
	var mids = new Tone.PolySynth(2, Tone.AMSynth, {
		"volume": 0,
		"envelope": {
			"attack": 0.5,
			"decay": 1,
			"release": 2,
		},
	}).connect(merge.left);

	var gChord = ['G3', 'B3'];
	var cChord = ['C4', 'E4'];

	var midsPart = new Tone.Sequence(function (time, chord) {
		mids.triggerAttackRelease(chord, '4m', time);
	}, [gChord, cChord]).start(startTime);
	midsPart.probability = 0.9;

	//root notes
	var root = new Tone.FMSynth({
		"volume": -8,
		"harmonicity": 7,
		"envelope": {
			"attack": 0.5,
			"decay": 1,
			"sustain": 2,
		},
	}).connect(merge.right);

	var rootPart = new Tone.Sequence(function (time, note) {
		root.triggerAttackRelease(note, '4m', time);
	}, ['G4', 'C4'], '4m').start(startTime);

	//parasite arpegios
	var arp = new Tone.FMSynth({
		"volume": -8,
		"harmonicity": 2,
		"envelope": {
			"attack": 0.5,
			"decay": 1,
			"sustain": 2,
		},
	}).toMaster();

	var arpPart = new Tone.Sequence(function (time, note) {
		arp.triggerAttackRelease(note, '1m', time);
	}, ['G3', ['D5', 'B4', 'D4', 'D4'],
		'D4', ['D5', 'B4', 'D4', 'D4'],
		'D4', ['D5', 'B4', 'E4', 'E4'],
		'E4', ['D5', 'B4', 'E4', 'E4']], '1m').start(startTime);


	//improv synth
	var improvSynthLeft = new Tone.MonoSynth({
		"volume": -1,
		"envelope": {
			"attack": 0.7,
			"decay": 1,
			"release": 2,
		},
	}).connect(improvs.left);
	
	var improvPartLeft = new Tone.Sequence(function (time, note) {
		improvSynthLeft.triggerAttackRelease(note, '8n', time);
	}, scale.createMelody(factor1, factor2), '4n').start(0);
	improvPartLeft.humanize = true;
	
	var improvSynthRight = new Tone.MonoSynth({
		"volume": -1,
		"envelope": {
			"attack": 0.7,
			"decay": 1,
			"release": 2,
		},
	}).connect(improvs.right);
	
	var improvPartRight = new Tone.Sequence(function (time, note) {
		improvSynthRight.triggerAttackRelease(note, '8n', time);
	}, scale.createMelody(factor2, factor3), '4n').start(0);
	improvPartRight.humanize = true;
};

function playPause() {
	console.log('1: ' + Tone.Transport.state);
	if(Tone.Transport.state === 'started') {
		Tone.Transport.pause();
	} else if (Tone.Transport.state === 'paused') {
		Tone.Transport.start();
	}
	console.log('2: ' + Tone.Transport.state);
}

function playNotes (synth, notes, melody) {
	var delay = '1n';
	
	for (i in notes) {
		synth.triggerAttackRelease(melody[i], notes[i], delay);
		
		delay += ' + ';
		delay += notes[i];
	}
}


// use rests in the array?? see if TONE.JS has a rest option, then base it off remainders(?)
// OR: one individual tweet makes ne individual note (???)
// Is there a way to change note lenghts? via tweet length
// ratios: mentions/total posts, 
// multiple set songs to build off (??) (too much?)

// Do some tone changes PRE song play? change init funtion and render function

// a --> z, 26 notes: songify a tweet very basically, other figures are rests or sounds

//use an object to pulls sounds by key values rather than array indexes--will work good some instances (eg a-->z style)
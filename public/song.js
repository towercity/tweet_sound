function initSong(tempo) {
	var startTime = 0;
	//var startTime = '8m';

	Tone.Transport.bpm.value = tempo;
	Tone.Transport.timeSignature = [4, 4];

	var merge = new Tone.Merge();

	var reverb = new Tone.Freeverb({
		"roomSize": 0.4,
		"wet": 0.5
	});

	merge.chain(reverb, Tone.Master);

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
};
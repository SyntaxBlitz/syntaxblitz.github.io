window.onload = function () {
	document.getElementById("loadingDiv").style.display = "none";
	
	var audio = {
		highClick: document.getElementById("audio_highClick"),
		lowClick: document.getElementById("audio_lowClick"),
		subClick: document.getElementById("audio_subClick")
	};

	var playing = false;
	var currentMeasure = 0;
	var eighthsCounted = 0;
	var nextEighthTimestamp = 0;
	var subdivide = false;

	var bpm = 120;

	var startPlaying = function () {
		playing = true;
		document.getElementById("startStopButton").innerText = "Stop!";

		// TODO: set eighthsCounted to a negative number if the person wants a countoff.
		nextEighthTimestamp = Date.now();
	};

	var stopPlaying = function () {
		playing = false;
		eighthsCounted = 0;
		document.getElementById("startStopButton").innerText = "Start!";
		document.getElementById("beatString").innerText = "";
	};
	
	var setSubdivide = function (value) {
		subdivide = value;
	};

	var getSubdivide = function () {
		return subdivide;
	};

	var setTempo = function (t) {
		bpm = t;
	};

	var getTempo = function () {
		return bpm;
	}

	var tick = function () {
		if (!playing) return;

		if (Date.now() >= nextEighthTimestamp)	{
			nextEighthTimestamp += (60 / (bpm * 2)) * 1000;	// we multiply bpm by two because this is eighth notes
			eighthsCounted += 1;

			manageEighths();
		}
	};

	var manageEighths = function () {
		document.getElementById("currentMeasureNumber").value = (currentMeasure + 1);
		var string44 = "1+2+3+4+";
		var string78 = "1+2+123";

		var beatStringDiv = document.getElementById("beatString");

		if (measures[currentMeasure]) {	// 4/4
			if (eighthsCounted == 1) {
				audio.highClick.play();
			} else if (eighthsCounted % 2 == 1) {
				audio.lowClick.play();
			} else if (subdivide) {
				audio.subClick.play();
			}

			beatStringDiv.innerText = string44.substr(0, eighthsCounted);	// php-style substr

			if (eighthsCounted == 8) {
				currentMeasure++;
				eighthsCounted = 0;
			}
		} else {	// 7/8
			if (eighthsCounted == 1) {
				audio.highClick.play();
			} else if (eighthsCounted == 3 || eighthsCounted == 5) {	// no regrets
				audio.lowClick.play();
			} else if (subdivide) {
				audio.subClick.play();
			}

			beatStringDiv.innerText = string78.substr(0, eighthsCounted);	// php-style substr

			if (eighthsCounted == 7) {
				currentMeasure++;
				eighthsCounted = 0;
			}
		}

		if (currentMeasure > 209 - 1) stopPlaying();	// off-by-one because there are 209 measures in the piece but the last measure is at index 208

		// TODO: allow pure alternating 4/4 and 7/8 without tracking measures.
	}

	window.setInterval(tick, 10);

	document.getElementById("startStopButton").onclick = function () {
		if (playing) {
			stopPlaying();
		} else {
			startPlaying();
		}
	};

	document.getElementById("subdivideButton").onclick = function () {
		if (getSubdivide()) {
			setSubdivide(false);
			this.innerText = "Turn subdivision on";
		} else {
			setSubdivide(true);
			this.innerText = "Turn subdivision off";
		}
	};

	var bpmSlider = document.getElementById("bpmSlider");
	var bpmNumber = document.getElementById("bpmNumber");

	bpmSlider.onmousemove = bpmSlider.onchange = function () {
		setTempo(this.value);
		bpmNumber.value = this.value;
	};

	bpmNumber.onchange = function () {
		setTempo(this.value);
		bpmSlider.value = this.value;
	};

	document.getElementById("currentMeasureNumber").onchange = function () {
		stopPlaying();
		if (rehearsalMarkings[this.value] === undefined) {
			currentMeasure = +this.value - 1;
		} else {
			currentMeasure = rehearsalMarkings[this.value] - 1;
		}
	}
};
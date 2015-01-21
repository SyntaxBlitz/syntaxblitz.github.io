window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioSoundBuffers = {
	"highClick": null,
	"lowClick":  null,
	"subClick":  null
};

var context = new AudioContext();

var setupSlider = function () {
	var bpmSlider = document.getElementById("bpmSlider");
	var bpmEntry  = document.getElementById("bpmEntry");
	bpmSlider.onchange = bpmSlider.onmousemove = function () {
		bpmEntry.value = bpmSlider.value;
	};

	bpmEntry.onchange = bpmEntry.onkeyup = bpmEntry.onclick = function () {
		bpmSlider.value = bpmEntry.value;
	};
};

var loadBufferedSounds = function (callback) {
	TOTAL_SOUNDS = 3;
	loaded       = 0;

	[["highClick", "audio/highClick.wav"],
		["lowClick", "audio/lowClick.wav"],
		["subClick", "audio/subClick.wav"]].forEach(function (click) {
		var request = new XMLHttpRequest();
		request.open("GET", click[1], true);
		request.responseType = "arraybuffer";

		request.onload = function () {
			context.decodeAudioData(request.response, function (buffer) {
				audioSoundBuffers[click[0]] = buffer;
				loaded++;
				if (loaded == TOTAL_SOUNDS) {
					callback();
				}
			}, function () {
				// TODO: sound load error
			});
		};

		request.send();
	});
};

var startMetronome = function () {
	var bpm = document.getElementById("bpmSlider").value;
	var currentTime = context.currentTime;

	vesuviusMeasures.forEach(function (measureType) {
		var beatArray = measureTypes[measureType];

		for (var i = 0; i < beatArray.length; i++) {
			var source = context.createBufferSource();
			switch (beatArray[i]) {
				case 0:
					source.buffer = audioSoundBuffers.highClick;
					break;
				case 1:
					source.buffer = audioSoundBuffers.lowClick;
					break;
				case 2:
					source.buffer = audioSoundBuffers.subClick;
					break;
			}
			source.connect(context.destination);
			source.start(currentTime);

			currentTime += 60 / bpm;
		}
	});
};

window.onload = function () {
	setupSlider();

	loadBufferedSounds(function () {
		var startButton = document.getElementById("startButton");
		startButton.disabled = "";
		startButton.onclick  = function () {
			startMetronome();
		};
	});
};

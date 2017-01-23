var ConverterApp = angular.module('ConverterApp', []);

var postUpload;

ConverterApp.controller('ConverterCtrl', function ($scope) {
	$scope.data = null;

	postUpload = function (event) {
		var file = event.target.files[0];
		if (file === undefined) {
			return;
		}

		if (file.type === 'text/plain') {
			$scope.message = 'Loading';

			var reader = new FileReader();
			reader.onload = $scope.postLoad;
			reader.readAsText(file);
		} else {
			$scope.message = 'Upload a .txt file from Cube Timer.';
		}

		$scope.$apply();
	};

	$scope.postUpload = postUpload;

	$scope.postLoad = function (event) {
		$scope.message = '';
		$scope.data = parseTimes(event.target.result);

		$scope.save();

		$scope.$apply();
	}

	function parseTimes (string) {
		var lines = string.split('\n');

		var convertedData = [];

		for (var i = 1; i < lines.length; i++) {	// skip header
			var line = lines[i];

			if (line === '') {
				continue;
			}

			var bits = line.split(';');

			var cubeTimerLine = {
				"category": bits[0],
				"time": bits[1],
				"scramble": bits[2],
				"plusTwo": bits[4],
				"dnf": bits[5],
				"timestamp": bits[6]
			};

			convertedData.push(convertLine(cubeTimerLine));
		}

		return convertedData;
	}

	function convertLine (cubeTimerLine) {
		var puzzleTypeMap = {
			'2x2x2': ['222', 'Normal'],
			'3x3x3': ['333', 'Normal'],
			'3x3x3 Blindfolded': ['333', 'BLD'],
			'3x3x3 Fewest Moves': ['333', 'FMC'],
			'3x3x3 With Feet': ['333', 'Feet'],
			'3x3x3 Multi-Blindfolded': ['333', 'Multi-BLD'],
			'3x3x3 One-Handed': ['333', 'OH'],
			'4x4x4': ['444', 'Normal'],
			'4x4x4 Blindfolded': ['444', 'BLD'],
			'5x5x5': ['555', 'Normal'],
			'5x5x5 Blindfolded': ['555', 'BLD'],
			'6x6x6': ['666', 'Normal'],
			'7x7x7': ['777', 'Normal'],
			'Rubik\'s Clock': ['clock', 'Normal'],
			'Megaminx': ['mega', 'Normal'],
			'Pyraminx': ['pyra', 'Normal'],
			'Skewb': ['skewb', 'Normal'],
			'Square-1': ['sq1', 'Normal'],
		};

		console.log(cubeTimerLine.category, puzzleTypeMap);

		var puzzle = puzzleTypeMap[trimQuotes(cubeTimerLine.category)][0];
		var category = puzzleTypeMap[trimQuotes(cubeTimerLine.category)][1];
		var time = toMillis(trimQuotes(cubeTimerLine.time));
		var date = trimQuotes(cubeTimerLine.timestamp);
		var scramble = trimQuotes(cubeTimerLine.scramble);
		var penalty = '0';
		if (trimQuotes(cubeTimerLine.plusTwo) === 'yes') {
			time += 2000;
			penalty = '1';
		}
		if (trimQuotes(cubeTimerLine.dnf) === 'yes') {
			penalty = '2';
		}

		return '"' + puzzle + '";"' + category + '";"' + time + '";"' + date + '";"' + scramble + '";"' + penalty + '";""';
	}

	function trimQuotes (str) {
		return str.substring(1, str.length - 1);
	}

	function toMillis (cubeTimerTime) {
		var bits = cubeTimerTime.split(':');
		var minute = parseInt(bits[0]);
		var milliseconds = parseInt(bits[1].replace('.', ''));

		return minute * 60 * 1000 + milliseconds;
	}

	$scope.save = function (data) {
		var outString = 'Puzzle,Category,Time(millis),Date(millis),Scramble,Penalty,Comment\n';
		for (var i = 0; i < $scope.data.length; i++) {
			outString += $scope.data[i] + '\n';
		}

		saveAs(new Blob([outString], {type: 'text/plain;charset=utf-8'}), 'cubetimer-converted.txt');

		$scope.message = 'Downloading converted file.';
	};
});

window.onload = function () {
	document.getElementById('fileInput').onchange = function (event) {
		postUpload(event);
	};
};
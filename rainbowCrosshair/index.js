window.onload = function () {
	var divisionsInput = document.getElementById("divisions");
	divisionsInput.onkeyup = function () {
		var numDivisions = parseInt(divisionsInput.value);
		var outString = "alias +c_attack \"+attack; next_cross\"\n";
		outString += "alias -c_attack \"-attack;\"\n";
		outString += "bind mouse1 +c_attack\n";
		outString += "cl_crosshaircolor 5;\n"

		for (var i = 0; i < numDivisions; i++) {
			var rgb = tinycolor.fromRatio({h: i / numDivisions, s: 1, v: 1}).toRgb();
			outString += "alias c" + i
				+ " \"cl_crosshaircolor_r " + rgb.r
				+ "; cl_crosshaircolor_g " + rgb.g
				+ "; cl_crosshaircolor_b " + rgb.b
				+ "; alias next_cross c" + (i + 1 == numDivisions? 0 : i + 1) + ";\"\n";
		}

		outString += "c0;\n";

		document.getElementById("out").innerHTML = outString;
	};

	divisionsInput.onkeyup();
};
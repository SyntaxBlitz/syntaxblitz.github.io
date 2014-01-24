var measures = [];
// Let's do some of this programmatically...
// 4/4 == true,
// 7/8 == false.
// First add the first measure which is more of a pickup than anything else:
measures.push(true);

for (var i = 0; i < 76; i++) {	// push 76 7/8-4/4 pairs
	measures.push(false);
	measures.push(true);
}

// Now we're at P. P/Q make up 16 straight bars of 4/4.
for (var i = 0; i < 16; i++) {
	measures.push(true);
}

// R to halfway through U is 14 pairs of 7/8-4/4.
for (var i = 0; i < 14; i++) {
	measures.push(false);
	measures.push(true);
}

measures.push(true);	// 198
measures.push(true);	// 199

for (var i = 0; i < 5; i++) {	// five more pairs
	measures.push(false);
	measures.push(true);
}

// for a total of 209 measures.

var rehearsalMarkings = {
	"A": 10,
	"B": 28,
	"C": 42,
	"D": 50,
	"E": 54,
	"F": 62,
	"G": 70,
	"H": 78,
	"I": 86,
	"J": 96,
	"K": 106,
	"L": 114,
	"M": 122,
	"N": 130,
	"O": 146,
	"P": 154,
	"Q": 162,
	"R": 170,
	"S": 178,
	"T": 182,
	"U": 194,
	"V": 202
};
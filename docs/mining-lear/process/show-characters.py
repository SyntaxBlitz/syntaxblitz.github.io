import json

f = open('text-stripped-1.json')

obj = json.load(f)

chars = set()

for bit in obj['data']:
	if bit['type'] == 'speaker tag':
		chars.add(bit['speaker'])

for char in chars:
	print(char)
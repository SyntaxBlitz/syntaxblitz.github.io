import json

f = open('text-stripped-2.json')
out = open('text-stripped-3.json', 'w')

start_obj = json.load(f)

end_obj = {'data': []}

acceptable_characters = [
	'ALBANY',
	'GLOUCESTER',
	'Knight',
	'Messenger',
	'REGAN',
	'BURGUNDY',
	'Captain',
	'Doctor',
	'KING LEAR',
	'EDMUND',
	'Third Servant',
	'KING OF FRANCE',
	'KENT',
	'First Servant',
	'Old Man',
	'CORDELIA',
	'EDGAR',
	'Herald',
	'Fool',
	'CURAN',
	'Second Servant',
	'CORNWALL',
	'OSWALD',
	'GONERIL',
	'Gentleman'
]

def parse_direction(text, last_tag):
	if text == 'Exit' or text == 'Dies':
		return ('exit', [last_tag])
	if text == 'Exeunt':
		return ('exeunt', [])

	direction_type = ''
	characters_text = ''
	if text[:8] == 'Re-enter':
		direction_type = 'entrance'
		characters_text = text[9:]
	elif text[:5] == 'Enter':
		direction_type = 'entrance'
		characters_text = text[6:]
	elif text[:4] == 'Exit':
		direction_type = 'exit'
		characters_text = text[5:]
	elif text[:6] == 'Exeunt':
		direction_type = 'exit'
		characters_text = text[7:]
	else:
		raise Exception('There was a problem parsing the entrances/exits: word didn\'t exist')

	return (direction_type, parse_characters(characters_text))

def parse_characters(text):
	text = text.replace(', and', ',')
	text = text.replace('and', ',')
	char_list = list(map(lambda x: x.strip(), text.split(',')))

	for char in char_list:
		if char not in acceptable_characters:
			raise Exception('An unknown character was present in a stage direction', char)

	return char_list


last_tag = None

for bit in start_obj['data']:
	if bit['type'] == 'stage direction':
		direction_type, characters = parse_direction(bit['text'], last_tag)
		#print(characters)
		end_obj['data'].append({
			'type': direction_type,
			'characters': characters
		})
	else:
		end_obj['data'].append(bit)
		if bit['type'] == 'speaker tag':
			if bit['speaker'] not in acceptable_characters:
				raise Exception('An unknown character tried to speak', bit['speaker'])
			last_tag = bit['speaker']

json.dump(end_obj, out)
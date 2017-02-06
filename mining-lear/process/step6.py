import json

f = open('text-stripped-3.json')
out = open('text-lines.json', 'w')

start_obj = json.load(f)

end_obj = {'data': []}

characters_on_stage = []
currently_speaking = None
last_scene = '1.1'

for i in range(len(start_obj['data'])):
	obj = start_obj['data'][i]
	if obj['type'] == 'entrance':
		if obj['characters'] in characters_on_stage:
			raise Exception('Character tried to enter stage when already on stage at object ' + str(i))
		characters_on_stage = characters_on_stage + obj['characters']
	elif obj['type'] == 'exeunt':
		characters_on_stage = []
	elif obj['type'] == 'exit':
		characters_on_stage = [char for char in characters_on_stage if char not in obj['characters']]

	elif obj['type'] == 'speaker tag':
		if obj['speaker'] not in characters_on_stage:
			raise Exception('Character tried to speak when not on stage at object ' + str(i), start_obj['data'][i + 1])
		currently_speaking = obj['speaker']

	elif obj['type'] == 'line':
		if currently_speaking == None:
			raise Exception('A line did not have an associated speaker at object ' + str(i))

		identifier_info = obj['identifier'].split('.')
		scene = identifier_info[0] + '.' + identifier_info[1]

		#if scene != last_scene:
		#	if len(characters_on_stage) != 0:
		#		print('Warning: scene ' + scene + ' just started with ' + str(characters_on_stage) + ' still on stage')

		last_scene = scene

		end_obj['data'].append({
			'type': 'line',
			'identifier': obj['identifier'],
			'text': obj['text'].strip(),
			'speaker': currently_speaking,
			'characters': characters_on_stage
		})

	if len(characters_on_stage) == 0:
		currently_speaking = None

json.dump(end_obj, out)
import json

f = open('text.json')
out = open('text-stripped-1.json', 'w')

start_obj = json.load(f)

end_obj = {'data': []}

for bit in start_obj['data']:
	if bit['type'] != 'act' and bit['type'] != 'scene':
		end_obj['data'].append(bit)

json.dump(end_obj, out)
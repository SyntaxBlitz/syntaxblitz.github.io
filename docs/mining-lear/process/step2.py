import bs4, json

soup = bs4.BeautifulSoup(open('text.html'), 'html.parser')
important_bits = soup.findAll(['h3', 'a', 'i'])

count = 0
started = False
data = []
for bit in important_bits:
	start_len = len(data)
	if bit.name == 'h3':
		if bit.text[:3] == 'ACT':
			started = True
			data.append({
				'type': 'act',
				'name': bit.text
			})
		elif bit.text[:5] == 'SCENE':
			data.append({
				'type': 'scene',
				'name': bit.text
			})
	elif started:
		if bit.name == 'a':
			if not bit.has_attr('name'):
				raise Exception('Something\'s wrong with the file: it seems to have a non-line before the first act starts or after the play is over')

			if bit['name'][:6] == 'speech':
				data.append({
					'type': 'speaker tag',
					'speaker': bit.text
				})
			else:
				data.append({
					'type': 'line',
					'identifier': bit['name'],
					'text': bit.text
				})

		elif bit.name == 'i':
			data.append({
				'type': 'stage direction',
				'text': bit.text
			})

json.dump({'data': data}, open('text.json', 'w'))
import json
import sys
sys.path.insert(0, './vaderSentiment')
from vaderSentimentModded.vaderSentiment import SentimentIntensityAnalyzer

f = open('text-lines.json')
out = open('text-modded-sentiments.json', 'w')

start_obj = json.load(f)

end_obj = {'data': []}

analyzer = SentimentIntensityAnalyzer()

min_sentiment = 1000
min_sentiment_line = ''

max_sentiment = -1000
max_sentiment_line = ''

lear_total_sentiment = 0
lear_line_count = 0

fool_total_sentiment = 0
fool_line_count = 0

gloucester_total_sentiment = 0
gloucester_line_count = 0

edmund_total_sentiment = 0
edmund_line_count = 0

edgar_total_sentiment = 0
edgar_line_count = 0

total_lines = 0
counted_lines = 0

for bit in start_obj['data']:
	scores = analyzer.polarity_scores(bit['text'])
	total_lines += 1
	bit['sentiment'] = scores['compound']
	if scores['compound'] != 0:
		counted_lines += 1
	if scores['compound'] < min_sentiment:
		min_sentiment = scores['compound']
		min_sentiment_line = bit['text']
	if scores['compound'] > max_sentiment:
		max_sentiment = scores['compound']
		max_sentiment_line = bit['text']

	if bit['speaker'] == 'KING LEAR':
		if scores['compound'] != 0:
			lear_line_count += 1
		lear_total_sentiment += scores['compound']
	elif bit['speaker'] == 'Fool':
		if scores['compound'] != 0:
			fool_line_count += 1
		fool_total_sentiment += scores['compound']
	elif bit['speaker'] == 'GLOUCESTER':
		if scores['compound'] != 0:
			gloucester_line_count += 1
		gloucester_total_sentiment += scores['compound']
	elif bit['speaker'] == 'EDMUND':
		if scores['compound'] != 0:
			edmund_line_count += 1
		edmund_total_sentiment += scores['compound']
	elif bit['speaker'] == 'EDGAR':
		if scores['compound'] != 0:
			edgar_line_count += 1
		edgar_total_sentiment += scores['compound']

	end_obj['data'].append(bit)

print (counted_lines, total_lines)

print(min_sentiment, min_sentiment_line)

print(max_sentiment, max_sentiment_line)

print('Lear:')
print(lear_total_sentiment / lear_line_count)

print('Fool:')
print(fool_total_sentiment / fool_line_count)

print('Gloucester:')
print(gloucester_total_sentiment / gloucester_line_count)

print('Edmund:')
print(edmund_total_sentiment / edmund_line_count)

print('Edgar:')
print(edgar_total_sentiment / edgar_line_count)

json.dump(end_obj, out)

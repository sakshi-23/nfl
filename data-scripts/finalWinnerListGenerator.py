import csv, json

with open('../data/teams.json') as data_file:    
    teamAbbrMap = json.load(data_file)

reader = csv.reader(open("../data/superbowl-finals.csv","rb"))
header = reader.next()

winMap = {}
for teamAbbr in teamAbbrMap:
	winMap[teamAbbr] = {
		"years":[],
		"count":0,
		"teamId":teamAbbr
	}

for line in reader:
	winner = line[header.index("winner")]
	year = line[header.index("year")]
	for teamAbbr in teamAbbrMap:
		if winner.lower() in teamAbbrMap[teamAbbr].lower():
			winMap[teamAbbr]["count"] += 1
			winMap[teamAbbr]["years"].append(year)

winList = []
for teamAbbr in winMap:
	winList.append(winMap[teamAbbr])

with open('../data/superbowl-winners.json', 'wb') as outfile:
    json.dump(winList, outfile,indent=1)
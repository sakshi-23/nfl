import json

with open('../data/nyg.json') as data_file:    
    dump1 = json.load(data_file)

with open('../data/was.json') as data_file:    
    dump2 = json.load(data_file)


combinedJson = {
	"games" : {}
}

for mainKey in dump1:
	for team in dump1[mainKey]:
		combinedJson['games'][team] = dump1[mainKey][team]

for mainKey in dump2:
	for team in dump2[mainKey]:
		combinedJson['games'][team] = dump2[mainKey][team]

with open('../data/allGames.json', 'w') as outfile:
    json.dump(combinedJson, outfile,indent=1)
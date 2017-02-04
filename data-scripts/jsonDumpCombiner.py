import json

with open('../data/nyg.json') as data_file:    
    dump1 = json.load(data_file)

with open('../data/was.json') as data_file:    
    dump2 = json.load(data_file)


combinedJson = {
	"games" : {},
	"results": {}
}

for team in dump1["games"]:
	combinedJson["games"][team] = dump1["games"][team]

for team in dump2["games"]:
	combinedJson["games"][team] = dump2["games"][team]

for team in dump1["results"]:
	combinedJson["results"][team] = dump1["results"][team]

for team in dump2["results"]:
	combinedJson["results"][team] = dump2["results"][team]

print combinedJson.keys()

with open('../data/allGames.json', 'w') as outfile:
    json.dump(combinedJson, outfile,indent=1)
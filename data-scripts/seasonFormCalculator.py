import json

with open('../data/allGames.json') as data_file:    
    allGames = json.load(data_file)

seasonWinLoss = {}

for team in allGames["games"]:
	if team not in seasonWinLoss:
		seasonWinLoss[team] = {}
	for game in allGames["games"][team]:
		year = str(game['year'])
		if year not in seasonWinLoss[team]:
			seasonWinLoss[team][year] = {"win":0,"loss/tie":0}

		gameWon = game['won_flag']
		gameName = game['game_name']
		if (gameName not in ["Wild Card","Division","Conf. Champ.","SuperBowl"]) and gameWon==True:
			print gameWon,gameName,year,team
			seasonWinLoss[team][year]["win"] += 1

		elif (gameName not in ["Wild Card","Division","Conf. Champ.","SuperBowl"]) and gameWon==False:
			seasonWinLoss[team][year]["loss/tie"] += 1

with open('../data/seasonWinLossMap.json', 'wb') as outfile:
    json.dump(seasonWinLoss, outfile,indent=1)
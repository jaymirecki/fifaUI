mongoimport -d fifa -c saves --file=template_database_saves.csv --type=csv --headerline --mode upsert
mongoimport -d fifa -c teams --file=template_database_teams.csv --type=csv --headerline --mode upsert
mongoimport -d fifa -c competitions --file=template_database_competitions.csv --type=csv --headerline --mode upsert
mongoimport -d fifa -c divisions --file=template_database_divisions.csv --type=csv --headerline --mode upsert
mongoimport -d fifa -c teamsins --file=template_database_teamsIn.csv --type=csv --headerline --mode upsert
mongoimport -d fifa -c players --file=template_database_players.csv --type=csv --headerline --mode upsert
# mongo < commands.txt
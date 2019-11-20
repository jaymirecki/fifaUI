class FCRoster {
    constructor() {
        this.rosters = new Object();
        this.lineups = new Object();
        this.positions = ["GK", "SW", "RWB", "RB", "CB", "LB", "LWB", "CDM", "RM", "CM", "LM", "CAM", "CF", "RW", "ST", "LW"];
    }

    addRoster(team, roster) {
        for (let i in roster) {
            roster[i].age = new Date(roster[i].age);
        }
        this.rosters[team] = roster;
        this.sortByOverall(team);
    }

    addLineup(team, name, benchSize) {
        if (!this.lineups[team])
            this.lineups[team] = new Object();
        if (this.lineups[team][name])
            return;
        this.lineups[team][name] = this.getFreshLineup(team, benchSize);
    }

    getFreshLineup(team, benchSize) {
        let positions = this.positions;
        let lineup = new Object();
        this.sortByOverall(team);
        let starters = [];
        for (let i = 0; i < 11; i++) {
            let player = this.rosters[team][i];
            let playerObject = {
                id:player._id,
                position: player.position,
                playedPosition: player.position.split(',')[0]
            }
            if (player.firstName)
                playerObject.name = player.firstName + ' ' + player.lastName;
            else
                playerObject.name = player.lastName;
            starters[i] = playerObject;
        }

        let bench = [];
        for (let i = 11; i < benchSize + 11; i++) {
            let player = this.rosters[team][i];
            let playerObject = {
                id:player._id,
                position: player.position
            }
            if (player.firstName)
                playerObject.name = player.firstName + ' ' + player.lastName;
            else
                playerObject.name = player.lastName;
            bench[i] = playerObject;
        }

        let reserves = [];
        for (let i = 11 + benchSize; i < this.rosters[team].length; i++) {
            let player = this.rosters[team][i];
            let playerObject = {
                id:player._id,
                position: player.position
            }
            if (player.firstName)
                playerObject.name = player.firstName + ' ' + player.lastName;
            else
                playerObject.name = player.lastName;
            reserves[i] = playerObject;
        }

        lineup.starters = starters;
        lineup.bench = bench;
        lineup.reserves = reserves;
        lineup.out = [];
        lineup = this.sortLineup(lineup);
        console.log(lineup);
        return lineup;
    }

    saveLineup(team, name, lineup) {
        this.lineups[team][name] = lineup;
    }

    sortLineup(lineup) {
        let positions = this.positions;
        lineup.starters.sort(function(a, b) {
            return positions.indexOf(a.playedPosition) - positions.indexOf(b.playedPosition);
        });
        lineup.bench.sort(function(a, b) {
            return positions.indexOf(a.position.split(',')[0]) - positions.indexOf(b.position.split(',')[0]);
        });
        return lineup;
    }

    switchPlayerToBench(team, lineup, player, bench) {
        this.lineups[team][lineup] = this.switchPlayerToBenchStatic(this.lineups[team][lineup], player, bench);
    }

    switchPlayerToBenchStatic(lineup, starter, bench) {
        let benchPlayer;
        let benchPosition;
        let starterPlayer;
        let starterPosition;
        for (let i in lineup.bench) {
            if (lineup.bench[i].id == bench) {
                benchPlayer = lineup.bench[i];
                benchPosition = i;
            }
        }
        for (let i in lineup.starters) {
            if (lineup.starters[i].id == starter) {
                starterPlayer = lineup.starters[i];
                starterPosition = i;
            }
        }
        lineup.bench[benchPosition] = starterPlayer;
        benchPlayer.playedPosition = starterPlayer.playedPosition;
        lineup.starters[starterPosition] = benchPlayer;
        return this.sortLineup(lineup);
    }

    newLineup(team) {
        if (!this.lineups[team])
            this.lineups[team] = new Object();
        let name = "New Lineup ";
        let i = 0;
        while (this.lineups[team][name + ++i])
            console.log(name + i);
        // this.addLineup(team, name + i, 7);
        return name + i;
    }

    getRoster(team) {
        return this.rosters[team];
    }

    getLineup(team, name) {
        return this.lineups[team][name];
    }
    
    getLineupReplacementsFor(team, lineup, player) {
        this.lineupReplacementsFor(this.lineups[team][lineup], player);
    }

    getLineupReplacementsFor(lineup, player) {
        let replacements = [];
        for (let i in lineup.bench) {
            replacements[i] = lineup.bench[i];
        }
        return replacements;
    }

    sortByName() {
        for (let i in this.rosters) {
            this.sortByName(i);
        }
    }

    sortByName(team) {
        this.rosters[team].sort(function(a, b) {
            if (a.lastName < b.lastName) {
                return - 1;
            }
            else return 1;
        });
    }
    
    sortByOverall() {
        for (let i in this.rosters) {
            this.sortByOverall(i);
        }
    }

    sortByOverall(team) {
        this.rosters[team].sort(function(a, b) {
            return b.ovr - a.ovr;
        });
    }
}
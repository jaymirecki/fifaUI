class FCLineups {
    constructor(lineups, index, roster) {
        this.lineups = lineups;
        this.index = index;
        this.saveGame = false;
        this.roster = roster;
    }

    getCurrentLineup() {
        return this.lineups[this.index];
    }

    setCurrentLineup(index) {
        if (index < this.lineups.length)
            this.index = index;
    }

    setRoster(roster) {
        var nameRoster = roster.map(p => p.name);
        this.roster.filter(p => nameRoster.indexOf(p.name) < 0);
        for (let i = 0; i < this.lineups.length; i++) {
            var lineup = this.lineups[i];
            for (let j = 0; j < lineup.starters.length; j++) {
                if (nameRoster.indexOf(lineup.starters[j].player.name) >= 0)
                    this.replace(lineup.starters.player.name, this.getBestReplacement(this.lineup.starters.player.name));
            }
        }
    }

    generateDefaultLineup() {

    }
}
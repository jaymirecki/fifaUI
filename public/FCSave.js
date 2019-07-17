class FCSave {
    constructor(saveObject) {
        console.log(saveObject);
        this.object = saveObject;
        this.current = this.object.settings.currentSelections;
        this.updateCurrentTeam(this.current.team);
        console.log(this.currentCompetition);
        this.updateCurrentCompetition(this.current.competition);
        console.log(this.currentCompetition);
        this.updateCurrentDivision(this.current.division);
        this.currentLineup = this.current.lineup;

        this.updateCurrentTeam.bind(this);
        this.updateCurrentCompetition.bind(this);
        this.updateCurrentDivision.bind(this);
        this.updateFixtures.bind(this);
        this.getName.bind(this);
        this.getGame.bind(this);
        this.getManager.bind(this);
        this.getCurrentTeam.bind(this);
        this.getTeams.bind(this);
        this.getCompetitions.bind(this);
        this.getPowerRankings.bind(this);
        this.getUnplayedFixtures.bind(this);
        this.getDivisions.bind(this);
        this.getTable.bind(this);
        this.getRoster.bind(this);
        this.calculateTable.bind(this);
        this.calculatePowerRankings.bind(this);
        this.newTable.bind(this);
        this.newPower.bind(this);
    }

    updateCurrentTeam(newTeam) {
        if (!this.object.team[newTeam])
            return;
        this.currentTeam = this.object.team[newTeam];
        this.updateCurrentCompetition(
            Object.keys(this.currentTeam.league.competitions)[0]);
        this.lineups = this.currentTeam.lineups;
        this.currentLineup = 0;
    }
    updateLineups(newLineups, index) {
        this.currentTeam.lineups = newLineups;
        this.currentLineup = index;
    }
    updateCurrentCompetition(newCompetition) {
        if (!this.currentTeam.league.competitions[newCompetition])
            return;
        this.currentCompetition = 
            this.currentTeam.league.competitions[newCompetition];
        this.updateCurrentDivision(
            Object.keys(this.currentCompetition.divisions)[0]);
        this.updateFixtures(this.currentCompetition.fixtures);
    }
    updateCurrentDivision(newDivision) {
        if (!this.currentCompetition.divisions[newDivision])
            return;
        this.currentDivision = this.currentCompetition.divisions[newDivision];
    }
    updateFixtures(fixtures) {
        this.unplayedFixtures =
            fixtures.filter(f => !f.score);
        this.unplayedFixtures.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });

        this.playedFixtures = 
            fixtures.filter(f => f.score);
        this.playedFixtures.sort(function(a, b) {
            return new Date(b.date)- new Date(a.date);
        });
    }
    setDate(newDate) {
        this.object.date = newDate;
    }
    setSettings(newSettings) {
        this.object.settings = newSettings;
    }

    getName() {
        return this.object.name;
    }
    getGame() {
        return this.object.game;
    }
    getManager() {
        return this.object.manager;
    }
    getSettings() {
        return this.object.settings;
    }
    getDate() {
        return this.object.date;
    }
    getTeams() {
        return this.object.team;
    }
    getCurrentTeam() {
        return this.currentTeam;
    }
    getLineups() {
        return this.lineups;
    }
    getCurrentLineup() {
        return this.currentLineup;
    }
    getCompetitions() {
        return this.object.team[this.current.team].league.competitions;
    }
    getCurrentCompetition() {
        return this.currentCompetition;
    }
    getPowerRankings() {
        this.currentCompetition.power = 
            this.calculatePowerRankings(this.currentCompetition.power, this.currentCompetition.fixtures);
        
        return this.currentCompetition.power;
    }
    getUnplayedFixtures() {
        return this.unplayedFixtures;
    }
    getFixtures() {
        var resortedPlayedFixtures = [];
        Object.assign(resortedPlayedFixtures, this.playedFixtures);
        resortedPlayedFixtures.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });
        return resortedPlayedFixtures.concat(this.unplayedFixtures);
    }
    addFixture(fixture) {
        this.unplayedFixtures.push(fixture);
        this.unplayedFixtures.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });
    }
    getDivisions() {
        return this.currentCompetition.divisions;
    }
    getCurrentDivision() {
        return this.currentDivision;
    }
    getTable() {
        this.currentDivision.table = 
            this.calculateTable(this.currentDivision.teams, this.currentCompetition.fixtures);
        return  this.currentDivision.table;
    }
    getRoster() {
        return this.object.team[this.current.team].roster;
    }

    calculatePowerRankings(teams, fixtures) {
        fixtures.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });
        teams = teams.map(p => p.t);
        var currPower = this.newPower(teams);
        var oldPower = this.newPower(teams);
        for (let i = 0; i < currPower.length; i++) {
            var team = currPower[i].t
            var tFix = fixtures.filter(f => (f.home == team || f.away == team) && f.score).sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
            });
            var awayPoints = { away: 3, draw: 1, home: 0 };
            var homePoints = { home: 3, draw: 1, away: 0 };
            for (let j = 0; j < 10 && j < tFix.length; j++) {
                var power;
                if (j < 5)
                    power = currPower;
                else
                    power = oldPower;
                if (tFix[j].away == team)
                    power[i].p = power[i].p + awayPoints[tFix[j].score.result];
                else
                    power[i].p = power[i].p + homePoints[tFix[j].score.result];
            }
            currPower[i].scr = currPower[i].p;
            oldPower[i].scr = oldPower[i].p;
    
        }
        currPower.sort(sortPowerRankings);
        oldPower.sort(sortPowerRankings);
        for (let i = 0; i < currPower.length; i++) {
            var oldIndex;
            for (let j = 0; j < oldPower.length; j++) {
                if (oldPower[j].t == currPower[i].t)
                    oldIndex = j;
            }
            currPower[i].m = oldIndex - i;
            if (currPower[i].m > 0)
                currPower[i].m = "+" + currPower[i].m;
        }
        return currPower;
    }
    calculateTable(teams, fixtures) {
        fixtures.sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });
    
        var table = this.newTable(teams);
    
        var awayResults = { home: "l", draw: "d", away: 'w' };
        var homeResults = { home: "w", draw: "d", away: 'l' };
    
        for (let i = 0; i < fixtures.length; i++) {
            var f = fixtures[i];
            if (!f.score)
                continue;
            var a = f.away;
            var h = f.home;
            var ag = parseInt(f.score.away, 10);
            var hg = parseInt(f.score.home, 10);
            var r = f.score.result;
            for (let j = 0; j < table.length; j++) {
                if (table[j].t == a) {
                    table[j][awayResults[r]]++;
                    var gf = table[j].gf + ag;
                    table[j].gf = table[j].gf + ag;
                    table[j].ga = table[j].ga + hg;
                }
                else if (table[j].t == h) {
                    table[j][homeResults[r]]++;
                    table[j].gf = table[j].gf + hg;
                    table[j].ga = table[j].ga + ag;
                }
            }
        }
        return table;
    }
    newPower(teams) {
        var table = [];
        for (let i = 0; i < teams.length; i++) {
            table[i] = new Object();
            table[i].t = teams[i];
            table[i].p = 0;
            table[i].str = 0;
            table[i].scr = 0;
            table[i].m = 0;
        }
        return table;
    }
    newTable(teams) {
        var table = [];
        for (let i = 0; i < teams.length; i++) {
            table[i] = new Object();
            table[i].t = teams[i];
            table[i].w = 0;
            table[i].d = 0;
            table[i].l = 0;
            table[i].gf = 0;
            table[i].ga = 0;
        }
        return table;
    }
}
class FCRoster {
    constructor() {
        this.rosters = new Object();
    }

    addRoster(team, roster) {
        for (let i in roster) {
            roster[i].age = new Date(roster[i].age);
        }
        this.rosters[team] = roster;
        this.sortByName(team);
    }

    getRoster(team) {
        return this.rosters[team];
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
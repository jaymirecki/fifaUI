class FCSave {
    constructor(saveObject) {
        this.object = saveObject;
        this.user = saveObject.user;
        this.game = saveObject.game;
        this.date = saveObject.date;
        this.team = saveObject.team;
        this.competition = saveObject.competition;
        this.division = saveObject.division;
    }

    competitions() {
        return this.teams[this.team];
    }

    divisions() {
        return this.teams[this.team][this.competition];
    }

    changeTeam(team) {
        this.team = team;
        this.changeCompetition(Object.keys(this.teams[this.team])[0]);
    }

    changeCompetition(comp) {
        this.competition = comp;
        this.changeDivision(this.teams[this.team][this.competition][0])
    }

    changeDivision(div) {
        this.division = div;
    }
}
class FCSave {
    constructor(saveObject) {
        this.object = saveObject;
        this.user = saveObject.user;
        this.game = saveObject.game;
        this.date = new Date(saveObject.date);
        this.team = saveObject.team;
        this.competition = saveObject.competition;
        this.division = saveObject.division;
        this.teams = saveObject.teams;
        this.name = saveObject.name;
        this.managerName = saveObject.managerName
    }

    competitions() {
        return this.teams[this.team].competitions;
    }

    divisions() {
        return this.teams[this.team].competitions[this.competition].divisions;
    }

    changeTeam(team) {
        this.team = team;
        this.changeCompetition(Object.keys(this.teams[this.team])[0]);
    }

    changeCompetition(comp) {
        this.competition = comp;
        let newDiv = Object.keys(this.teams[this.team].competitions[this.competition].divisions)[0];
        this.changeDivision(newDiv);
    }

    changeDivision(div) {
        this.division = div;
    }

    save() {
        fifaPostRequest("save", { user: fifaUser, game: fifaGame }, x => location.href='game?g=' + x);
    }
}
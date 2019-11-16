import * as mongoose from "mongoose";
import { Save, ISave, save, getSave, getSaves } from './save';
import { Team, ITeam } from './team';
import { Competition, ICompetition } from './competition';
import { Division, IDivision } from './division';
import { TeamsIn, ITeamsIn } from './teamsIn';

const uri: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';

var mongooseOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true }
mongoose.connect(uri, mongooseOptions, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Database Successfully Connected!");
    }
});

export { save, getSave, getSaves };
export default { save, getSave, getSaves };

export async function createNewSave(s: any) {
    var id: string = s.game + s.league;
    let saveObject: any = {
        user: s.user,
        shared: false,
        name: s.name,
        managerName: s.managerName,
        date: new Date(),
        game: s.game,
        doc: new Date(parseInt(s.doc)),
        dom: new Date(parseInt(s.doc))
    };
    var save: ISave = new Save(saveObject);
    await save.save();
    getNewTeams(id, save.id, s.team);
    getNewCompetitions(id, save.id, s.team);
    getNewDivisions(id, save.id);
    getNewTeamsIn(id, save.id);
    return save.id;
};

async function getNewTeams(id: string, gameId: string, teamName: string) {
    let teams: ITeam[] = await Team.find({ game: id });
    for (let i in teams) {
        let t: ITeam = teams[i];
        t.game = gameId;
        console.log("Team: " + t.team);
        if (t.team == teamName) {
            t.player = true;
            t = new Team(t.toObject());
            t.save();
        } else {
            t.player = false;
            new Team(t.toObject()).save();
        }
    }
}

async function getNewCompetitions(id: string, gameId: string, teamName: string) {
    let comps: ICompetition[] = await Competition.find({ game: id });
    console.log(comps);
    for (let i in comps) {
        let c: ICompetition = comps[i];
        c.team = teamName;
        c.game = gameId;
        c = new Competition(c.toObject());
        await c.save();
        console.log("Competition: " + c.competition);
    }
}

async function getNewDivisions(id: string, gameId: string) {
    let divs: IDivision[] = await Division.find({ game: id });
    for (let i in divs) {
        let d = divs[i];
        d.game = gameId;
        d = new Division(d.toObject());
        d.save();
        console.log("Division: " + d.division);
    }
}

async function getNewTeamsIn(id: string, gameId: string) {
    console.log(id);
    console.log(gameId);
    let teams: ITeamsIn[] = await TeamsIn.find({ game: id }, (err: any, res: any) => {
        console.log(err);
        console.log(res);
    });
    console.log(teams);
    for (let i in teams) {
        let t: ITeamsIn = teams[i];
        t.game = gameId;
        t = new TeamsIn(t.toObject());
        t.save();
        console.log("TeamsIn: " + t.team);
    }
}
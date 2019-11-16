import * as mongoose from "mongoose";
import * as Save from './save';
import { Team, ITeam } from './team';
import { Competition, ICompetition } from './competition';
import { Division, IDivision } from './division';
import { TeamsIn, ITeamsIn } from './teamsIn';
import * as Settings from './settings';
import * as Player from './player';

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

export const save = Save.save;
export const getSave = Save.getSave;

export async function getSaves(user: string) {
    let saves = await Save.getSaves(user);
    for (let i in saves) {
        saves[i].team = (await Settings.getGameSettings(saves[i].id)).team;
    }
    return saves;
}

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
    var save: Save.ISave = new Save.Save(saveObject);
    await save.save();
    getNewTeams(id, save.id, s.team);
    getNewTeamsIn(id, save.id);
    Player.getNewPlayers(id, save.id, s.team);
    let c = await getNewCompetitions(id, save.id, s.team);
    let d = await getNewDivisions(id, save.id);
    Settings.newSettings(save.user, save.id, s.team, c, d);
    return save.id;
};

async function getNewTeams(id: string, gameId: string, teamName: string) {
    let teams: ITeam[] = await Team.find({ game: id });
    for (let i in teams) {
        let t: ITeam = teams[i];
        t.game = gameId;
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
    for (let i in comps) {
        let c: ICompetition = comps[i];
        c.team = teamName;
        c.game = gameId;
        c = new Competition(c.toObject());
        await c.save();
    }
    return comps[0].competition;
}

async function getNewDivisions(id: string, gameId: string) {
    let divs: IDivision[] = await Division.find({ game: id });
    for (let i in divs) {
        let d = divs[i];
        d.game = gameId;
        d = new Division(d.toObject());
        d.save();
    }
    return divs[0].division;
}

async function getNewTeamsIn(id: string, gameId: string) {
    let teams: ITeamsIn[] = await TeamsIn.find({ game: id }, (err: any, res: any) => {
        console.log(err);
    });
    for (let i in teams) {
        let t: ITeamsIn = teams[i];
        t.game = gameId;
        t = new TeamsIn(t.toObject());
        t.save();
    }
}

export async function getPlayers(game: string, team: string) {
    if (team)
        return await Player.getTeamPlayers(game, team);
    else
        return await Player.getGamePlayers(game);
}
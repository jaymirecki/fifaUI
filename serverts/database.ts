import * as mongoose from "mongoose";
import * as Save from './save';
import * as Team from './team';
import * as Competition from './competition';
import * as Division from './division';
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

export async function getSave(id: string) {
    let save = await Save.getSave(id);
    if (save.error)
        return save;
    let settings = await Settings.getGameSettings(id);
    save.team = settings.team;
    save.competition = settings.competition;
    save.division = settings.division;
    return save;
}

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
    Team.getNewTeams(id, save.id, s.team);
    getNewTeamsIn(id, save.id);
    Player.getNewPlayers(id, save.id, s.team);
    let c = await Competition.getNewCompetitions(id, save.id, s.team);
    let d = await Division.getNewDivisions(id, save.id);
    Settings.newSettings(save.user, save.id, s.team, c, d);
    return save.id;
};

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

export async function getGamePlayerTeams(game: string) {
    let teams: any = new Object();
    let ts: string[] = await Team.getGamePlayerTeams(game);
    for (let i in ts) {
        teams[ts[i]] = new Object();
        let cs: string[] = await Competition.getTeamCompetitions(game, ts[i]);
        for (let j in cs) {
            teams[ts[i]][cs[j]] = 
                await Division.getCompetitionDivisions(game, cs[j]);
        }
    }
    return teams;
}
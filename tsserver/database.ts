import * as mongoose from "mongoose";
import * as Save from './save';
import * as Team from './team';
import * as Competition from './competition';
import * as Division from './division';
import * as TeamsIn from './teamsIn';
import * as Settings from './settings';
import * as Player from './player';
import * as Game from './game';

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
    // var id: string = s.game + s.league;
    // let saveObject: any = {
    //     user: s.user,
    //     shared: false,
    //     name: s.name,
    //     managerName: s.managerName,
    //     date: new Date(),
    //     game: s.game,
    //     doc: new Date(parseInt(s.doc)),
    //     dom: new Date(parseInt(s.doc))
    // };
    // var save: Save.ISave = new Save.Save(saveObject);
    // await save.save();
    // Team.getNewTeams(id, save.id, s.team);
    // getNewTeamsIn(id, save.id);
    // Player.getNewPlayers(id, save.id, s.team);
    // let c = await Competition.getNewCompetitions(id, save.id, s.team);
    // let d = await Division.getNewDivisions(id, save.id);
    // Settings.newSettings(save.user, save.id, s.team, c, d);
    // return save.id;
    return "not implemented";
};

// async function getNewTeamsIn(id: string, gameId: string) {
//     let teams: ITeamsIn[] = await TeamsIn.find({ game: id }, (err: any, res: any) => {
//         console.log(err);
//     });
//     for (let i in teams) {
//         let t: ITeamsIn = teams[i];
//         t.game = gameId;
//         t = new TeamsIn(t.toObject());
//         t.save();
//     }
// }

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

export async function getNewGameTemplates() {
    let games = await Game.getAllGames();
    let ret:any = new Object();
    for (let i in games) {
        let g = games[i].name;
        ret[g] = new Object();
        let teams = await TeamsIn.getTeamByGame(games[i].id);
        for (let j in teams) {
            let c: Competition.ICompetition = await TeamsIn.getTeamCompetition(games[i].id, teams[j].id);
            if (!ret[g][c.name]) {
                ret[g][c.name] = { teams: new Map<string, any>(), date: c.start };
            }
            ret[g][c.name].teams.set(teams[j].id, {
                id: teams[j].id,
                name: teams[j].name
            });
        }
    }
    for (let g in ret) {
        for (let c in ret[g]) {
            ret[g][c].teams = Array.from(ret[g][c].teams.values())
        }
    }
    console.log(ret);
    return ret;
} 
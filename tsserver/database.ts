import * as mongoose from "mongoose";
import * as Save from './save';
import * as Team from './team';
import * as Competition from './competition';
import * as Division from './division';
import * as TeamsIn from './teamsIn';
import * as Settings from './settings';
import * as PlayerDynamicInfo from './playerdynamicinfo';
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
    let s = await Save.getSave(id);
    if (!s) return s;
    let save = s.toObject();
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
        // saves[i].team = (await Settings.getGameSettings(saves[i].id)).team;
    }
    return saves;
}

export async function createNewSave(s: any) {
    var id: string = s.game + s.league;
    let game: string = (await Game.getGameByName(s.game)).id;
    let saveObject: any = {
        user: s.user,
        shared: false,
        name: s.name,
        managerName: s.managerName,
        date: new Date(),
        game: game,
        doc: new Date(parseInt(s.doc)),
        dom: new Date(parseInt(s.doc))
    };
    let template = await Save.getTemplateId();
    console.log(saveObject);
    let save: Save.ISave = new Save.Save(saveObject);
    await save.save();
    PlayerDynamicInfo.getNewPlayers(template, s.team, save.id);
    let dc = await TeamsIn.getNewTeamsIn(template, s.team, save.id, game);
    Settings.newSettings(save.user, save.id, s.team, dc.competition.id, dc.division.id);
    return save.id;
};

export async function getPlayers(game: string, team: string) {
    if (team)
        return await PlayerDynamicInfo.getTeamPlayers(game, team);
    else
        return await PlayerDynamicInfo.getGamePlayers(game);
}

export async function getGamePlayerTeams(saveId: string) {
    let save = await Save.getSave(saveId);
    let season = 2019;
    if (!save) return {};
    let teams: any = new Object();
    let ts = await TeamsIn.getSavePlayerTeams(saveId);
    console.log(ts);
    for (let i in ts) {
        let t = await Team.getTeamById(ts[i].team);
        console.log
        console.log(t);
        if (!t) return {};
        teams[t.id] = {
            name: t.name,
            competitions: {}
        };
        let cs = await TeamsIn.getTeamCompetitions(t.id, saveId, season);
        for (let j in cs) {
            teams[t.id].competitions[cs[j].id] = {
                name: cs[j].name,
                divisions: {}
            };
            let ds = 
                await Division.getCompetitionDivisions(save.game, cs[j].id);
            for (let k in ds) {
                teams[t.id].competitions[cs[j].id].divisions[ds[k].id] = 
                    { name: ds[k].name };
            }
        }
    }
    console.log("Teams");
    console.log(teams);
    return teams;
}

export async function getNewGameTemplates() {
    let games = await Game.getAllGames();
    let template = await Save.getTemplateId();
    let ret:any = new Object();
    for (let i in games) {
        let g = games[i].name;
        let s = games[i].year;
        ret[g] = new Object();
        let teams = await TeamsIn.getTeamsByGame(games[i].name);
        for (let j in teams) {
            let c: Competition.ICompetition = await TeamsIn.getTeamCompetition(teams[j].jid, g, s);
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
    return ret;
} 
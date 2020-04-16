import * as mongoose from "mongoose";
import * as Save from './save';
import * as Team from './team';
import * as Competition from './competition';
import * as Division from './division';
import * as TeamsIn from './teamsIn';
import * as Settings from './settings';
import * as PlayerDynamicInfo from './playerdynamicinfo';
import * as Game from './game';
import { v4 as uuid4 } from 'uuid';

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

export async function getSave(saveId: string, user: string) {
    let s = await Save.findByKey(saveId);
    if (!s) return s;
    let save = s.toObject();
    if (save.error)
        return save;
    let settings = await Settings.getGameSettings(saveId);
    save.team = settings.team;
    save.competition = settings.competition;
    save.division = settings.division;
    save.teams = {};
    save.teams[save.team] = {};
    for (let i in save.teams) {
        save.teams[i] = (await Team.findByKey(save.team)).toObject();
        save.teams[i].competitions = {};
        let comps = await TeamsIn.findAllCompetitionsByTeamSeason(i, save.jid, 2019);
        for (let j in comps) {
            save.teams[i].competitions[comps[j].name] = comps[j].toObject();
            let divs = await Division.findAllByCompetition(comps[j].name);
            save.teams[i].competitions[comps[j].name].divisions = {};
            for (let k in divs) {
                save.teams[i].competitions[comps[j].name].divisions[divs[k].name] = divs[k].toObject();
            }
        }
    }
    return save;
}

export async function getSaves(user: string) {
    let saves = await Save.findAllByUser(user);
    let saveObjects: any[] = [];
    for (let i in saves) {
        let sObject = saves[i].toObject();
        sObject.team = (await Settings.getGameSettings(sObject.jid)).team;
        sObject.teamName = (await Team.findByKey(sObject.team)).name;
        saveObjects.push(sObject);
    }
    return saveObjects;
}

export async function createNewSave(s: any) {
    let saveObject: any = {
        jid: uuid4(),
        user: s.user,
        shared: false,
        name: s.name,
        managerName: s.managerName,
        date: new Date(),
        game: s.game,
        doc: new Date(),
        dom: new Date()
    };
    let season = (await Game.findByKey(s.game)).year;
    let save: Save.ISave = new Save.Save(saveObject);
    await save.save();

    await TeamsIn.copyTeamsFromSaveTeam(save.game, s.team, season, save.jid, save.game);
    let teams = await TeamsIn.findAllByTeamSeason(s.team, save.jid, season);
    for (let i in teams) {
        teams[i].player = true;
        teams[i].save();
    }

    let dc = await TeamsIn.findLeagueDivisionByKey(s.team, save.jid, season);
    Settings.newSettings(save.user, save.jid, s.team, dc.league.name, dc.division.name);
    return save.jid;
};

export async function getNewGameTemplates() {
    let games = await Game.getAllGames();
    let ret:any = new Object();
    for (let i in games) {
        let g = games[i].name;
        let s = games[i].year;
        ret[g] = new Object();
        let teams = await TeamsIn.findAllTeamsByGame(games[i].name);
        teams.sort(function(a, b) { if (a.name < b.name) return -1;
                                    else if (a.name > b.name) return 1;
                                    else return 0; });
        for (let j in teams) {
            let c: Competition.ICompetition = await TeamsIn.findLeagueByKey(teams[j].jid, g, s);
            if (!ret[g][c.name]) {
                ret[g][c.name] = [];
            }
            ret[g][c.name].push({
                jid: teams[j].jid,
                name: teams[j].name
            });
        }
    }
    return ret;
} 

export async function deleteSave(body: any) {
    if (await Save.deleteByKey(body.user, body.game))
        await TeamsIn.deleteAllBySave(body.game);
    return true;
}

export async function getSaveTeams(body: any) {
    return await TeamsIn.findAllTeamsBySave(body.game);
}

export async function getSaveTeamsByComp(body: any) {
    let teamsIns = await TeamsIn.findAllBySave(body.game);
    let ret: any = new Object();
    for (let i in teamsIns) {
        let season = teamsIns[i].season;
        let comp = teamsIns[i].competition;
        let team = await Team.findByKey(teamsIns[i].team);
        if (!ret[season])
            ret[season] = new Object();
        if (!ret[season][comp])
            ret[season][comp] = [];
        ret[season][comp].push(team.toObject());
    }
    return ret;
}

export async function autosaveFixtures(body: any) {
    let jid = await autosave(body.user, body.game);

    

    return jid;
}

async function autosave(userId: string, saveId: string) {
    let jid = uuid4();
    let oldSave = (await Save.findByKey(saveId)).toObject();
    delete oldSave.id;
    delete oldSave._id;
    console.log(oldSave);
    let save = new Save.Save(oldSave);
    save.jid = jid;
    save.user = userId;
    save.name = "Autosave";
    save.save();

    let teamsIns = await TeamsIn.findAllBySave(oldSave.jid);
    for (let i in teamsIns) {
        let oldTeam = teamsIns[i].toObject();
        delete oldTeam.id;
        delete oldTeam._id;
        let newTeam = new TeamsIn.TeamsIn(oldTeam);
        newTeam.saveId = jid;
        await newTeam.save();
    }

    let settings = await Settings.getGameSettings(oldSave.jid);
    let dc = await TeamsIn.findLeagueDivisionByKey(settings.team, save.jid, 2019);
    await Settings.newSettings(save.user, save.jid, settings.team, dc.league.name, dc.division.name);

    return jid;
}
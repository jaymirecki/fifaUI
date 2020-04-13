import * as mongoose from "mongoose";
import { ObjectID, ObjectId } from "bson";
import * as Team from "./team";
import * as Division from "./division";
import * as Competition from "./competition";

const uri: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';

var mongooseOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true }
mongoose.connect(uri, mongooseOptions, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("TeamsIn Successfully Connected!");
    }
});

export interface ITeamsIn extends mongoose.Document {
    saveId: string;
    team: string;
    division: string;
    competition: string;
    season: number;
    player: boolean;
};

const TeamsInSchema = new mongoose.Schema({
    saveId: { type: String, required: true },
    team: { type: String, required: true },
    division: { type: String, required: true },
    competition: { type: String, required: true },
    season: { type: Number, required: true },
    player: { type: Boolean, required: false }
});

export const TeamsIn = mongoose.model<ITeamsIn>("TeamsIn", TeamsInSchema);

export async function findAllByTeamSeason(team: string, saveId: string, season: number) {
    let teamIn =  
        await TeamsIn.find({ team: team, saveId: saveId, season: season });
    return teamIn;
}

async function findAllByCompetitionSeason(saveId: string, competition: string, season: number) {
    let teamIn =
        await TeamsIn.find({ competition: competition, saveId: saveId, season: season });
    return teamIn;
}

export async function findAllTeamsByGame(game: string) {
    let teams = await TeamsIn.find({ saveId: game });
    let tlist: Team.ITeam[] = [];
    for (let i in teams) {
        let t = await Team.findByKey(teams[i].team);
        if (t && !tlist.some(x => x.jid === t.jid))
            tlist.push(t);
    }
    return tlist;
}

export async function findLeagueByKey(team: string, saveId: string, season: number) {
    try {
        let dl = await findLeagueDivisionByKey(team, saveId, season);
        return dl.league;
    } catch (error) {
        if (error == "Bad TeamsIn key for LeagueDivision")
            throw "Bad TeamsIn Key for League";
        else
            throw error;
    }

}

export async function findLeagueDivisionByKey(team: string, saveId: string, season: number) {
    let teamsIns = await findAllByTeamSeason(team, saveId, season);
    for (let i in teamsIns) {
        let comp = await Competition.findByKey(teamsIns[i].competition);
        if (comp.league) {
            let div = await Division.findByKey(teamsIns[i].division, teamsIns[i].competition)
            return { league: comp, division: div };
        }
    }
    throw "Bad TeamsIn key for LeagueDivision";
}

export async function findAllCompetitionsByTeamSeason(team: string, saveId: string, season: number) {
    let teamsIns = await findAllByTeamSeason(team, saveId, season);
    let comps = [];
    for (let i in teamsIns) {
        comps.push(await Competition.findByKey(teamsIns[i].competition));
    }
    return comps;
}

export async function copyTeamsFromSaveTeam(saveId: string, team: string, season: number, newSaveId: string, game: string) {
    let cs = await findAllCompetitionsByTeamSeason(team, saveId, season);
    let TISet = new Set<ITeamsIn>();
    for (let i in cs) {
        let ts: ITeamsIn[] = await findAllByCompetitionSeason(saveId, cs[i].name, season);
        for (let j in ts) {
            TISet.add(ts[j]);
        }
    }
    let TIRay = Array.from(TISet.values());
    for (let i in TIRay) {
        let tobject = TIRay[i].toObject();
        delete tobject._id;
        let t = new TeamsIn(tobject);

        t.saveId = newSaveId;
        await t.save();
    }
}

export async function getSavePlayerTeams(saveId: string) {
    let ts = await TeamsIn.find({
        saveId: mongoose.Types.ObjectId(saveId),
        player: true
    });
    return ts;
}

export async function deleteAllBySave(saveId: string) {
    await TeamsIn.deleteMany({ saveId: saveId });
}
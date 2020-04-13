import * as mongoose from "mongoose";
import { ObjectID, ObjectId } from "bson";
import * as Team from "./team";
import * as Division from "./division";
import { ICompetition } from "./competition";
import * as Game from "./game";
import { Save, getTemplateId, getSaveGame } from "./save";

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
    season: number;
    player: boolean;
};

const TeamsInSchema = new mongoose.Schema({
    saveId: { 
        type: String,
        ref: 'Save',
        required: true
    },
    team: { 
        type: String,
        ref: 'Team',
        required: true
    },
    division: { 
        type: String,
        ref: 'Division',
        required: true
    },
    game: { 
        type: String,
        ref: 'Game',
        required: false
    },
    season: { type: Number, required: true },
    player: { type: Boolean, required: false }
});

export const TeamsIn = mongoose.model<ITeamsIn>("TeamsIn", TeamsInSchema);

export async function getAllUniqueTeams() {
    let template = await getTemplateId();
    let teams = await TeamsIn.find({ saveId: template });
    let tlist: any[] = [];
    for (let i in teams) {
        let team = await Team.getTeamById(teams[i].team);
        if (team) {
            tlist.push({
                id: team.id,
                name: team.name
            });
        }
    }
    // teams.forEach(async function(t) {
    //     let team = await Team.getTeamById(t.team);
    //     console.log(team.name);
    //     tlist.add(team.name);
    // });
    return tlist;
}

export async function getTeamBySeason(team: string, season: number, saveId: string) {
    let t = await TeamsIn.find({ team: team, season: season, saveId: saveId });
    return t[0];
}

export async function getTeamsByIDSeason(team: string, season: number, saveId: string) {
    let t = await TeamsIn.find({ team: team, season: season, saveId: saveId });
    return t;
}

export async function getTeamsByGame(game: string) {
    let teams = await TeamsIn.find({ saveId: game });
    let tlist: Team.ITeam[] = [];
    for (let i in teams) {
        let t = await Team.getTeamById(teams[i].team);
        if (t && !tlist.some(x => x.jid === t.jid))
            tlist.push(t);
    }
    return tlist;
}

export async function getTeamCompetition(team: string, saveId: string, season: number) {
    let dc = await getTeamDivisionCompetition(team, saveId, season);
    return dc.competition;
}

export async function getTeamDivisionsCompetitions(team: string, saveId: string, season: number) {
    let ds = await TeamsIn.find({
        team: team,
        saveId: saveId,
        season: season
    });
    let cs: { division: Division.IDivision, competition: ICompetition }[] = [];
    for (let i in ds) {
        let c = await Division.getDivisionCompetition(ds[i].division);
        let d = await Division.getDivisionById(ds[i].division);
        if (c && d)
            cs.push({ division: d, competition: c });
    }
    return cs;
}

export async function getTeamCompetitions(team: string, saveId: string, season: number) {
    let cds = await getTeamDivisionsCompetitions(team, saveId, season);
    let cs: ICompetition[] = [];
    for (let i in cds) {
        cs.push(cds[i].competition);
    }
    return cs;
}

export async function getTeamDivision(team: string, saveId: string, season: number) {
    let dc = await getTeamDivisionCompetition(team, saveId, season);
    return dc.division;
}

export async function getTeamDivisions(team: string, saveId: string, season: number) {
    let cds = await getTeamDivisionsCompetitions(team, saveId, season);
    let cs: Division.IDivision[] = [];
    for (let i in cds) {
        cs.push(cds[i].division);
    }
    return cs;
}

async function getCompetitionTeams(competition: string, saveId: string, season: number, game: string) {
    let ds = await Division.getCompetitionDivisions(game, competition);
    let ts = new Set<ITeamsIn>();
    for (let i in ds) {
        let newts = await TeamsIn.find({
            saveId: saveId,
            season: season,
            division: ds[i].jid
        });
        for (let j in newts) {
            ts.add(newts[j]);
        }
    }
    return Array.from(ts.values());
}

export async function getTeamDivisionCompetition(team: string, saveId: string, season: number) {
    let cs = await getTeamDivisionsCompetitions(team, saveId, season);
    cs.filter(function(c) {
        return c.competition.league == true;
    });
    return cs[0];
}

export async function copyTeamsFromSaveTeam(saveId: string, team: string, season: number, newSaveId: string, game: string) {
    let cs = await getTeamCompetitions(team, saveId, season);
    let TISet = new Set<ITeamsIn>();
    for (let i in cs) {
        let ts: ITeamsIn[] = await getCompetitionTeams(cs[i].name, saveId, season, game);
        for (let j in ts) {
            TISet.add(ts[j]);
        }
    }
    let TIRay = Array.from(TISet.values());
    for (let i in TIRay) {
        let tobject = TIRay[i].toObject();
        delete tobject._id;
        let t = new TeamsIn(tobject);

        // if (t.team == team)
        //     t.player = true;
        // else
        //     t.player = false;

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
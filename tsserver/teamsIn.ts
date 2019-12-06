import * as mongoose from "mongoose";
import { ObjectID, ObjectId } from "bson";
import * as Team from "./team";
import * as Division from "./division";
import { ICompetition } from "./competition";
import * as Game from "./game";
import { Save, getTemplateId } from "./save";

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
    game: string;
    season: number;
    player: boolean;
};

const TeamsInSchema = new mongoose.Schema({
    saveId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Save',
        required: true
    },
    team: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    division: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division',
        required: true
    },
    game: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    season: { type: Number, required: true },
    player: { type: Boolean, required: true }
});

export const TeamsIn = mongoose.model<ITeamsIn>("TeamsIn", TeamsInSchema);

export async function getAllUniqueTeams() {
    let template = await getTemplateId();
    let teams = await TeamsIn.find({ saveId: template });
    let tlist: any[] = [];
    console.log(teams);
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

export async function getTeamByGame(game: string) {
    let template = await getTemplateId();
    let teams = await TeamsIn.find({ game: new mongoose.Types.ObjectId(game) });
    let tlist: Team.ITeam[] = [];
    for (let i in teams) {
        let t = await Team.getTeamById(teams[i].team);
        if (t)
            tlist.push(t);
    }
    return tlist;
}

export async function getTeamCompetition(game: string, team: string, saveId: string, season: number) {
    let dc = await getTeamDivisionCompetition(game, team, saveId, season);
    return dc.competition;
}

export async function getTeamDivisionsCompetitions(game: string, team: string, saveId: string, season: number) {
    let ds = await TeamsIn.find({
        game: mongoose.Types.ObjectId(game),
        team: mongoose.Types.ObjectId(team),
        saveId: mongoose.Types.ObjectId(saveId),
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

export async function getTeamCompetitions(game: string, team: string, saveId: string, season: number) {
    let cds = await getTeamDivisionsCompetitions(game, team, saveId, season);
    let cs: ICompetition[] = [];
    for (let i in cds) {
        cs.push(cds[i].competition);
    }
    return cs;
}

export async function getTeamDivision(game: string, team: string, saveId: string, season: number) {
    let dc = await getTeamDivisionCompetition(game, team, saveId, season);
    return dc.division;
}

async function getCompetitionTeams(game: string, competition: string, saveId: string, season: number) {
    let ds = await Division.getCompetitionDivisions(game, competition);
    let ts = new Set<ITeamsIn>();
    for (let i in ds) {
        let newts = await TeamsIn.find({
            game: game,
            saveId: saveId,
            season: season,
            division: ds[i].id
        });
        for (let j in newts) {
            ts.add(newts[j]);
        }
    }
    return Array.from(ts.values());
}

export async function getTeamDivisionCompetition(game: string, team: string, saveId: string, season: number) {
    let cs = await getTeamDivisionsCompetitions(game, team, saveId, season);
    cs.filter(function(c) {
        return c.competition.league == true;
    });
    return cs[0];
}

export async function getNewTeamsIn(template: string, team: string, saveId: string, game: string) {
    console.log(game);
    let season = await Game.getGameYear(game);
    let cs = await getTeamCompetitions(game, team, template, season);
    let dc = await getTeamDivisionCompetition(game, team, template, season);
    console.log(cs);
    let ts = new Set<ITeamsIn>();
    for (let i in cs) {
        let newts: ITeamsIn[] = await getCompetitionTeams(game, cs[i].id, template, season);
        for (let j in newts) {
            ts.add(newts[j]);
        }
    }
    for (let i in Array.from(ts.values())) {
        let tobject = Array.from(ts.values())[i].toObject();
        delete tobject._id;
        let t = new TeamsIn(tobject);

        if (t.team == team)
            t.player = true;
        t.saveId = saveId;
        t.save();
    }
    return dc;
}

export async function getSavePlayerTeams(saveId: string) {
    let ts = await TeamsIn.find({
        saveId: mongoose.Types.ObjectId(saveId),
        player: true
    });
    return ts;
}
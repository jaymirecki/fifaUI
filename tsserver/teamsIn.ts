import * as mongoose from "mongoose";
import { ObjectID, ObjectId } from "bson";
import * as Team from "./team";
import * as Division from "./division";
import { ICompetition } from "./competition";

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
    player: { type: Boolean, required: true },
});

export const TeamsIn = mongoose.model<ITeamsIn>("TeamsIn", TeamsInSchema);

export async function getAllUniqueTeams() {
    let teams = await TeamsIn.find({});
    let tlist: any[] = [];
    console.log(teams);
    for (let i in teams) {
        let team = await Team.getTeamById(teams[i].team);
        tlist.push({
            id: team.id,
            name: team.name
        });
    }
    // teams.forEach(async function(t) {
    //     let team = await Team.getTeamById(t.team);
    //     console.log(team.name);
    //     tlist.add(team.name);
    // });
    return tlist;
}

export async function getTeamByGame(game: string) {
    let teams = await TeamsIn.find({ game: new mongoose.Types.ObjectId(game) });
    let tlist: Team.ITeam[] = [];
    for (let i in teams) {
        let t = await Team.getTeamById(teams[i].team);
        if (t)
            tlist.push(t);
    }
    return tlist;
}

export async function getTeamCompetition(game: string, team: string) {
    let ds = await TeamsIn.find({ game: mongoose.Types.ObjectId(game), team: mongoose.Types.ObjectId(team) });
    let cs: ICompetition[] = [];
    for (let i in ds) {
        let c = await Division.getDivisionCompetition(ds[i].division);
        if (c)
            cs.push(c);
    }
    cs.filter(function(c) {
        return c.league == true;
    });
    return cs[0];
}
import * as mongoose from "mongoose";

const uri: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';

var mongooseOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true }
mongoose.connect(uri, mongooseOptions, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Competition Successfully Connected!");
    }
});

export interface ICompetition extends mongoose.Document {
    name: string;
    league: boolean;
    start: Date;
};

const CompetitionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    league: {type: Boolean, required: true },
    start: { type: Date, required: true }
});

const Competition = 
    mongoose.model<ICompetition>("Competition", CompetitionSchema);

// export async function getNewCompetitions(id: string, gameId: string, teamName: string) {
//     let comps: ICompetition[] = await Competition.find({ game: id });
//     for (let i in comps) {
//         let c: ICompetition = comps[i];
//         c.team = teamName;
//         c.game = gameId;
//         c = new Competition(c.toObject());
//         await c.save();
//     }
//     return comps[0].competition;
// }

export async function getTeamCompetitions(game: string, team: string) {
    let comps = await Competition.find({ game: game, team: team });
    let compStrings: string[] = [];
    for (let i in comps) {
        compStrings[i] = comps[i].name;
    }
    return compStrings;
}

export async function getCompetitionById(id: string) {
    let comp = await Competition.findById(id);
    return comp;
}

export async function getTeamCompetition(team: string) {
    let c = await Competition.find({ team: team, league: true });
    return c[0];
}
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

interface ICompetition extends mongoose.Document {
    game: string;
    competition: string;
    team: string;
};

const CompetitionSchema = new mongoose.Schema({
    game: { type: String, required: true },
    competition: { type: String, required: true },
    team: { type: String, required: true },
});

const Competition = 
    mongoose.model<ICompetition>("Competition", CompetitionSchema);

export async function getNewCompetitions(id: string, gameId: string, teamName: string) {
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

export async function getTeamCompetitions(game: string, team: string) {
    let comps = await Competition.find({ game: game, team: team });
    let compStrings: string[] = [];
    for (let i in comps) {
        compStrings[i] = comps[i].competition;
    }
    return compStrings;
}
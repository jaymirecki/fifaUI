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
    playoff: boolean;
    start: Date;
};

const CompetitionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    league: {type: Boolean, required: true },
    playoff: {type: Boolean, required: true },
    start: { type: Date, required: true }
});

const Competition = 
    mongoose.model<ICompetition>("Competition", CompetitionSchema);

export async function findByKey(name: string) {
    let key = { name: name };
    let comps = await Competition.find(key);
    if (comps.length > 0)
        return comps[0];
    else
        throw "Bad Competition key: " + JSON.stringify(key);
}
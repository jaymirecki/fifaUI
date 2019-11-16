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
    game: string;
    competition: string;
    team: string;
};

const CompetitionSchema = new mongoose.Schema({
    game: { type: String, required: true },
    competition: { type: String, required: true },
    team: { type: String, required: true },
});

export const Competition = 
    mongoose.model<ICompetition>("Competition", CompetitionSchema);
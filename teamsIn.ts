import * as mongoose from "mongoose";

const uri: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';

mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("TeamsIn Successfully Connected!");
    }
});

export interface ITeamsIn extends mongoose.Document {
    game: string;
    competition: string;
    division: string;
    team: string;
};

const TeamsInSchema = new mongoose.Schema({
    game: { type: String, required: true },
    competition: { type: String, required: true },
    division: { type: String, required: true },
    team: { type: String, required: true }
});

export const TeamsIn = mongoose.model<ITeamsIn>("TeamsIn", TeamsInSchema);
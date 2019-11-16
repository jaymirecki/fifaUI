import * as mongoose from "mongoose";

const uri: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';

mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Team Successfully Connected!");
    }
});

export interface ITeam extends mongoose.Document {
    game: string;
    team: string;
    player: boolean;
};

const TeamSchema = new mongoose.Schema({
    game: { 
        type: String, 
        required: true },
    team: { type: String, required: true },
    player: { type: Boolean, required: true }
});

export const Team = mongoose.model<ITeam>("Team", TeamSchema);
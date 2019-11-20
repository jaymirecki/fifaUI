import * as mongoose from "mongoose";
import { Request } from 'express';
import { Response } from 'express';

const uri: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';

var mongooseOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true }
mongoose.connect(uri, mongooseOptions, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Settings Successfully Connected!");
    }
});

interface ISettings extends mongoose.Document {
    user: string;
    game: string;
    majorVersion: number;
    minorVersion: number;
    team: string;
    competition: string;
    division: string;
};

const SettingsSchema = new mongoose.Schema({
    user: { type: String, required: true },
    game: { type: String, required: true },
    majorVersion: { type: Number, required: true },
    minorVersion: { type: Number, required: true },
    team: { type: String, required: true },
    competition: { type: String, required: true },
    division: { type: String, required: true },
});

const Settings = mongoose.model<ISettings>("Settings", SettingsSchema);

export async function newSettings(user: string, game: string, team: string, competition: string, division: string) {
    let s = {
        user: user,
        game: game,
        majorVersion: 0,
        minorVersion: 1,
        team: team,
        competition: competition,
        division: division
    };
    let settings = new Settings(s);
    settings.save();
}

export async function getGameSettings(game: string) {
    let settings = await Settings.find({ game: game });
    return settings[0].toObject();
}
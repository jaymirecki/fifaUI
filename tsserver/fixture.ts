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
        console.log("Game Successfully Connected!");
    }
});

export interface IFixture extends mongoose.Document {
    jid: string;
    saveId: string;
    date: Date;
    competition: string;
    season: number;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    homePen: number;
    awayPen: number;
};

const FixtureSchema = new mongoose.Schema({
    jid: { type: String, required: true},
    saveId: { type: String, required: true },
    date: { type: Date, required: true},
    competition: { type: String, required: true },
    season: { type: Number, required: true },
    homeTeam: { type: String, required: true},
    awayTeam: { type: String, required: true},
    homeScore: { type: Number, required: false},
    awayScore: { type: Number, required: false},
    homePen: { type: Number, required: false},
    awayPen: { type: Number, required: false}
});

export const Fixture = mongoose.model<IFixture>("Fixture", FixtureSchema);
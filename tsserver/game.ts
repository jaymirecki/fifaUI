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

interface IGame extends mongoose.Document {
    date: Date;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    length: string;
};

const GameSchema = new mongoose.Schema({
    date: { type: Date, required: true},
    homeTeam: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Team",
        required: true},
    awayTeam: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Team",
        required: true},
    homeScore: { type: Number, required: true},
    awayScore: { type: Number, required: true},
    length: { type: String, required: true}
});

const Game = mongoose.model<IGame>("Game", GameSchema);
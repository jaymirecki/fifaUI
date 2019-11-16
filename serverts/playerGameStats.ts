import * as mongoose from "mongoose";

const uri: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';

mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Successfully Connected!");
    }
});

interface IPlayerGameStats extends mongoose.Document {
    player: string;
    game: string;
    rating: number;
    minutes: number;
    goals: number;
    assists: number;
    yellow: boolean;
    red: boolean;
    shots: number;
    sot: number;
    passes: number;
    pc: number;
    dribbles: number;
    dc: number;
    crosses: number;
    cc: number;
    tackles: number;
    ts: number;
    saves: number;
    ga: number;
};

const PlayerGameStatsSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true },
    rating: { type: Number, required: false },
    minutes: { type: Number, required: false },
    goals: { type: Number, required: false },
    assists: { type: Number, required: false },
    yellow: { type: Boolean, required: false },
    red: { type: Boolean, required: false },
    shots: { type: Number, required: false },
    sot: { type: Number, required: false },
    passes: { type: Number, required: false },
    pc: { type: Number, required: false },
    dribbles: { type: Number, required: false },
    dc: { type: Number, required: false },
    crosses: { type: Number, required: false },
    cc: { type: Number, required: false },
    tackles: { type: Number, required: false },
    ts: { type: Number, required: false },
    saves: { type: Number, required: false },
    ga: { type: Number, required: false },
});

const PlayerGameStats = 
    mongoose.model<IPlayerGameStats>("PlayerGameStats", 
                                     PlayerGameStatsSchema);
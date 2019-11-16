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
        console.log("Database Successfully Connected!");
    }
});

interface IPlayer extends mongoose.Document {
    name: string;
    team: string;
    position: string[];
    ovr: number;
    age: number;
    wage: number;
    contract: Date;
    value: number;
    nationality: string;
};

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    team: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Team', 
            required: true },
    position: { type: [String], required: true },
    ovr: { type: Number, required: false },
    age: { type: Number, required: false },
    wage: { type: Number, required: false },
    contract: { type: Date, required: false },
    value: { type: Number, required: false },
    nationality: { type: String, required: false }
});

const Player = 
    mongoose.model<IPlayer>("Player", PlayerSchema);
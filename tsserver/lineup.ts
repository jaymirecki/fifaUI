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
        console.log("Lineup Successfully Connected!");
    }
});

interface ILineup extends mongoose.Document {
    game: string;
    lineup: string;
    team: string;
};

const LineupSchema = new mongoose.Schema({
    game: { type: String, required: true },
    lineup: { type: String, required: true },
    team: { type: String, required: true },
});

const Lineup = 
    mongoose.model<ILineup>("Lineup", LineupSchema);

interface IInLineup extends mongoose.Document {
    game: string;
    player: string;
    lineup: string;
    position: string;
};

const InLineupSchema = new mongoose.Schema({
    game: { type: String, required: true },
    player: { type: String, required: true },
    lineup: { type: String, required: true },
    position: { type: String, required: true }
});

const InLineup = mongoose.model<IInLineup>("InLineup", InLineupSchema);
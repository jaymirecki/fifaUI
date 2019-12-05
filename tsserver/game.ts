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
    name: string
};

const GameSchema = new mongoose.Schema({
    name: { type: String, required: true}
});

const Game = mongoose.model<IGame>("Game", GameSchema);

export async function getAllGames() {
    let games = await Game.find({});
    let glist: any[] = [];
    for (let i in games) {
        glist.push({
            name: games[i].name,
            id: games[i].id
        });
    }
    return glist;
}
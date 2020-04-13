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
    name: string;
    year: number;
};

const GameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true }
});

const Game = mongoose.model<IGame>("Game", GameSchema);

export async function getAllGames() {
    let games = await Game.find({});
    let glist: IGame[] = [];
    for (let i in games) {
        glist.push(games[i]);
    }
    return glist;
}

export async function getGameById(id: string) {
    let g = await Game.find({ name: id });
    return g[0];
}

export async function getGameYear(game: string) {
    let g = await getGameById(game);
    if (g)
        return g.year;
    return 2020;
}

export async function getGameByName(name: string) {
    let g = await Game.findOne({ name: name });
    if (g)
        return g;
    let gs = await getAllGames();
    return gs[0];
}
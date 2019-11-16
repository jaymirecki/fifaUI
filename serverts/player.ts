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
    firstName: string;
    lastName: string;
    game: string;
    team: string;
    position: string[];
    ovr: number;
    age: Date;
    wage: number;
    contract: Date;
    value: number;
    nationality: string;
    gk: number;
    sw: number;
    rwb: number;
    rb: number;
    cb: number;
    lb: number;
    lwb: number;
    cdm: number;
    rm: number;
    cm: number;
    lm: number;
    cam: number;
    cf: number;
    rw: number;
    st: number;
    lw: number;
};

const PlayerSchema = new mongoose.Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: true },
    game: { type: String, required: true },
    team: { type: String, required: true },
    ovr: { type: Number, required: false },
    age: { type: Date, required: false },
    wage: { type: Number, required: false },
    contract: { type: Date, required: false },
    value: { type: Number, required: false },
    nationality: { type: String, required: false },
    gk: { type: Number, required: true },
    sw: { type: Number, required: true },
    rwb: { type: Number, required: true },
    rb: { type: Number, required: true },
    cb: { type: Number, required: true },
    lb: { type: Number, required: true },
    lwb: { type: Number, required: true },
    cdm: { type: Number, required: true },
    rm: { type: Number, required: true },
    cm: { type: Number, required: true },
    lm: { type: Number, required: true },
    cam: { type: Number, required: true },
    cf: { type: Number, required: true },
    rw: { type: Number, required: true },
    st: { type: Number, required: true },
    lw: { type: Number, required: true }
});

const Player = 
    mongoose.model<IPlayer>("Player", PlayerSchema);

export async function getTeamPlayers(game: string, team: string) {
    let players = await Player.find({ game: game, team: team });
    let playerObjects: IPlayer[] = [];
    for (let i in players) {
        playerObjects[i] = players[i].toObject();
    }
    return playerObjects;
}

export async function getGamePlayers(game: string) {
    let players = await Player.find({ game: game });
    let playerObjects: IPlayer[] = [];
    for (let i in players) {
        playerObjects[i] = players[i].toObject();
    }
    return playerObjects;
}

export async function getNewPlayers(id: string, gameId: string, teamName: string) {
    let players = await Player.find({ game: id, team: teamName });
    for (let i in players) {
        let p = players[i];
        p.game = gameId;
        p.age = new Date(p.age);
        p.contract = new Date(p.age);
        p = new Player(p.toObject());
        p.save()
    }
}
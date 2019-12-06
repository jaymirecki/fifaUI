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
        console.log("PlayerDynamicInfo Successfully Connected!");
    }
});

interface IPlayerDynamicInfo extends mongoose.Document {
    saveId: string;
    player: string;
    ovr: number;
    wage: number;
    contractExpiration: Date;
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

const PlayerDynamicInfoSchema = new mongoose.Schema({
    saveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Save",
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlayerStaticInfo",
        required: true
    },
    ovr: { type: Number, required: true },
    wage: { type: Number, required: true },
    contractExpiration: { type: Date, required: true },
    value: { type: Number, required: true },
    nationality: { type: String, required: true },
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
    lw: { type: Number, required: true },
});

const PlayerDynamicInfo = 
    mongoose.model<IPlayerDynamicInfo>("PlayerDynamicInfo", PlayerDynamicInfoSchema);

export async function getTeamPlayers(game: string, team: string) {
    let players = await PlayerDynamicInfo.find({ game: game, team: team });
    let playerObjects: any = [];
    for (let i in players) {
        playerObjects[i] = players[i].toObject();
    }

    let positions = ["gk", "sw", "rwb", "rb", "cb", "lb", "lwb", "cdm", "rm", "cm", "lm", "cam", "cf", "rw", "st", "lw"];
    for (let k in playerObjects) {
        let p = playerObjects[k];
        p.position = "";
        for (let j = 1; j < 5; j++) {
            for (let i in positions) {
                if (p[positions[i]] == j)
                p.position = p.position + positions[i].toUpperCase() + ",";
            }
        }
        p.position = p.position.substring(0, p.position.length - 1);
        for (let i in positions) {
            delete p[positions[i]];
        }
        playerObjects[k] = p;
    }

    return playerObjects;
}

export async function getGamePlayers(game: string) {
    let players = await PlayerDynamicInfo.find({ game: game });
    let playerObjects: IPlayerDynamicInfo[] = [];
    for (let i in players) {
        playerObjects[i] = players[i].toObject();
    }
    return playerObjects;
}

export async function getNewPlayers(id: string, team: string, newId: string) {
    let players = await PlayerDynamicInfo.find({ saveId: mongoose.Types.ObjectId(id), team: mongoose.Types.ObjectId(team) });
    for (let i in players) {
        let p = players[i];
        p.saveId = newId;
        p.contractExpiration = p.contractExpiration;
        p = new PlayerDynamicInfo(p.toObject());
        p.save();
    }
}
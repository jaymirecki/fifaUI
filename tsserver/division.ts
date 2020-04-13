import * as mongoose from "mongoose";
import { ObjectID } from "bson";
import * as Competition from "./competition";

const uri: string = 
    process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';

var mongooseOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true }
mongoose.connect(uri, mongooseOptions, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Division Successfully Connected!");
    }
});

export interface IDivision extends mongoose.Document {
    jid: string;
    name: string;
    competition: string;
    tier: number;
};

const DivisionSchema = new mongoose.Schema({
    jid: { type: String, required: true },
    name: { type: String, required: true },
    competition: { type: String, required: true },
    tier: { type: String, required: true }
});

const Division = 
    mongoose.model<IDivision>("Division", DivisionSchema);

// export async function getNewDivisions(id: string, gameId: string) {
//     let divs: IDivision[] = await Division.find({ game: id });
//     for (let i in divs) {
//         let d = divs[i];
//         d.game = gameId;
//         d = new Division(d.toObject());
//         d.save();
//     }
//     return divs[0].division;
// }

export async function getAllDivisions() {
    let divs = await Division.find({});
    return divs;
}

export async function getCompetitionDivisions(game: string, competition: string) {
    let divs = await Division.find({ competition: competition});
    return divs;
}

export async function getDivisionCompetition(division: string) {
    let cid = await Division.find({ jid: division });
    let c = await Competition.getCompetitionByKey(cid[0].competition);
    // let comp = c.toObject();
    return c;
}

export async function getDivisionById(division: string) {
    let d = await Division.find({ jid: division });
    return d[0];
}
import * as mongoose from "mongoose";
import { ObjectID } from "bson";
import * as Competition from "./competition";
import * as Error from "./error";

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

export async function findByKey(name: string, competition: string) {
    let d = await Division.find({ name: name, competition: competition });
    return Error.CheckKeyResult(d, "Division");
}

export async function findAllByCompetition(competition: string) {
    let ds = await Division.find({ competition: competition });
    return ds;
}
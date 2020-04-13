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
        console.log("Team Successfully Connected!");
    }
});

export interface ITeam extends mongoose.Document {
    jid: string;
    name: string;
};

const TeamSchema = new mongoose.Schema({
    jid: { type: String, required: true },
    name: { type: String, required: true }
});

const Team = mongoose.model<ITeam>("Team", TeamSchema);

export async function findByKey(jid: string) {
    let t = await Team.find({ jid: jid });
    return t[0];
}
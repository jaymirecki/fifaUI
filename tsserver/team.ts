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
    game: string;
    team: string;
    player: boolean;
};

const TeamSchema = new mongoose.Schema({
    game: { 
        type: String, 
        required: true },
    team: { type: String, required: true },
    player: { type: Boolean, required: true }
});

export const Team = mongoose.model<ITeam>("Team", TeamSchema);

export async function getNewTeams(id: string, gameId: string, teamName: string) {
    let teams: ITeam[] = await Team.find({ game: id });
    for (let i in teams) {
        let t: ITeam = teams[i];
        t.game = gameId;
        if (t.team == teamName) {
            t.player = true;
            t = new Team(t.toObject());
            t.save();
        } else {
            t.player = false;
            new Team(t.toObject()).save();
        }
    }
}

export async function getGamePlayerTeams(game: string) {
    let teams = await Team.find({ game: game, player: true });
    let teamNames: string[] = [];
    for (let i in teams) {
        teamNames[i] = teams[i].team;
    }
    return teamNames;
}
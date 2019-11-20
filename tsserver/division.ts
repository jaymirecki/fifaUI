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
        console.log("Division Successfully Connected!");
    }
});

interface IDivision extends mongoose.Document {
    game: string;
    competition: string;
    division: string;
};

const DivisionSchema = new mongoose.Schema({
    game: { type: String, required: true },
    competition: { type: String, required: true },
    division: { type: String, required: true },
});

const Division = 
    mongoose.model<IDivision>("Division", DivisionSchema);

export async function getNewDivisions(id: string, gameId: string) {
    let divs: IDivision[] = await Division.find({ game: id });
    for (let i in divs) {
        let d = divs[i];
        d.game = gameId;
        d = new Division(d.toObject());
        d.save();
    }
    return divs[0].division;
}

export async function getCompetitionDivisions(game: string, competition: string) {
    let divs = await Division.find({ game: game, competition: competition});
    let divStrings: string[] = []
    for (let i in divs) {
        divStrings[i] = divs[i].division;
    }
    return divStrings;
}
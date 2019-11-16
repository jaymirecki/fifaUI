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

export interface IDivision extends mongoose.Document {
    game: string;
    competition: string;
    division: string;
};

const DivisionSchema = new mongoose.Schema({
    game: { type: String, required: true },
    competition: { type: String, required: true },
    division: { type: String, required: true },
});

export const Division = 
    mongoose.model<IDivision>("Division", DivisionSchema);
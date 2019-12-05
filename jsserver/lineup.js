"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';
var mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(uri, mongooseOptions, function (err) {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Lineup Successfully Connected!");
    }
});
;
var LineupSchema = new mongoose.Schema({
    game: { type: String, required: true },
    lineup: { type: String, required: true },
    team: { type: String, required: true }
});
var Lineup = mongoose.model("Lineup", LineupSchema);
;
var InLineupSchema = new mongoose.Schema({
    game: { type: String, required: true },
    player: { type: String, required: true },
    lineup: { type: String, required: true },
    position: { type: String, required: true }
});
var InLineup = mongoose.model("InLineup", InLineupSchema);

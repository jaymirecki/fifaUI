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
        console.log("Game Successfully Connected!");
    }
});
;
var FixtureSchema = new mongoose.Schema({
    jid: { type: String, required: true },
    saveId: { type: String, required: true },
    date: { type: Date, required: true },
    competition: { type: String, required: true },
    season: { type: Number, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    homeScore: { type: Number, required: false },
    awayScore: { type: Number, required: false },
    homePen: { type: Number, required: false },
    awayPen: { type: Number, required: false }
});
exports.Fixture = mongoose.model("Fixture", FixtureSchema);

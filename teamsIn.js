"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';
mongoose.connect(uri, function (err) {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("TeamsIn Successfully Connected!");
    }
});
;
var TeamsInSchema = new mongoose.Schema({
    game: { type: String, required: true },
    competition: { type: String, required: true },
    division: { type: String, required: true },
    team: { type: String, required: true }
});
exports.TeamsIn = mongoose.model("TeamsIn", TeamsInSchema);

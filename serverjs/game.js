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
        console.log("Database Successfully Connected!");
    }
});
;
var GameSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    homeTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    homeScore: { type: Number, required: true },
    awayScore: { type: Number, required: true },
    length: { type: String, required: true }
});
var Game = mongoose.model("Game", GameSchema);

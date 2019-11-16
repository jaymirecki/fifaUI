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
        console.log("Team Successfully Connected!");
    }
});
;
var TeamSchema = new mongoose.Schema({
    game: {
        type: String,
        required: true
    },
    team: { type: String, required: true },
    player: { type: Boolean, required: true }
});
exports.Team = mongoose.model("Team", TeamSchema);

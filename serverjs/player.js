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
var PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    position: { type: [String], required: true },
    ovr: { type: Number, required: false },
    age: { type: Number, required: false },
    wage: { type: Number, required: false },
    contract: { type: Date, required: false },
    value: { type: Number, required: false },
    nationality: { type: String, required: false }
});
var Player = mongoose.model("Player", PlayerSchema);

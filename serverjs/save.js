"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var validator_1 = require("validator");
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
        console.log("Save Successfully Connected!");
    }
});
;
var SaveSchema = new mongoose.Schema({
    user: { type: String, required: true },
    shared: { type: Boolean, required: true },
    name: { type: String, required: true },
    managerName: { type: String, required: true },
    date: { type: Date, required: true },
    game: { type: String, required: true },
    doc: { type: Date, required: true },
    dom: { type: Date, required: true }
});
exports.Save = mongoose.model("Save", SaveSchema);
exports.save = function (req, res) {
    console.log(req.body);
    var saveObject = validateSave(req.body);
    console.log(saveObject);
    saveObject.dom = new Date();
    var save = new exports.Save(saveObject);
    save.save(function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send(save);
        }
    });
};
exports.getSave = function (req, res) {
    var save = exports.Save.findById(req.query.id, function (err, save) {
        if (err) {
            res.send({ success: false, error: err });
        }
        else {
            res.send({ success: true, save: save });
        }
    });
};
exports.getSaves = function (req, res) {
    console.log(req.query);
    exports.Save.find({ user: req.query.user }, function (err, saves) {
        if (err) {
            res.send({ error: err });
        }
        else {
            res.send(saves);
        }
    });
};
var validateSave = function (save) {
    save.user = validator_1.escape(save.user);
    save.name = validator_1.escape(save.name);
    save.managerName = validator_1.escape(save.managerName);
    save.game = validator_1.escape(save.game);
    save.dom = new Date(parseInt(save.dom));
    save.doc = new Date(parseInt(save.doc));
    save.date = new Date(parseInt(save.date));
    save.shared = (save.shared == "true");
    if (save.dom < save.doc) {
        save.dom = save.doc;
    }
    return save;
};

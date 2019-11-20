"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        console.log("Division Successfully Connected!");
    }
});
;
var DivisionSchema = new mongoose.Schema({
    game: { type: String, required: true },
    competition: { type: String, required: true },
    division: { type: String, required: true }
});
var Division = mongoose.model("Division", DivisionSchema);
function getNewDivisions(id, gameId) {
    return __awaiter(this, void 0, void 0, function () {
        var divs, i, d;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Division.find({ game: id })];
                case 1:
                    divs = _a.sent();
                    for (i in divs) {
                        d = divs[i];
                        d.game = gameId;
                        d = new Division(d.toObject());
                        d.save();
                    }
                    return [2 /*return*/, divs[0].division];
            }
        });
    });
}
exports.getNewDivisions = getNewDivisions;
function getCompetitionDivisions(game, competition) {
    return __awaiter(this, void 0, void 0, function () {
        var divs, divStrings, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Division.find({ game: game, competition: competition })];
                case 1:
                    divs = _a.sent();
                    divStrings = [];
                    for (i in divs) {
                        divStrings[i] = divs[i].division;
                    }
                    return [2 /*return*/, divStrings];
            }
        });
    });
}
exports.getCompetitionDivisions = getCompetitionDivisions;
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
var Team = require("./team");
var Division = require("./division");
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
        console.log("TeamsIn Successfully Connected!");
    }
});
;
var TeamsInSchema = new mongoose.Schema({
    saveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Save',
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division',
        required: true
    },
    player: { type: Boolean, required: true }
});
exports.TeamsIn = mongoose.model("TeamsIn", TeamsInSchema);
function getAllUniqueTeams() {
    return __awaiter(this, void 0, void 0, function () {
        var teams, tlist, _a, _b, _i, i, team;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, exports.TeamsIn.find({})];
                case 1:
                    teams = _c.sent();
                    tlist = [];
                    console.log(teams);
                    _a = [];
                    for (_b in teams)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    i = _a[_i];
                    return [4 /*yield*/, Team.getTeamById(teams[i].team)];
                case 3:
                    team = _c.sent();
                    tlist.push({
                        id: team.id,
                        name: team.name
                    });
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: 
                // teams.forEach(async function(t) {
                //     let team = await Team.getTeamById(t.team);
                //     console.log(team.name);
                //     tlist.add(team.name);
                // });
                return [2 /*return*/, tlist];
            }
        });
    });
}
exports.getAllUniqueTeams = getAllUniqueTeams;
function getTeamByGame(game) {
    return __awaiter(this, void 0, void 0, function () {
        var teams, tlist, _a, _b, _i, i, t;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, exports.TeamsIn.find({ game: new mongoose.Types.ObjectId(game) })];
                case 1:
                    teams = _c.sent();
                    tlist = [];
                    _a = [];
                    for (_b in teams)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    i = _a[_i];
                    return [4 /*yield*/, Team.getTeamById(teams[i].team)];
                case 3:
                    t = _c.sent();
                    if (t)
                        tlist.push(t);
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, tlist];
            }
        });
    });
}
exports.getTeamByGame = getTeamByGame;
function getTeamCompetition(game, team) {
    return __awaiter(this, void 0, void 0, function () {
        var ds, cs, _a, _b, _i, i, c;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, exports.TeamsIn.find({ game: mongoose.Types.ObjectId(game), team: mongoose.Types.ObjectId(team) })];
                case 1:
                    ds = _c.sent();
                    cs = [];
                    _a = [];
                    for (_b in ds)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    i = _a[_i];
                    return [4 /*yield*/, Division.getDivisionCompetition(ds[i].division)];
                case 3:
                    c = _c.sent();
                    if (c)
                        cs.push(c);
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    cs.filter(function (c) {
                        return c.league == true;
                    });
                    return [2 /*return*/, cs[0]];
            }
        });
    });
}
exports.getTeamCompetition = getTeamCompetition;

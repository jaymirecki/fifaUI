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
var Game = require("./game");
var save_1 = require("./save");
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
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    season: { type: Number, required: true },
    player: { type: Boolean, required: true }
});
exports.TeamsIn = mongoose.model("TeamsIn", TeamsInSchema);
function getAllUniqueTeams() {
    return __awaiter(this, void 0, void 0, function () {
        var template, teams, tlist, _a, _b, _i, i, team;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, save_1.getTemplateId()];
                case 1:
                    template = _c.sent();
                    return [4 /*yield*/, exports.TeamsIn.find({ saveId: template })];
                case 2:
                    teams = _c.sent();
                    tlist = [];
                    console.log(teams);
                    _a = [];
                    for (_b in teams)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    i = _a[_i];
                    return [4 /*yield*/, Team.getTeamById(teams[i].team)];
                case 4:
                    team = _c.sent();
                    if (team) {
                        tlist.push({
                            id: team.id,
                            name: team.name
                        });
                    }
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: 
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
        var template, teams, tlist, _a, _b, _i, i, t;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, save_1.getTemplateId()];
                case 1:
                    template = _c.sent();
                    return [4 /*yield*/, exports.TeamsIn.find({ game: new mongoose.Types.ObjectId(game) })];
                case 2:
                    teams = _c.sent();
                    tlist = [];
                    _a = [];
                    for (_b in teams)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    i = _a[_i];
                    return [4 /*yield*/, Team.getTeamById(teams[i].team)];
                case 4:
                    t = _c.sent();
                    if (t)
                        tlist.push(t);
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, tlist];
            }
        });
    });
}
exports.getTeamByGame = getTeamByGame;
function getTeamCompetition(game, team, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var dc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTeamDivisionCompetition(game, team, saveId, season)];
                case 1:
                    dc = _a.sent();
                    return [2 /*return*/, dc.competition];
            }
        });
    });
}
exports.getTeamCompetition = getTeamCompetition;
function getTeamDivisionsCompetitions(game, team, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var ds, cs, _a, _b, _i, i, c, d;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, exports.TeamsIn.find({
                        game: mongoose.Types.ObjectId(game),
                        team: mongoose.Types.ObjectId(team),
                        saveId: mongoose.Types.ObjectId(saveId),
                        season: season
                    })];
                case 1:
                    ds = _c.sent();
                    cs = [];
                    _a = [];
                    for (_b in ds)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    i = _a[_i];
                    return [4 /*yield*/, Division.getDivisionCompetition(ds[i].division)];
                case 3:
                    c = _c.sent();
                    return [4 /*yield*/, Division.getDivisionById(ds[i].division)];
                case 4:
                    d = _c.sent();
                    if (c && d)
                        cs.push({ division: d, competition: c });
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/, cs];
            }
        });
    });
}
exports.getTeamDivisionsCompetitions = getTeamDivisionsCompetitions;
function getTeamCompetitions(game, team, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var cds, cs, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTeamDivisionsCompetitions(game, team, saveId, season)];
                case 1:
                    cds = _a.sent();
                    cs = [];
                    for (i in cds) {
                        cs.push(cds[i].competition);
                    }
                    return [2 /*return*/, cs];
            }
        });
    });
}
exports.getTeamCompetitions = getTeamCompetitions;
function getTeamDivision(game, team, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var dc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTeamDivisionCompetition(game, team, saveId, season)];
                case 1:
                    dc = _a.sent();
                    return [2 /*return*/, dc.division];
            }
        });
    });
}
exports.getTeamDivision = getTeamDivision;
function getCompetitionTeams(game, competition, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var ds, ts, _a, _b, _i, i, newts, j;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Division.getCompetitionDivisions(game, competition)];
                case 1:
                    ds = _c.sent();
                    ts = new Set();
                    _a = [];
                    for (_b in ds)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    i = _a[_i];
                    return [4 /*yield*/, exports.TeamsIn.find({
                            game: game,
                            saveId: saveId,
                            season: season,
                            division: ds[i].id
                        })];
                case 3:
                    newts = _c.sent();
                    for (j in newts) {
                        ts.add(newts[j]);
                    }
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, Array.from(ts.values())];
            }
        });
    });
}
function getTeamDivisionCompetition(game, team, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var cs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTeamDivisionsCompetitions(game, team, saveId, season)];
                case 1:
                    cs = _a.sent();
                    cs.filter(function (c) {
                        return c.competition.league == true;
                    });
                    return [2 /*return*/, cs[0]];
            }
        });
    });
}
exports.getTeamDivisionCompetition = getTeamDivisionCompetition;
function getNewTeamsIn(template, team, saveId, game) {
    return __awaiter(this, void 0, void 0, function () {
        var season, cs, dc, ts, _a, _b, _i, i, newts, j, i, tobject, t;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log(game);
                    return [4 /*yield*/, Game.getGameYear(game)];
                case 1:
                    season = _c.sent();
                    return [4 /*yield*/, getTeamCompetitions(game, team, template, season)];
                case 2:
                    cs = _c.sent();
                    return [4 /*yield*/, getTeamDivisionCompetition(game, team, template, season)];
                case 3:
                    dc = _c.sent();
                    console.log(cs);
                    ts = new Set();
                    _a = [];
                    for (_b in cs)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    i = _a[_i];
                    return [4 /*yield*/, getCompetitionTeams(game, cs[i].id, template, season)];
                case 5:
                    newts = _c.sent();
                    for (j in newts) {
                        ts.add(newts[j]);
                    }
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    for (i in Array.from(ts.values())) {
                        tobject = Array.from(ts.values())[i].toObject();
                        delete tobject._id;
                        t = new exports.TeamsIn(tobject);
                        if (t.team == team)
                            t.player = true;
                        t.saveId = saveId;
                        t.save();
                    }
                    return [2 /*return*/, dc];
            }
        });
    });
}
exports.getNewTeamsIn = getNewTeamsIn;
function getSavePlayerTeams(saveId) {
    return __awaiter(this, void 0, void 0, function () {
        var ts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.TeamsIn.find({
                        saveId: mongoose.Types.ObjectId(saveId),
                        player: true
                    })];
                case 1:
                    ts = _a.sent();
                    return [2 /*return*/, ts];
            }
        });
    });
}
exports.getSavePlayerTeams = getSavePlayerTeams;

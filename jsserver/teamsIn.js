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
var Competition = require("./competition");
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
    saveId: { type: String, required: true },
    team: { type: String, required: true },
    division: { type: String, required: true },
    competition: { type: String, required: true },
    season: { type: Number, required: true },
    player: { type: Boolean, required: false }
});
exports.TeamsIn = mongoose.model("TeamsIn", TeamsInSchema);
function findAllByTeamSeason(team, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var teamIn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.TeamsIn.find({ team: team, saveId: saveId, season: season })];
                case 1:
                    teamIn = _a.sent();
                    return [2 /*return*/, teamIn];
            }
        });
    });
}
exports.findAllByTeamSeason = findAllByTeamSeason;
function findAllByCompetitionSeason(saveId, competition, season) {
    return __awaiter(this, void 0, void 0, function () {
        var teamIn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.TeamsIn.find({ competition: competition, saveId: saveId, season: season })];
                case 1:
                    teamIn = _a.sent();
                    return [2 /*return*/, teamIn];
            }
        });
    });
}
function findAllTeamsByGame(game) {
    return __awaiter(this, void 0, void 0, function () {
        var teams, tlist, _loop_1, _a, _b, _i, i;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, exports.TeamsIn.find({ saveId: game })];
                case 1:
                    teams = _c.sent();
                    tlist = [];
                    _loop_1 = function (i) {
                        var t;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Team.findByKey(teams[i].team)];
                                case 1:
                                    t = _a.sent();
                                    if (t && !tlist.some(function (x) { return x.jid === t.jid; }))
                                        tlist.push(t);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = [];
                    for (_b in teams)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    i = _a[_i];
                    return [5 /*yield**/, _loop_1(i)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, tlist];
            }
        });
    });
}
exports.findAllTeamsByGame = findAllTeamsByGame;
function findLeagueByKey(team, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var dl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, findLeagueDivisionByKey(team, saveId, season)];
                case 1:
                    dl = _a.sent();
                    return [2 /*return*/, dl.league];
                case 2:
                    error_1 = _a.sent();
                    if (error_1 == "Bad TeamsIn key for LeagueDivision")
                        throw "Bad TeamsIn Key for League";
                    else
                        throw error_1;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.findLeagueByKey = findLeagueByKey;
function findLeagueDivisionByKey(team, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var teamsIns, _a, _b, _i, i, comp, div;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, findAllByTeamSeason(team, saveId, season)];
                case 1:
                    teamsIns = _c.sent();
                    _a = [];
                    for (_b in teamsIns)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    i = _a[_i];
                    return [4 /*yield*/, Competition.findByKey(teamsIns[i].competition)];
                case 3:
                    comp = _c.sent();
                    if (!comp.league) return [3 /*break*/, 5];
                    return [4 /*yield*/, Division.findByKey(teamsIns[i].division, teamsIns[i].competition)];
                case 4:
                    div = _c.sent();
                    return [2 /*return*/, { league: comp, division: div }];
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: throw "Bad TeamsIn key for LeagueDivision";
            }
        });
    });
}
exports.findLeagueDivisionByKey = findLeagueDivisionByKey;
function findAllCompetitionsByTeamSeason(team, saveId, season) {
    return __awaiter(this, void 0, void 0, function () {
        var teamsIns, comps, _a, _b, _i, i, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, findAllByTeamSeason(team, saveId, season)];
                case 1:
                    teamsIns = _e.sent();
                    comps = [];
                    _a = [];
                    for (_b in teamsIns)
                        _a.push(_b);
                    _i = 0;
                    _e.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    i = _a[_i];
                    _d = (_c = comps).push;
                    return [4 /*yield*/, Competition.findByKey(teamsIns[i].competition)];
                case 3:
                    _d.apply(_c, [_e.sent()]);
                    _e.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, comps];
            }
        });
    });
}
exports.findAllCompetitionsByTeamSeason = findAllCompetitionsByTeamSeason;
function copyTeamsFromSaveTeam(saveId, team, season, newSaveId, game) {
    return __awaiter(this, void 0, void 0, function () {
        var cs, TISet, _a, _b, _i, i, ts, j, TIRay, _c, _d, _e, i, tobject, t;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, findAllCompetitionsByTeamSeason(team, saveId, season)];
                case 1:
                    cs = _f.sent();
                    TISet = new Set();
                    _a = [];
                    for (_b in cs)
                        _a.push(_b);
                    _i = 0;
                    _f.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    i = _a[_i];
                    return [4 /*yield*/, findAllByCompetitionSeason(saveId, cs[i].name, season)];
                case 3:
                    ts = _f.sent();
                    for (j in ts) {
                        TISet.add(ts[j]);
                    }
                    _f.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    TIRay = Array.from(TISet.values());
                    _c = [];
                    for (_d in TIRay)
                        _c.push(_d);
                    _e = 0;
                    _f.label = 6;
                case 6:
                    if (!(_e < _c.length)) return [3 /*break*/, 9];
                    i = _c[_e];
                    tobject = TIRay[i].toObject();
                    delete tobject._id;
                    t = new exports.TeamsIn(tobject);
                    t.saveId = newSaveId;
                    return [4 /*yield*/, t.save()];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8:
                    _e++;
                    return [3 /*break*/, 6];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.copyTeamsFromSaveTeam = copyTeamsFromSaveTeam;
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
function deleteAllBySave(saveId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.TeamsIn.deleteMany({ saveId: saveId })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteAllBySave = deleteAllBySave;

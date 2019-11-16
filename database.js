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
var save_1 = require("./save");
exports.save = save_1.save;
exports.getSave = save_1.getSave;
exports.getSaves = save_1.getSaves;
var team_1 = require("./team");
var competition_1 = require("./competition");
var division_1 = require("./division");
var teamsIn_1 = require("./teamsIn");
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
exports["default"] = { save: save_1.save, getSave: save_1.getSave, getSaves: save_1.getSaves };
function createNewSave(s) {
    return __awaiter(this, void 0, void 0, function () {
        var id, saveObject, save;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = s.game + s.league;
                    saveObject = {
                        user: s.user,
                        shared: false,
                        name: s.name,
                        managerName: s.managerName,
                        date: new Date(),
                        game: s.game,
                        doc: new Date(parseInt(s.doc)),
                        dom: new Date(parseInt(s.doc))
                    };
                    save = new save_1.Save(saveObject);
                    return [4 /*yield*/, save.save()];
                case 1:
                    _a.sent();
                    getNewTeams(id, save.id, s.team);
                    getNewCompetitions(id, save.id, s.team);
                    getNewDivisions(id, save.id);
                    getNewTeamsIn(id, save.id);
                    return [2 /*return*/, save.id];
            }
        });
    });
}
exports.createNewSave = createNewSave;
;
function getNewTeams(id, gameId, teamName) {
    return __awaiter(this, void 0, void 0, function () {
        var teams, i, t;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, team_1.Team.find({ game: id })];
                case 1:
                    teams = _a.sent();
                    for (i in teams) {
                        t = teams[i];
                        t.game = gameId;
                        console.log("Team: " + t.team);
                        if (t.team == teamName) {
                            t.player = true;
                            t = new team_1.Team(t.toObject());
                            t.save();
                        }
                        else {
                            t.player = false;
                            new team_1.Team(t.toObject()).save();
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getNewCompetitions(id, gameId, teamName) {
    return __awaiter(this, void 0, void 0, function () {
        var comps, _a, _b, _i, i, c;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, competition_1.Competition.find({ game: id })];
                case 1:
                    comps = _c.sent();
                    console.log(comps);
                    _a = [];
                    for (_b in comps)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    i = _a[_i];
                    c = comps[i];
                    c.team = teamName;
                    c.game = gameId;
                    c = new competition_1.Competition(c.toObject());
                    return [4 /*yield*/, c.save()];
                case 3:
                    _c.sent();
                    console.log("Competition: " + c.competition);
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getNewDivisions(id, gameId) {
    return __awaiter(this, void 0, void 0, function () {
        var divs, i, d;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, division_1.Division.find({ game: id })];
                case 1:
                    divs = _a.sent();
                    for (i in divs) {
                        d = divs[i];
                        d.game = gameId;
                        d = new division_1.Division(d.toObject());
                        d.save();
                        console.log("Division: " + d.division);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getNewTeamsIn(id, gameId) {
    return __awaiter(this, void 0, void 0, function () {
        var teams, i, t;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(id);
                    console.log(gameId);
                    return [4 /*yield*/, teamsIn_1.TeamsIn.find({ game: id }, function (err, res) {
                            console.log(err);
                            console.log(res);
                        })];
                case 1:
                    teams = _a.sent();
                    console.log(teams);
                    for (i in teams) {
                        t = teams[i];
                        t.game = gameId;
                        t = new teamsIn_1.TeamsIn(t.toObject());
                        t.save();
                        console.log("TeamsIn: " + t.team);
                    }
                    return [2 /*return*/];
            }
        });
    });
}

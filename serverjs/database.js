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
var Save = require("./save");
var Team = require("./team");
var Competition = require("./competition");
var Division = require("./division");
var teamsIn_1 = require("./teamsIn");
var Settings = require("./settings");
var Player = require("./player");
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
exports.save = Save.save;
function getSave(id) {
    return __awaiter(this, void 0, void 0, function () {
        var save, settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Save.getSave(id)];
                case 1:
                    save = _a.sent();
                    if (save.error)
                        return [2 /*return*/, save];
                    return [4 /*yield*/, Settings.getGameSettings(id)];
                case 2:
                    settings = _a.sent();
                    save.team = settings.team;
                    save.competition = settings.competition;
                    save.division = settings.division;
                    return [2 /*return*/, save];
            }
        });
    });
}
exports.getSave = getSave;
function getSaves(user) {
    return __awaiter(this, void 0, void 0, function () {
        var saves, _a, _b, _i, i, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Save.getSaves(user)];
                case 1:
                    saves = _d.sent();
                    _a = [];
                    for (_b in saves)
                        _a.push(_b);
                    _i = 0;
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    i = _a[_i];
                    _c = saves[i];
                    return [4 /*yield*/, Settings.getGameSettings(saves[i].id)];
                case 3:
                    _c.team = (_d.sent()).team;
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, saves];
            }
        });
    });
}
exports.getSaves = getSaves;
function createNewSave(s) {
    return __awaiter(this, void 0, void 0, function () {
        var id, saveObject, save, c, d;
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
                    save = new Save.Save(saveObject);
                    return [4 /*yield*/, save.save()];
                case 1:
                    _a.sent();
                    Team.getNewTeams(id, save.id, s.team);
                    getNewTeamsIn(id, save.id);
                    Player.getNewPlayers(id, save.id, s.team);
                    return [4 /*yield*/, Competition.getNewCompetitions(id, save.id, s.team)];
                case 2:
                    c = _a.sent();
                    return [4 /*yield*/, Division.getNewDivisions(id, save.id)];
                case 3:
                    d = _a.sent();
                    Settings.newSettings(save.user, save.id, s.team, c, d);
                    return [2 /*return*/, save.id];
            }
        });
    });
}
exports.createNewSave = createNewSave;
;
function getNewTeamsIn(id, gameId) {
    return __awaiter(this, void 0, void 0, function () {
        var teams, i, t;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, teamsIn_1.TeamsIn.find({ game: id }, function (err, res) {
                        console.log(err);
                    })];
                case 1:
                    teams = _a.sent();
                    for (i in teams) {
                        t = teams[i];
                        t.game = gameId;
                        t = new teamsIn_1.TeamsIn(t.toObject());
                        t.save();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getPlayers(game, team) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!team) return [3 /*break*/, 2];
                    return [4 /*yield*/, Player.getTeamPlayers(game, team)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, Player.getGamePlayers(game)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getPlayers = getPlayers;
function getGamePlayerTeams(game) {
    return __awaiter(this, void 0, void 0, function () {
        var teams, ts, _a, _b, _i, i, cs, _c, _d, _e, j, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    teams = new Object();
                    return [4 /*yield*/, Team.getGamePlayerTeams(game)];
                case 1:
                    ts = _h.sent();
                    _a = [];
                    for (_b in ts)
                        _a.push(_b);
                    _i = 0;
                    _h.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    i = _a[_i];
                    teams[ts[i]] = new Object();
                    return [4 /*yield*/, Competition.getTeamCompetitions(game, ts[i])];
                case 3:
                    cs = _h.sent();
                    _c = [];
                    for (_d in cs)
                        _c.push(_d);
                    _e = 0;
                    _h.label = 4;
                case 4:
                    if (!(_e < _c.length)) return [3 /*break*/, 7];
                    j = _c[_e];
                    _f = teams[ts[i]];
                    _g = cs[j];
                    return [4 /*yield*/, Division.getCompetitionDivisions(game, cs[j])];
                case 5:
                    _f[_g] =
                        _h.sent();
                    _h.label = 6;
                case 6:
                    _e++;
                    return [3 /*break*/, 4];
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, teams];
            }
        });
    });
}
exports.getGamePlayerTeams = getGamePlayerTeams;

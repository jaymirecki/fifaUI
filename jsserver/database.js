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
var Division = require("./division");
var TeamsIn = require("./teamsIn");
var Settings = require("./settings");
var PlayerDynamicInfo = require("./playerdynamicinfo");
var Game = require("./game");
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
        var s, save, settings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Save.getSave(id)];
                case 1:
                    s = _a.sent();
                    if (!s)
                        return [2 /*return*/, s];
                    save = s.toObject();
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
        var saves, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Save.getSaves(user)];
                case 1:
                    saves = _a.sent();
                    for (i in saves) {
                        // saves[i].team = (await Settings.getGameSettings(saves[i].id)).team;
                    }
                    return [2 /*return*/, saves];
            }
        });
    });
}
exports.getSaves = getSaves;
function createNewSave(s) {
    return __awaiter(this, void 0, void 0, function () {
        var id, game, saveObject, template, save, dc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = s.game + s.league;
                    return [4 /*yield*/, Game.getGameByName(s.game)];
                case 1:
                    game = (_a.sent()).id;
                    saveObject = {
                        user: s.user,
                        shared: false,
                        name: s.name,
                        managerName: s.managerName,
                        date: new Date(),
                        game: game,
                        doc: new Date(parseInt(s.doc)),
                        dom: new Date(parseInt(s.doc))
                    };
                    return [4 /*yield*/, Save.getTemplateId()];
                case 2:
                    template = _a.sent();
                    console.log(saveObject);
                    save = new Save.Save(saveObject);
                    return [4 /*yield*/, save.save()];
                case 3:
                    _a.sent();
                    PlayerDynamicInfo.getNewPlayers(template, s.team, save.id);
                    return [4 /*yield*/, TeamsIn.getNewTeamsIn(template, s.team, save.id, game)];
                case 4:
                    dc = _a.sent();
                    console.log(dc.competition.id);
                    Settings.newSettings(save.user, save.id, s.team, dc.competition.id, dc.division.id);
                    return [2 /*return*/, save.id];
            }
        });
    });
}
exports.createNewSave = createNewSave;
;
function getPlayers(game, team) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!team) return [3 /*break*/, 2];
                    return [4 /*yield*/, PlayerDynamicInfo.getTeamPlayers(game, team)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, PlayerDynamicInfo.getGamePlayers(game)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getPlayers = getPlayers;
function getGamePlayerTeams(saveId) {
    return __awaiter(this, void 0, void 0, function () {
        var save, season, teams, ts, _a, _b, _i, i, t, cs, _c, _d, _e, j, ds, k;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, Save.getSave(saveId)];
                case 1:
                    save = _f.sent();
                    season = 2019;
                    if (!save)
                        return [2 /*return*/, {}];
                    teams = new Object();
                    return [4 /*yield*/, TeamsIn.getSavePlayerTeams(saveId)];
                case 2:
                    ts = _f.sent();
                    console.log(ts);
                    _a = [];
                    for (_b in ts)
                        _a.push(_b);
                    _i = 0;
                    _f.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    i = _a[_i];
                    return [4 /*yield*/, Team.getTeamById(ts[i].team)];
                case 4:
                    t = _f.sent();
                    console.log;
                    console.log(t);
                    if (!t)
                        return [2 /*return*/, {}];
                    teams[t.id] = {
                        name: t.name,
                        competitions: {}
                    };
                    return [4 /*yield*/, TeamsIn.getTeamCompetitions(save.game, t.id, saveId, season)];
                case 5:
                    cs = _f.sent();
                    _c = [];
                    for (_d in cs)
                        _c.push(_d);
                    _e = 0;
                    _f.label = 6;
                case 6:
                    if (!(_e < _c.length)) return [3 /*break*/, 9];
                    j = _c[_e];
                    teams[t.id].competitions[cs[j].id] = {
                        name: cs[j].name,
                        divisions: {}
                    };
                    return [4 /*yield*/, Division.getCompetitionDivisions(save.game, cs[j].id)];
                case 7:
                    ds = _f.sent();
                    for (k in ds) {
                        teams[t.id].competitions[cs[j].id].divisions[ds[k].id] =
                            { name: ds[k].name };
                    }
                    _f.label = 8;
                case 8:
                    _e++;
                    return [3 /*break*/, 6];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    console.log("Teams");
                    console.log(teams);
                    return [2 /*return*/, teams];
            }
        });
    });
}
exports.getGamePlayerTeams = getGamePlayerTeams;
function getNewGameTemplates() {
    return __awaiter(this, void 0, void 0, function () {
        var games, template, ret, _a, _b, _i, i, g, s, teams, _c, _d, _e, j, c, g, c;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, Game.getAllGames()];
                case 1:
                    games = _f.sent();
                    return [4 /*yield*/, Save.getTemplateId()];
                case 2:
                    template = _f.sent();
                    ret = new Object();
                    _a = [];
                    for (_b in games)
                        _a.push(_b);
                    _i = 0;
                    _f.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    i = _a[_i];
                    g = games[i].name;
                    return [4 /*yield*/, Game.getGameYear(games[i].id)];
                case 4:
                    s = _f.sent();
                    ret[g] = new Object();
                    return [4 /*yield*/, TeamsIn.getTeamByGame(games[i].id)];
                case 5:
                    teams = _f.sent();
                    _c = [];
                    for (_d in teams)
                        _c.push(_d);
                    _e = 0;
                    _f.label = 6;
                case 6:
                    if (!(_e < _c.length)) return [3 /*break*/, 9];
                    j = _c[_e];
                    return [4 /*yield*/, TeamsIn.getTeamCompetition(games[i].id, teams[j].id, template, s)];
                case 7:
                    c = _f.sent();
                    if (!ret[g][c.name]) {
                        ret[g][c.name] = { teams: new Map(), date: c.start };
                    }
                    ret[g][c.name].teams.set(teams[j].id, {
                        id: teams[j].id,
                        name: teams[j].name
                    });
                    _f.label = 8;
                case 8:
                    _e++;
                    return [3 /*break*/, 6];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    for (g in ret) {
                        for (c in ret[g]) {
                            ret[g][c].teams = Array.from(ret[g][c].teams.values());
                        }
                    }
                    console.log(ret);
                    return [2 /*return*/, ret];
            }
        });
    });
}
exports.getNewGameTemplates = getNewGameTemplates;

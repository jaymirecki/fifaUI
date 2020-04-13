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
var Game = require("./game");
var uuid_1 = require("uuid");
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
function getSave(saveId, user) {
    return __awaiter(this, void 0, void 0, function () {
        var s, save, settings, _a, _b, _i, i, _c, _d, comps, _e, _f, _g, j, divs, k;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, Save.findByKey(saveId)];
                case 1:
                    s = _h.sent();
                    if (!s)
                        return [2 /*return*/, s];
                    save = s.toObject();
                    if (save.error)
                        return [2 /*return*/, save];
                    return [4 /*yield*/, Settings.getGameSettings(saveId)];
                case 2:
                    settings = _h.sent();
                    save.team = settings.team;
                    save.competition = settings.competition;
                    save.division = settings.division;
                    save.teams = {};
                    save.teams[save.team] = {};
                    _a = [];
                    for (_b in save.teams)
                        _a.push(_b);
                    _i = 0;
                    _h.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    i = _a[_i];
                    _c = save.teams;
                    _d = i;
                    return [4 /*yield*/, Team.findByKey(save.team)];
                case 4:
                    _c[_d] = (_h.sent()).toObject();
                    save.teams[i].competitions = {};
                    return [4 /*yield*/, TeamsIn.findAllCompetitionsByTeamSeason(i, save.jid, 2019)];
                case 5:
                    comps = _h.sent();
                    _e = [];
                    for (_f in comps)
                        _e.push(_f);
                    _g = 0;
                    _h.label = 6;
                case 6:
                    if (!(_g < _e.length)) return [3 /*break*/, 9];
                    j = _e[_g];
                    save.teams[i].competitions[comps[j].name] = comps[j].toObject();
                    return [4 /*yield*/, Division.findAllByCompetition(comps[j].name)];
                case 7:
                    divs = _h.sent();
                    save.teams[i].competitions[comps[j].name].divisions = {};
                    for (k in divs) {
                        save.teams[i].competitions[comps[j].name].divisions[divs[k].name] = divs[k].toObject();
                    }
                    _h.label = 8;
                case 8:
                    _g++;
                    return [3 /*break*/, 6];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10: return [2 /*return*/, save];
            }
        });
    });
}
exports.getSave = getSave;
function getSaves(user) {
    return __awaiter(this, void 0, void 0, function () {
        var saves, saveObjects, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Save.findAllByUser(user)];
                case 1:
                    saves = _a.sent();
                    saveObjects = [];
                    for (i in saves) {
                        saveObjects.push(saves[i].toObject());
                    }
                    return [2 /*return*/, saveObjects];
            }
        });
    });
}
exports.getSaves = getSaves;
function createNewSave(s) {
    return __awaiter(this, void 0, void 0, function () {
        var saveObject, season, save, teams, i, dc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    saveObject = {
                        jid: uuid_1.v4(),
                        user: s.user,
                        shared: false,
                        name: s.name,
                        managerName: s.managerName,
                        date: new Date(),
                        game: s.game,
                        doc: new Date(),
                        dom: new Date()
                    };
                    return [4 /*yield*/, Game.findByKey(s.game)];
                case 1:
                    season = (_a.sent()).year;
                    save = new Save.Save(saveObject);
                    return [4 /*yield*/, save.save()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, TeamsIn.copyTeamsFromSaveTeam(save.game, s.team, season, save.jid, save.game)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, TeamsIn.findAllByTeamSeason(s.team, save.jid, season)];
                case 4:
                    teams = _a.sent();
                    for (i in teams) {
                        teams[i].player = true;
                        teams[i].save();
                    }
                    return [4 /*yield*/, TeamsIn.findLeagueDivisionByKey(s.team, save.jid, season)];
                case 5:
                    dc = _a.sent();
                    Settings.newSettings(save.user, save.jid, s.team, dc.league.name, dc.division.name);
                    return [2 /*return*/, save.jid];
            }
        });
    });
}
exports.createNewSave = createNewSave;
;
function getNewGameTemplates() {
    return __awaiter(this, void 0, void 0, function () {
        var games, ret, _a, _b, _i, i, g, s, teams, _c, _d, _e, j, c;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, Game.getAllGames()];
                case 1:
                    games = _f.sent();
                    ret = new Object();
                    _a = [];
                    for (_b in games)
                        _a.push(_b);
                    _i = 0;
                    _f.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    i = _a[_i];
                    g = games[i].name;
                    s = games[i].year;
                    ret[g] = new Object();
                    return [4 /*yield*/, TeamsIn.findAllTeamsByGame(games[i].name)];
                case 3:
                    teams = _f.sent();
                    teams.sort(function (a, b) {
                        if (a.name < b.name)
                            return -1;
                        else if (a.name > b.name)
                            return 1;
                        else
                            return 0;
                    });
                    _c = [];
                    for (_d in teams)
                        _c.push(_d);
                    _e = 0;
                    _f.label = 4;
                case 4:
                    if (!(_e < _c.length)) return [3 /*break*/, 7];
                    j = _c[_e];
                    return [4 /*yield*/, TeamsIn.findLeagueByKey(teams[j].jid, g, s)];
                case 5:
                    c = _f.sent();
                    if (!ret[g][c.name]) {
                        ret[g][c.name] = [];
                    }
                    ret[g][c.name].push({
                        jid: teams[j].jid,
                        name: teams[j].name
                    });
                    _f.label = 6;
                case 6:
                    _e++;
                    return [3 /*break*/, 4];
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, ret];
            }
        });
    });
}
exports.getNewGameTemplates = getNewGameTemplates;

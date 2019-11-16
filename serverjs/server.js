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
var express = require("express");
var DB = require("./database");
var app = express();
var validator = require('validator');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
function cors(response) {
    response.header("Access-Control-Allow-Origin", "*");
    return response;
}
app.get("/save", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var save;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = cors(res);
                    return [4 /*yield*/, DB.getSave(req.query.id)];
                case 1:
                    save = _a.sent();
                    res.send(save);
                    return [2 /*return*/];
            }
        });
    });
});
app.get("/saves", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var saves;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = cors(res);
                    return [4 /*yield*/, DB.getSaves(req.query.user)];
                case 1:
                    saves = _a.sent();
                    res.send(saves);
                    return [2 /*return*/];
            }
        });
    });
});
app.post("/save", function (req, res) {
    res = cors(res);
    DB.save(req, res);
});
app.post("/newsave", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = cors(res);
                    console.log(req.body);
                    return [4 /*yield*/, DB.createNewSave(req.body)];
                case 1:
                    id = _a.sent();
                    res.send({ id: id });
                    return [2 /*return*/];
            }
        });
    });
});
app.get("/newgame", function (req, res) {
    res = cors(res);
    var games = {
        FIFA19: {
            MLS: {
                teams: ['Atlanta United', 'Chicago Fire', 'Colorado Rapids', 'Columbus Crew SC', 'D.C. United', 'FC Dallas', 'Houston Dynamo', 'Impact Montreal', 'LA Galaxy', 'Minnesota United', 'New England', 'New York City FC', 'NY Red Bulls', 'Orlando City', 'Philadelphia Union', 'Portland Timbers', 'Real Salt Lake', 'Seattle Sounders', 'SJ Earthquakes', 'Sporting KC', 'Toronto FC', 'Whitecaps FC'],
                date: new Date(2018, 1, 1, 12)
            }
        }
    };
    res.send(games);
});
app.get("/createNewSave", function (req, res) {
    DB.createNewSave(req.query);
    res = cors(res);
    res.send("try it\n");
});
app.get('/play', function (req, res) {
    res = cors(res);
    if (req.query.g)
        res.sendFile(__dirname + '/public/play.html');
    else
        res.sendFile(__dirname + '/public/choose_save.html');
});
app.get('/players', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = cors(res);
                    return [4 /*yield*/, DB.getPlayers(req.query.game, req.query.team)];
                case 1:
                    p = _a.sent();
                    res.send(p);
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/playerteams', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var teams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    res = cors(res);
                    return [4 /*yield*/, DB.getGamePlayerTeams(req.query.id)];
                case 1:
                    teams = _a.sent();
                    res.send(teams);
                    return [2 /*return*/];
            }
        });
    });
});
app.listen(process.env.PORT || 8888);

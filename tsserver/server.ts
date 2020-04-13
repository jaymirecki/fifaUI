import * as e from 'express';
var express = require('express');
import * as DB from './database';
import { create } from 'domain';
const app = express();
var validator = require('validator');

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

function cors(response : e.Response) {
    response.header("Access-Control-Allow-Origin", "*");
    return response;
}

app.get("/save", async function(req : e.Request, res : e.Response) {
    res = cors(res);
    let save = await DB.getSave(req.query.id);
    res.send(save);
});

app.get("/saves", async function(req: e.Request, res: e.Response) {
    res = cors(res);
    let saves = await DB.getSaves(req.query.user);
    res.send(saves);
});

app.post("/save", function(req: e.Request, res: e.Response) {
    res = cors(res);
    DB.save(req, res);
});

app.post("/new_save", async function(req: e.Request, res: e.Response) {
    res = cors(res);
    let id = await DB.createNewSave(req.body);
    res.send({ id: id });
});

app.get("/newgame", async function(req: e.Request, res: e.Response) {
    res = cors(res);
    let games = await DB.getNewGameTemplates();
    res.send(games);
});
app.get("/team_selection", async function(req: e.Request, res: e.Response) {
    res = cors(res);
    let games = await DB.getNewGameTemplates();
    res.send(games);
});


app.get("/load", async function(req : e.Request, res : e.Response) {
    res = cors(res);
    res.sendFile(__dirname + '/public/load.html');
});
app.get("/new", async function(req : e.Request, res : e.Response) {
    res = cors(res);
    res.sendFile(__dirname + '/public/new.html');
});
app.get('/play', function(req: e.Request, res:e.Response) {
    res = cors(res);
    res.sendFile(__dirname + '/public/play.html');
});

app.get('/players', async function(req: e.Request, res: e.Response) {
    res = cors(res);
    let p = await DB.getPlayers(req.query.game, req.query.team);
    res.send(p);
});

app.get('/playerteams', async function(req: e.Request, res: e.Response) {
    res = cors(res);
    let teams = await DB.getGamePlayerTeams(req.query.id);
    res.send(teams);
});

app.listen(process.env.PORT || 8888);
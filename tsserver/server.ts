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

app.post("/new_save", async function(req: e.Request, res: e.Response) {
    res = cors(res);
    let id = await DB.createNewSave(req.body);
    res.send({ id: id });
});
app.get("/saves", async function(req: e.Request, res: e.Response) {
    res = cors(res);
    let saves = await DB.getSaves(req.query.user);
    res.send(saves);
});
app.get("/team_selection", async function(req: e.Request, res: e.Response) {
    res = cors(res);
    try {
        let games = await DB.getNewGameTemplates();
        res.send(games);
    } catch(e) {
        console.log(e);
        res.send({ success: false, error: e });
    }
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

app.listen(process.env.PORT || 8888);
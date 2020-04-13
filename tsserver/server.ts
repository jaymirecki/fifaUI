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

async function catchErrors(res: e.Response, callback: CallableFunction) {
    res = cors(res);
    try {
        let result: { success: boolean, content: any } = { success: true, content: 1 };
        result.content = await callback();
        result.success = true;
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send({ success: false, error: error });
    }
}
// api
app.get("/game", async function(req: e.Request, res: e.Response) {
    catchErrors(res, async () => await DB.getSave(req.query.game, req.query.user) );
});
app.post("/new_save", async function(req: e.Request, res: e.Response) {
    catchErrors(res, async () => { return { id: await DB.createNewSave(req.body) } });
});
app.get("/saves", async function(req: e.Request, res: e.Response) {
    catchErrors(res, async () => await DB.getSaves(req.query.user) );
});
app.get("/team_selection", async function(req: e.Request, res: e.Response) {
    catchErrors(res, DB.getNewGameTemplates);
});

// pages
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
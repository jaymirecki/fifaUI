import * as express from 'express';
import * as DB from './database';
import { create } from 'domain';
const app = express();
var validator = require('validator');

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

function cors(response : express.Response) {
    response.header("Access-Control-Allow-Origin", "*");
    return response;
}

app.get("/save", async function(req : express.Request, res : express.Response) {
    res = cors(res);
    let save = await DB.getSave(req.query.id);
    res.send(save);
});

app.get("/saves", async function(req: express.Request, res: express.Response) {
    res = cors(res);
    let saves = await DB.getSaves(req.query.user);
    res.send(saves);
});

app.post("/save", function(req: express.Request, res: express.Response) {
    res = cors(res);
    DB.save(req, res);
});

app.post("/newsave", async function(req: express.Request, res: express.Response) {
    res = cors(res);
    console.log(req.body);
    let id = await DB.createNewSave(req.body);
    res.send({ id: id });
});

app.get("/newgame", function(req: express.Request, res: express.Response) {
    res = cors(res);
    let games = {
        FIFA19: {
            MLS: {
                teams: [ 'Atlanta United', 'Chicago Fire', 'Colorado Rapids', 'Columbus Crew SC', 'D.C. United', 'FC Dallas', 'Houston Dynamo', 'Impact Montreal', 'LA Galaxy', 'Minnesota United', 'New England', 'New York City FC', 'NY Red Bulls', 'Orlando City', 'Philadelphia Union', 'Portland Timbers', 'Real Salt Lake', 'Seattle Sounders', 'SJ Earthquakes', 'Sporting KC', 'Toronto FC', 'Whitecaps FC' ],
                date: new Date(2018, 1, 1, 12)
            }
        }
    }
    res.send(games);
});

app.get("/createNewSave", function(req: express.Request, res: express.Response) {
    DB.createNewSave(req.query);
    res = cors(res);
    res.send("try it\n");
});

app.get('/play', function(req: express.Request, res:express.Response) {
    res = cors(res);
    if (req.query.g)
        res.sendFile(__dirname + '/public/play.html');
    else
        res.sendFile(__dirname + '/public/choose_save.html');
});

app.get('/players', async function(req: express.Request, res: express.Response) {
    res = cors(res);
    let p = await DB.getPlayers(req.query.game, req.query.team);
    res.send(p);
});

app.get('/playerteams', async function(req: express.Request, res: express.Response) {
    res = cors(res);
    let teams = await DB.getGamePlayerTeams(req.query.id);
    res.send(teams);
});

app.listen(process.env.PORT || 8888);
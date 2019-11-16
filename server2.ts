import * as express from 'express';
import { save, getSave, getSaves, createNewSave } from './database';
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

app.get("/save", function(req : express.Request, res : express.Response) {
    res = cors(res);
    getSave(req, res);
});

app.get("/saves", function(req: express.Request, res: express.Response) {
    console.log(req.query);
    res = cors(res);
    console.log(req.query);
    getSaves(req, res);
});

app.post("/save", function(req: express.Request, res: express.Response) {
    res = cors(res);
    save(req, res);
});

app.post("/newsave", async function(req: express.Request, res: express.Response) {
    res = cors(res);
    console.log(req.body);
    let id = await createNewSave(req.body);
    res.send({ id: id });
});

app.get("/newgame", function(req: express.Request, res: express.Response) {
    res = cors(res);
    let games = {
        FIFA19: {
            MLS: {
                teams: [ 'Atlanta United', 'Chicago Fire', 'Colorado Rapids', 'Columbus Crew SC', 'D.C. United', 'FC Dallas', 'Houston Dynamo', 'Impact Montreal', 'LA Galaxy', 'Minnesota United', 'New England', 'New York City FC', 'NY Red Bulls', 'Orlando City', 'Philadelphia', 'Portland Timbers', 'Real Salt Lake', 'Seattle Sounders', 'SJ Earthquakes', 'Sporting KC', 'Toronto FC', 'Whitecaps FC' ],
                date: new Date(2018, 1, 1, 12)
            }
        }
    }
    res.send(games);
});

app.get("/createNewSave", function(req: express.Request, res: express.Response) {
    createNewSave(req.query);
    res = cors(res);
    res.send("try it\n");
});










app.get('/play', function(req: express.Request, res:express.Response) {
    res = cors(res);
    console.log(req.query.g);
    if (req.query.g)
        res.sendFile(__dirname + '/public/newGame2.html');
    else
        res.sendFile(__dirname + '/public/choose_save.html');
});

app.listen(process.env.PORT || 8888);
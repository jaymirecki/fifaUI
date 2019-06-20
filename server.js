var express = require('express');
var app = express();
var validator = require('validator');

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fifa';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});
var ObjectID = require('mongodb').ObjectID;

app.use(express.static(__dirname + '/public'));

function cors(response) {
    response.header("Access-Control-Allow-Origin", "*");
    return response;
}

function search(collection, query, callback) {
    db.collection(collection, function(error, coll) {
        if (error) {
            callback(error);
            return;
        }
        coll.find(query).toArray(function(error, results) {
            if (error) {
                callback(error);
                return;
            }
            callback(false, collection, query, results);
        });
    });
}

function sendSaves(request, response) {
    if (request.query.u)
        var userId = request.query.u;
    else {
        response.send({ error: "Need to specify a user." });
        return;
    }
    var collection = userId + " - saves";
    var query = {};
    search(collection, query, function(error, coll, query, results) {
        if (error)
            response.send({ error: error });
        else
            response.send(results);
    });
}

function sendGame(request, response) {
    if (!request.query.game) {
        response.send(games);
        return;
    }

    if (games[request.query.game])
        response.send(games[request.query.game]);
    else
        response.send({ error: "Could not find game " + request.query.game });
}

function sendLeague(request, response) {
    if (!request.query.league || !request.query.game) {
        response.send(leagues);
        return;
    }

    var index = request.query.league + request.query.game;

    if (leagues[index]) {
        response.send(leagues[index]);
        return;
    }
    response.send({ error: "Could not find league " + request.query.league + "in game " + request.query.game });
}



/******************************************************************************/
/******************************** GET REQUESTS ********************************/
/******************************************************************************/
app.get("/saves", function(request, response) {
    response = cors(response);
    sendSaves(request, response);
});

app.get('/new_game', function(request, response) {
    response.sendFile(__dirname + '/public/newGame.html');
});

app.get('/game', function(request, response) {
    response = cors(response);
    sendGame(request, response);
});

app.get('/league', function(request, response) {
    response = cors(response);
    sendLeague(request, response);
});

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT || 8888);



/******************************************************************************/
/********************************* TEMPLATES **********************************/
/******************************************************************************/
var games = new Object();
games["FIFA 19"] = { leagues: ['MLS'] };
games["FIFA 18"] = { leagues: ['MLS'] };

var leagues = new Object();
leagues["MLSFIFA 19"] = { seasonEnd: new Date(), teams: ['Atlanta United', 'Chicago Fire', 'Colorado Rapids', 'Columbus Crew SC', 'D.C. United', 'FC Dallas', 'Houston Dynamo', 'Impact Montreal', 'LAFC', 'LA Galaxy', 'Minnesota United', 'New England', 'New York City FC', 'NY Red Bulls', 'Orlando City', 'Philadelphia', 'Portland Timbers', 'Real Salt Lake', 'Seattle Sounders', 'SJ Earthquakes', 'Sporting KC', 'Toronto FC', 'Whitecaps FC'] };
leagues["MLSFIFA 18"] = { seasonEnd: new Date(), teams: ['Atlanta United', 'Chicago Fire', 'Colorado Rapids', 'Columbus Crew SC', 'D.C. United', 'FC Dallas', 'Houston Dynamo', 'Impact Montreal', 'LA Galaxy', 'Minnesota United', 'New England', 'New York City FC', 'NY Red Bulls', 'Orlando City', 'Philadelphia', 'Portland Timbers', 'Real Salt Lake', 'Seattle Sounders', 'SJ Earthquakes', 'Sporting KC', 'Toronto FC', 'Whitecaps FC'] };
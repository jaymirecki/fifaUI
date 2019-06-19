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

/******************************************************************************/
/******************************** GET REQUESTS ********************************/
/******************************************************************************/
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT || 8888);
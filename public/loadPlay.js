var saveObject;
var numTeams = 8;
var numPlayers = 18;

function loadFifaContent() {
    showHeader();
    var auth = new MAuth(function() {
        auth.login(function(user) {
            var path =  window.location.pathname.split("/");
            var gameId = path[path.length - 1]
            var getString = baseUrl + "save?u=" + user._id + "&s=" + gameId;
            var request = new XMLHttpRequest();
            request.open("GET", getString);
            request.onreadystatechange = function() {
                if (request.readyState != 4)
                    return;
                var result = JSON.parse(request.responseText);
                if (result.success)
                    saveObject = result;
                console.log(saveObject);
                insertSaveInfo();
            };
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send();
        });
    });
}

function insertSaveInfo() {
    $("#saveInfo").html(saveObject.name + ", " + saveObject.game);
    $("#teamInfo").html(saveObject.team + ", " + saveObject.league);
    $("#managerInfo").html(saveObject.manager);
    $("#comp1Label").html(saveObject.competitions[0]);
    $("#comp2Label").html(saveObject.competitions[1]);
    var roster = "<tr class='fifaTable'><th>Position</th><th>Name</th></tr>";
    for (let i = 0; i < 18 && i < saveObject.roster.length; i++)
        roster = roster + 
            "<tr class='fifaTable'><td>" + saveObject.roster[i].position + "</td><td>" + saveObject.roster[i].name + "</td></tr>";
    roster = roster + "</table>";
    $("#fifaPlayRoster").html(roster);
}

function showHeader() {
    var header =
        "<div id='fifaPlayHeaderInfo'>\
            <p id='saveInfo'>[Save Name], [Game]</p>\
            <p id='teamInfo'>[Team Name], [League Name]</p>\
            <p id='managerInfo'>[Manager Name]</p>\
        </div>";

    var competition = 
        "<div id='fifaPlayCompetition'>\
            <label for='comp1' id='comp1Label'>[COMPETITION 1]</label>\
            <input type='radio' name='competition' id='comp1' value='comp1' checked>\
            <label for='comp2' id='comp2Label'>[COMPETITION 2]</label>\
            <input type='radio' name='competition' id='comp2' value='comp2'>\
        </div>";

    var playContent = "<div id='fifaPlayContent'></div>";

    var htmlText = "<div id='fifaPlayHeader'>" + header + competition + "</div>" + playContent;
    $("#fifaContent").html(htmlText);
    showDashboard();
}

function showDashboard() {
    var roster = 
        "<p id='teamAvg'>Team Rating: [70]</p>\
        <table class='fifaTable' id='fifaPlayRoster'>\
            <tr class='fifaTable'><th>Position</th><th>Name</th></tr>";
    for (let i = 0; i < 18; i++)
        roster = roster + 
            "<tr class='fifaTable'><td>[POS]</td><td>[Player Name]</td></tr>";
    roster = roster + "</table>";

    var table = 
        "<div id='fifaPlayTables'><table class='fifaTable' id='fifaPlayTable'>\
            <tr class='fifaTable'><th></th><th></th><th>GP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>PTS</th></tr>";
    for (let i = 0; i < numTeams; i++)
        table = table + 
            "<tr class='fifaTable'><td>[POS]</td><td>[TEAM NAME]</td><td>[34]</td><td>[34]</td><td>[0]</td><td>[0]</td><td>[34]</td><td>[0]</td><td>[102]</td></tr>";
    table = table + "</table><br>";

    var power = 
        "<table class='fifaTable' id='fifaPlayPower'>\
            <tr class='fifaTable'><th></th><th></th><th>PTS</th><th>STR</th><th>SCR</th><th>MOV</th></tr>";
    for (let i = 0; i < numTeams; i++)
        power = power + 
            "<tr class='fifaTable'><td>[POS]</td><td>[TEAM NAME]</td><td>[15]</td><td>[85]</td><td>[1275]</td><td>[+0]</td></tr>";
    power = power + "</table></div>";

    var htmlText = roster + table + power;
    $("#fifaPlayContent").html(htmlText);
    // showPlayer();
}

function showPlayer() {
    var player;
    var htmlText = 
        "<div id='fifaPlayCompetition'>\
            <label for='season'>SEASON</label>\
            <input type='radio' name='timeFrame' id='season' value='season' checked>\
            <label for='career'>CAREER</label>\
            <input type='radio' name='timeFrame' id='career' value='career'>\
        </div>\
        <table class='fifaTable'>\
            <tr class='fifaTable'><th>Position</th><th>Name</th><th>App</th>";
    for (key in saveObject.settings.stats) {
        if (saveObject.settings.stats[key])
            htmlText = htmlText + "<th>" + key.upp + "</th>";
    }
    htmlText = "</tr><tr class='fifaTable'><td>" + player.position + "</td><td>" + player.name;

    console.log(htmlText);
}
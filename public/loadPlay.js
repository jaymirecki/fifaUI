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
                insertSaveInfo();
            };
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send();
        });
    });
}

function showHeader() {
    var header =
        "<div id='fifaPlayHeaderInfo'>\
            <p id='saveInfo'>[Save Name], [Game]</p>\
            <p id='managerInfo'>[Manager Name]</p>\
        </div>";


    var spacer = "<div class='fifaPlayBarSpacer'></div>";
    var teams = 
        "<div id='fifaPlayBars'>\
        <div id='fifaPlayTeamBar' class='fifaPlayBar'>\
            <div class='fifaPlayTabSelected'>[Team 1], [League 1]</div>\
            <div class='fifaPlayTab'>[Team 2], [League 2]</div>\
            <div class='fifaPlayTabEnd'></div>\
        </div>";
    var competitions =
        "<div id='fifaPlayCompBar' class='fifaPlayBar'>\
            <div class='fifaPlayTab'>[Competition 1]</div>\
            <div class='fifaPlayTab'>[Competition 2]</div>\
            <div class='fifaPlayTabSelected'>[Competition 3]</div>\
            <div class='fifaPlayTabEnd'></div>\
        </div>";
    var divisions =
        "<div id='fifaPlayDivBar' class='fifaPlayBar'>\
            <div class='fifaPlayTab'>[Division 1]</div>\
            <div class='fifaPlayTabSelected'>[Division 2]</div>\
            <div class='fifaPlayTabEnd'></div>\
        </div>";

    var playContent = "<div id='fifaPlayContent'></div>";

    htmlText = header + teams + spacer + competitions + divisions + playContent+ "</div>" ;
    $("#fifaContent").html(htmlText);
    showDashboard();
}

function showDashboard() {
    var roster = 
        "<p id='teamAvg'>Team Rating: [70]</p>\
        <table class='fifaTable' id='fifaPlayRoster' onclick='showFullRoster()'>\
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

////////////////////////////////////////////////////////////////////////////////
//                        CUSTOM SAVE CONTENT LOADING                         //
////////////////////////////////////////////////////////////////////////////////
function insertSaveInfo() {
    // console.log(saveObject);

    teamSelectBar();
    divisionSelectBar(competitionSelectBar());
    $("#saveInfo").html(saveObject.name + ", " + saveObject.game);
    $("#managerInfo").html(saveObject.manager);

    roster();

    table();

    power();
}

function teamSelectBar() {
    var html = "";
    for (key in saveObject.team) {
        if (key == saveObject.settings.currentSelections.team)
            html = html + "<div class='fifaPlayTabSelected'>" + key + "</div>";
        else
            html = html + "<div class='fifaPlayTab'>" + key + "</div>";
    }
    html = html + "<div class='fifaPlayTabEnd'></div>";
    $("#fifaPlayTeamBar").html(html);
    $("#fifaPlayTeamBar").find(".fifaPlayTab, .fifaPlayTabSelected").click(function() {
        if (saveObject.settings.currentSelections.team != $(this).html()) {
            saveObject.settings.currentSelections.team = $(this).html();
            saveObject.settings.currentSelections.competition = 
                Object.keys(saveObject.team[saveObject.settings.currentSelections.team].league.competitions)[0];
            insertSaveInfo();
        }
    });
}

function competitionSelectBar() {
    var html = "";

    var competitions = 
        saveObject.team[saveObject.settings.currentSelections.team].league.competitions;
    for (key in competitions) {
        if (key == saveObject.settings.currentSelections.competition) {
            html = html + "<div class='fifaPlayTabSelected'>" + key + "</div>";
        }
        else
            html = html + "<div class='fifaPlayTab'>" + key + "</div>";
    }
    html = html + "<div class='fifaPlayTabEnd'></div>";
    $("#fifaPlayCompBar").html(html);
    $("#fifaPlayCompBar").find(".fifaPlayTab, .fifaPlayTabSelected").click(function() {
        if (saveObject.settings.currentSelections.competition != $(this).html()) {
            saveObject.settings.currentSelections.competition = $(this).html();
            saveObject.settings.currentSelections.division = 
                Object.keys(saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].divisions)[0];
            insertSaveInfo();
        }
    });
}

function divisionSelectBar() {
    var html = "";

    var divisions = 
        saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].divisions;
    for (key in divisions) {
        if (key == saveObject.settings.currentSelections.division)
            html = html + "<div class='fifaPlayTabSelected'>" + key + "</div>";    
        else
            html = html + "<div class='fifaPlayTab'>" + key + "</div>";
    }
    html = html + "<div class='fifaPlayTabEnd'></div>";
    $("#fifaPlayDivBar").html(html);
    $("#fifaPlayDivBar").find(".fifaPlayTab, .fifaPlayTabSelected").click(function() {
        saveObject.settings.currentSelections.division = $(this).html();
        insertSaveInfo();
    });
}

function roster() {
    var currentRoster = saveObject.team[saveObject.settings.currentSelections.team].roster;
    currentRoster.sort(function(a, b) {
        if (a.attr.ovr > b.attr.ovr)
            return -1;
        else if (a.attr.ovr == b.attr.ovr)
            return 0;
        else
            return 1;
    });

    var teamTotal = 0;
    for (let i = 0; i < 11; i++)
        teamTotal = teamTotal + currentRoster[i].attr.ovr;
    $("#teamAvg").html("Team Rating: " + Math.round(teamTotal / 11));

    var roster = "<tr class='fifaTable'><th>Position</th><th>Name</th></tr>";
    for (let i = 0; i < 18 && i < currentRoster.length; i++)
        roster = roster + 
            "<tr class='fifaTable'><td>" + currentRoster[i].position + "</td><td>" + currentRoster[i].name + "</td></tr>";
    $("#fifaPlayRoster").html(roster);
}

function table() {
    var currentTable = saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].divisions[saveObject.settings.currentSelections.division].table;
    
    currentTable.sort(function(a, b) {
        var ap = a.w * 3 + a.d;
        var bp = b.w * 3 + b.d;
        if (ap > bp)
            return -1;
        else if (bp > ap)
            return 1;
        else
            return 0;
    });
    var table = 
        "<tr class='fifaTable'><th></th><th></th><th>GP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>PTS</th></tr>";
    for (let i = 0; i < numTeams; i++) {
        var row = currentTable[i];
        table = table + 
            "<tr class='fifaTable'><td>" + (i + 1) + "</td><td>" + row.t + "</td><td>" + (row.w + row.l + row.d) + "</td><td>" + row.w + "</td><td>" + row.d + "</td><td>" + row.l + "</td><td>" + row.gf + "</td><td>" + row.ga + "</td><td>" + (row.w * 3 + row.d) + "</td></tr>";
    }
    $("#fifaPlayTable").html(table);
}

function power() {
    var currentPower = saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].power;

    currentPower.sort(function(a, b) {
        var ap = a.w * 3 + a.d;
        var bp = b.w * 3 + b.d;
        if (ap > bp)
            return -1;
        else if (bp > ap)
            return 1;
        else
            return 0;
    });
    var power = 
        "<tr class='fifaTable'><th></th><th></th><th>PTS</th><th>STR</th><th>SCR</th><th>MOV</th></tr>";
    for (let i = 0; i < numTeams; i++) {
        var row = currentPower[i];
        power = power + 
            "<tr class='fifaTable'><td>" + (i + 1) + "</td><td>" + row.t + "</td><td>" + row.p + "</td><td>" + row.str + "</td><td>" + row.scr + "</td><td>" + row.m + "</td></tr>";
        }
    $("#fifaPlayPower").html(power);
}

function showPlayer(playerName, statCategory, deep) {
    var player = getPlayerFromRoster(playerName, saveObject.team[saveObject.settings.currentSelections.team].roster);
    var htmlText = 
        "<div id='fifaPlayCompetition'>\
            <label for='season'>SEASON</label>\
            <input type='radio' name='timeFrame' id='season' value='season' checked>\
            <label for='career'>CAREER</label>\
            <input type='radio' name='timeFrame' id='career' value='career'>\
        </div>\
        <table class='fifaTable'>"
    
    var headerHtml = "<tr class='fifaTable'><th>Position</th><th>Name</th>";
    var playerHtml = "</tr><tr class='fifaTable'><td>" + player.position + "</td><td>" + player.name + "</td>";
    for (key in saveObject.settings.stats) {
        if (saveObject.settings.stats[key].on) {
            headerHtml = headerHtml + "<th>" + saveObject.settings.stats[key].display + "</th>";
            playerHtml = playerHtml + "<td>" + player.season.stats[key] + "</td>";
        }
    }
    if (deep) {
        for (key in saveObject.settings.deepStats) {
            if (saveObject.settings.deepStats[key].on) {
                headerHtml = headerHtml + "<th>" + saveObject.settings.deepStats[key].display + "</th>";
                playerHtml = playerHtml + "<td>" + player.season.deepStats[key] + "</td>";
            }
        }
    }
    htmlText = htmlText + headerHtml + playerHtml + "</tr></table>\
        <button type='button' onclick='closeModal()'>Close</button>";

    openModal(htmlText);
}

function getPlayerFromRoster(playerName, roster) {
    for (let i = 0; i < roster.length; i++) {
        if (roster[i].name == playerName)
            return roster[i];
    }
}

function showFullRoster() {
    var currentRoster = saveObject.team[saveObject.settings.currentSelections.team].roster;
    
    var rosterHtml = 
        "<table class='fifaTable'><tr class='fifaTable'><th onclick='sortRosterBy(\"position\")'>Position</th><th onclick='sortRosterBy(\"name\")'>Name</th>";
    for (key in saveObject.settings.stats)
        if (saveObject.settings.stats[key].on)
            rosterHtml = 
                rosterHtml + "<th onclick='sortRosterBy(\"" + key + "\")'>" + saveObject.settings.stats[key].display + "</th>";
    rosterHtml = rosterHtml + "</tr>";

    for (key in currentRoster) {
        var player = currentRoster[key]
        rosterHtml = rosterHtml + "<tr class='fifaTable'><td>" + player.position + "</td><td>" + player.name + "</td>";
        for (key in saveObject.settings.stats)
            if (saveObject.settings.stats[key].on)
                rosterHtml = 
                    rosterHtml + "<th>" + player.season.stats[key] + "</th>";
        rosterHtml = rosterHtml + "</tr>";
    }

    rosterHtml = rosterHtml + "</table><button type='button' onclick='closeModal()'>Close</button>";
    openModal(rosterHtml);
}

function sortRosterBy(field) {
    console.log(field);
}
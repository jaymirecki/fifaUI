var saveObject;
var numTeams = 8;
var numPlayers = 18;
var numFixtures = 5;
var userId;

var fifaPlayLineupsHeader = 
    "<tr><th colspan='2' id='currLineupName'>Current Lineup: [LINEUP NAME]</th></tr>\
    <tr><th>Position</th><th>Player</th></tr>";


function loadFifaContent() {
    startLoading();

    loadScripts();
    var auth = new MAuth(function() {
        auth.login(function(user) {
            startLoading();
            var path =  window.location.pathname.split("/");
            var gameId = path[path.length - 1]
            var getString = baseUrl + "save?u=" + user._id + "&s=" + gameId;
            var request = new XMLHttpRequest();
            request.open("GET", getString);
            request.onreadystatechange = function() {
                if (request.readyState != 4)
                    return;
                var result = JSON.parse(request.responseText);
                if (!result.success) {
                    fifaError(result.error);
                    return;
                }
                saveObject = result;
                saveObject.date = new Date(new Date(saveObject.date).setUTCHours(0,0,0,0));
                userId = user._id;
                insertSaveInfo(user._id);
            };
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send();
        });
    });
}

function loadScripts(user) {
    loadScript("../loadFifaFixtureManagement.js", function() {
        loadScript("../FCLineups.js", function() {
            showHeader(user);
        });
    });
}

function showHeader() {
    var header =
        "<div id='fifaPlayHeaderInfo'>\
            <p id='saveInfo'>[Save Name], [Game]</p>\
            <p id='managerInfo'>[Manager Name]</p>\
            <p id='gameDate'>[1/1/2019]</p>\
            <button type='button' id='saveGameButton'>Save Game</button>\
            <button type='button' id='settingsButton'>Settings</button>\
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
        "<table class='fifaTable' id='fifaPlayTable' onclick='showFullTable()'>\
            <tr class='fifaTable'><th colspand='2'>Table</th><th>GP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>PTS</th></tr>";
    for (let i = 0; i < numTeams; i++)
        table = table + 
            "<tr class='fifaTable'><td>[POS]</td><td>[TEAM NAME]</td><td>[34]</td><td>[34]</td><td>[0]</td><td>[0]</td><td>[34]</td><td>[0]</td><td>[102]</td></tr>";
    table = table + "</table><br>";

    var power = 
        "<table class='fifaTable' id='fifaPlayPower' onclick='showFullPower()'>\
            <tr class='fifaTable'><th></th><th></th><th>PTS</th><th>STR</th><th>SCR</th><th>MOV</th></tr>";
    for (let i = 0; i < numTeams; i++)
        power = power + 
            "<tr class='fifaTable'><td>[POS]</td><td>[TEAM NAME]</td><td>[15]</td><td>[85]</td><td>[1275]</td><td>[+0]</td></tr>";
    power = power + "</table>";

    var compFixtures = 
        "<table class='fifaTable' id='fifaPlayCompFixtures' onclick='showFullFixtures()'><tr class='fifaTable'><th colspan='4'>Competition Fixtures</th></tr>";
    for (let i = 0; i < 5; i++)
        compFixtures = compFixtures + 
            "<tr class='fifaTable'><td>[DATE]</td><td>[TEAM 1]</td><td>vs.</td><td>[TEAM 2]</td></tr>";
    compFixtures = compFixtures + "</table><br>";

    var teamFixtures = 
        "<table class='fifaTable' id='fifaPlayTeamFixtures'><tr class='fifaTable'><th colspan='4'>Team Fixtures</th></tr>";
    for (let i = 0; i < 5; i++)
        teamFixtures = teamFixtures + 
            "<tr class='fifaTable'><td>[DATE]</td><td>[TEAM 1]</td><td>vs.</td><td>[TEAM 2]</td></tr>";
    teamFixtures = teamFixtures + "</table><br><button type='button' id='addFixturesButton'>Add Fixtures</button>";

    var lineups = FCLineups.getLineupWidget();

    var htmlText = "<table><tr><td>" + roster + "</td><td>" + table + power + "</td><td>" + compFixtures + teamFixtures + "</td><td>" + lineups + "</td></tr></table>";
    $("#fifaPlayContent").html(htmlText);
}

////////////////////////////////////////////////////////////////////////////////
//                        CUSTOM SAVE CONTENT LOADING                         //
////////////////////////////////////////////////////////////////////////////////
function insertSaveInfo(user) {
    // window.onbeforeunload = function() {
    //     return "Leaving this page will result in the loss of any unsaved changes!";
    // };

    teamSelectBar(user);
    competitionSelectBar(user);
    divisionSelectBar(user);
    $("#saveInfo").html(saveObject.name + ", " + saveObject.game);
    $("#managerInfo").html(saveObject.manager);
    $("#gameDate").html(new Date(saveObject.date).toLocaleDateString("default", { timeZone: "UTC" }) + "<button type='button' onclick='advanceDate(\"" + user + "\")'>Advance Date</button>");
    $("#saveGameButton").click(function() {
        saveGame(user, saveObject, function(results) {
            openModal("<p>Game saved succesfully.</p><button type='button' onclick='closeModal(); insertSaveInfo(\"" + user + "\")'>Okay</button>");
            if (saveObject._id != results.save._id)
                window.history.replaceState({}, "Play - FIFA Career Companion", results.save._id);
        }, function() {
            openModal("<p>Failed to save game. Please try again.</p><button type='button' onclick='closeModal()'>Okay</button>")
        });
    });
    $("#settingsButton").click(function() {
        openSettings();
    });

    var currTeam = saveObject.team[saveObject.settings.currentSelections.team];

    roster();

    table();

    power();

    fixtures(user);
    new FCLineups(currTeam.lineups, saveObject.settings.currentSelections.lineup).updateLineupWidget(true);

    stopLoading();
}

function teamSelectBar(user) {
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
            insertSaveInfo(user);
        }
    });
}

function competitionSelectBar(user) {
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
            insertSaveInfo(user);
        }
    });
}

function divisionSelectBar(user) {
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
        insertSaveInfo(user);
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

    var roster = 
        "<tr><th colspan='2'>Roster</th></tr>\
        <th>Position</th><th>Name</th></tr>";
    for (let i = 0; i < 18 && i < currentRoster.length; i++)
        roster = roster + 
            "<tr class='fifaTable'><td>" + currentRoster[i].position + "</td><td>" + currentRoster[i].name + "</td></tr>";
    $("#fifaPlayRoster").html(roster);
}

function table() {
    saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].divisions[saveObject.settings.currentSelections.division].table = 
        calculateTable(saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].divisions[saveObject.settings.currentSelections.division].teams, saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].fixtures);
    
    var currentTable = 
        saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].divisions[saveObject.settings.currentSelections.division].table;
    
    currentTable.sort(function(a, b) {
        var ap = a.w * 3 + a.d;
        var bp = b.w * 3 + b.d;
        if (ap > bp)
            return -1;
        else if (bp > ap)
            return 1;
        else {
            return a.w + a .d + a.l - b.w - b.d - b.l;
        }
    });
    var table = 
        "<tr><th colspan='4'>Table</th></tr>\
        <tr><th colspan='2'></th><th>GP</th><th>PTS</th></tr>";
    for (let i = 0; i < numTeams && i < currentTable.length; i++) {
        var row = currentTable[i];
        table = table + 
            "<tr class='fifaTable'><td>" + (i + 1) + "</td><td>" + row.t + "</td><td>" + (row.w + row.l + row.d) + "</td><td>" + (row.w * 3 + row.d) + "</td></tr>";
    }
    $("#fifaPlayTable").html(table);
}

function power() {
    var currentPower = saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].power;

    currentPower = calculatePowerRankings(currentPower, saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].fixtures);

    saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].power = currentPower;

    currentPower.sort(function(a, b) {
        var ap = a.scr;
        var bp = b.scr;
        if (ap > bp)
            return -1;
        else if (bp > ap)
            return 1;
        else
            return b.m - a.m;
    });
    var power = 
        "<tr><th colspan='9'>Power Rankings</th></tr>\
        <tr><th colspan='2'></th><th>SCR</th><th>MOV</th></tr>";
    for (let i = 0; i < numTeams && i < currentPower.length; i++) {
        var row = currentPower[i];
        power = power + 
            "<tr class='fifaTable'><td>" + (i + 1) + "</td><td>" + row.t + "</td><td>" + row.scr + "</td><td>" + row.m + "</td></tr>";
        }
    $("#fifaPlayPower").html(power);
}

function fixtures(user) {
    var team = saveObject.settings.currentSelections.team;
    var fixtures = 
        saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].fixtures.filter(f => new Date(f.date) >= saveObject.date);
    fixtures.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
    });
    var teamFixtureList = fixtures.filter(f => f.away == team || f.home == team);

    var compFixtures = 
        "<tr class='fifaTable'><th colspan='4'>Competition Fixtures</th></tr>";
    for (let i = 0; i < fixtures.length && i < numFixtures; i++)
        compFixtures = compFixtures + 
            "<tr class='fifaTable'><td>" + new Date(fixtures[i].date).toLocaleDateString("default", { timeZone: "UTC" }) + "</td><td>" + fixtures[i].home + "</td><td>vs.</td><td>" + fixtures[i].away + "</td></tr>";
    $("#fifaPlayCompFixtures").html(compFixtures);

    var teamFixtures = 
        "<tr class='fifaTable'><th colspan='4'>Team Fixtures</th></tr>";
    for (let i = 0; i < teamFixtureList.length && i < numFixtures; i++)
        teamFixtures = teamFixtures + 
        "<tr class='fifaTable' onclick='playGame()'><td>" + new Date(teamFixtureList[i].date).toLocaleDateString("default", { timeZone: "UTC" }) + "</td><td>" + teamFixtureList[i].home + "</td><td>vs.</td><td>" + teamFixtureList[i].away + "</td></tr>";
    $("#fifaPlayTeamFixtures").html(teamFixtures);

    $("#addFixturesButton").click(function() { addFixtures(user); });
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

function showFullTable() {
    var table = saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].divisions[saveObject.settings.currentSelections.division].table;
    
    table.sort(function(a, b) {
        var ap = a.w * 3 + a.d;
        var bp = b.w * 3 + b.d;
        if (ap > bp)
            return -1;
        else if (bp > ap)
            return 1;
        else {
            return a.w + a .d + a.l - b.w - b.d - b.l;
        }
    });
    
    var html = 
        "<table class='fifaTable'><tr class='fifaTable'><th colspan='9'>Table</th></tr>\
        <tr><th colspan='2'></th><th>GP</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>PTS</th></tr>";
    for (let i = 0; i < table.length; i++) {
        var row = table[i];
        html = html + 
            "<tr class='fifaTable'><td>" + (i + 1) + "</td><td>" + row.t + "</td><td>" + (row.w + row.l + row.d) + "</td><td>" + row.w + "</td><td>" + row.d + "</td><td>" + row.l + "</td><td>" + row.gf + "</td><td>" + row.ga + "</td><td>" + (row.w * 3 + row.d) + "</td></tr>";
    }
    html = html + "</table><button type='button' onclick='closeModal()'>Close</button>"
    openModal(html);
}

function showFullPower() {
    var power = saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].power;

    power.sort(function(a, b) {
        var ap = a.scr;
        var bp = b.scr;
        if (ap > bp)
            return -1;
        else if (bp > ap)
            return 1;
        else
            return b.m - a.m;
    });
    var html = 
        "<table class='fifaTable'><tr><th colspan='9'>Power Rankings</th></tr>\
        <tr><th colspan='2'></th><th>PTS</th><th>STR</th><th>SCR</th><th>MOV</th></tr>";
    for (let i = 0; i < power.length; i++) {
        var row = power[i];
        html = html + 
            "<tr class='fifaTable'><td>" + (i + 1) + "</td><td>" + row.t + "</td><td>" + row.p + "</td><td>" + row.str + "</td><td>" + row.scr + "</td><td>" + row.m + "</td></tr>";
        }
    html = html + "</table><button type='button' onclick='closeModal()'>Close</button>"
    openModal(html);
}

function sortRosterBy(field) {
    var roster = saveObject.team[saveObject.settings.currentSelections.team].roster;
    roster.sort(function(a, b) {
        if (field == "position")
            return positionList().indexOf(a.position[0]) - positionList().indexOf(b.position[0]);

    });
    showFullRoster();
}

////////////////////////////////////////////////////////////////////////////////
//                                 EDIT SAVES                                 //
////////////////////////////////////////////////////////////////////////////////
function openSettings() {
    var ignoreStats = ["stats", "deepStats", "attr", "currentSelections"];
    var html = 
        "<form action='javascript:void(0)' onsubmit='updateSettings()'>\
            <table class='fifaTable'>";

    html = html + "<tr><th colspan='2'>Statistics</th></tr>";
    for (key in saveObject.settings.stats) {
        var checked = "";
        if (saveObject.settings.stats[key].on)
            checked = "checked";
        html = html + "<tr class='fifaTable' onclick='$(\"#stats" + key + "\").prop(\"checked\", !$(\"#stats" + key + "\").prop(\"checked\"))'><td>" + saveObject.settings.stats[key].display + "</td>\
            <td><input type='checkbox' id='stats" + key + "' " + checked + "></td></tr>";
    }

    html = html + "<tr><th colspan='2'>Deep Statistics</th></tr>";
    for (key in saveObject.settings.deepStats) {
        var checked = "";
        if (saveObject.settings.deepStats[key].on)
            checked = "checked";
        html = html + 
            "<tr class='fifaTable' onclick='$(\"#deepStats" + key + "\").prop(\"checked\", !$(\"#deepStats" + key + "\").prop(\"checked\"))'><td>" + saveObject.settings.deepStats[key].display + "</td>\
            <td><input type='checkbox' id='deepStats" + key + "' " + checked + "></td></tr>";
    }

    html = html + "<tr><th colspan='2'>Attributes</th></tr>";
    for (key in saveObject.settings.attr) {
        var checked = "";
        if (saveObject.settings.attr[key].on)
            checked = "checked";
        html = html + 
            "<tr class='fifaTable' onclick='$(\"#attr" + key + "\").prop(\"checked\", !$(\"#attr" + key + "\").prop(\"checked\"))'><td>" + saveObject.settings.attr[key].display + "</td>\
            <td><input type='checkbox' id='attr" + key + "' " + checked + "></td></tr>";
    }

    html = html + "<tr><th colspan='2'>Other Options</th></tr>";
    for (key in saveObject.settings) {
        if (ignoreStats.includes(key))
            continue;
        var checked = "";
        if (saveObject.settings[key].on)
            checked = "checked";
        html = html + "<tr class='fifaTable' onclick='$(\"#" + key + "\").prop(\"checked\", !$(\"#" + key + "\").prop(\"checked\"))'><td>" + saveObject.settings[key].display + "</td>\
            <td><input type='checkbox' id='" + key + "' " + checked + "></td></tr>";
    }
    html = html + "</table><input type='submit' value='Update Settings'></form>";
    openModal(html);
}

function updateSettings() {
    var ignoreStats = ["stats", "deepStats", "attr", "currentSelections"];
    for (key in saveObject.settings.stats) {
        saveObject.settings.stats[key].on = $("#stats" + key).prop("checked");
    }
    for (key in saveObject.settings.deepStats) {
        saveObject.settings.deepStats[key].on = $("#deepStats" + key).prop("checked");
    }
    for (key in saveObject.settings.attr) {
        saveObject.settings.attr[key].on = $("#attr" + key).prop("checked");
    }
    for (key in saveObject.settings) {
        if (ignoreStats.includes(key))
            continue;
        console.log($("#" + key).prop("checked"));
        saveObject.settings[key].on = $("#" + key).prop("checked");
    }
    closeModal();
}

function playGame() {
    var fixtures = saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].fixtures;

    var team = saveObject.team[saveObject.settings.currentSelections.team].name;
    for (let i = 0; i < fixtures.length; i++) {
        var f = fixtures[i];
        f.competition = saveObject.settings.currentSelections.competition;
        if (new Date(f.date).getTime() == saveObject.date.getTime() && (f.away == team || f.home == team)) {
            loadScript("/loadPlayGame.js", function() {
                var html = 
                    "<p>Would you like to play " + f.home + " vs. " + f.away + "?\
                    <button type='button' id='playGameButton'>Play Game</button>\
                    <button type='button' id='simGameButton'>Sim Game</button>\
                    <button type='button' id='cancelGameButton'>Cancel</button>";
                openModal(html);
                $("#playGameButton").click(function() {
                    loadPlayGame(f, "play");
                    closeModal();
                });
                $("#simGameButton").click(function() {
                    loadPlayGame(f, "sim");
                });
                $("#cancelGameButton").click(closeModal);
            });
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
//                              TIME ADVANCEMENT                              //
////////////////////////////////////////////////////////////////////////////////
function advanceDate(user) {
    openModal("<button type='button' onclick='closeModal()'>Cancel</button>\
    <br>Please enter the date you are simming to:\
    <p id='hiddenError'></p>\
    <input type='date' id='newDate' value='" + saveObject.date.toISOString().substring(0, 10) + "'>\
    <button type='button' onclick='advanceToThisDate(\"" + user + "\")'>Advance Date</button>");
    $("#hiddenError").show();
}

function advanceToThisDate(user) {
    var newDate = new Date($("#newDate").val());
    if (newDate <= saveObject.date)
        $("#hiddenError").html("That date is invalid.");
    else
        completeFixtures(newDate, user);
}

function donezo() {
    console.log(saveObject);
}
function lineups(user) {
    var currLineup = 
        saveObject.team[saveObject.settings.currentSelections.team].lineups[saveObject.settings.currentSelections.lineup];
    $("#fifaPlayLineups").click(function() {
        lineupManagement(user);
    });
    if (!currLineup) {
        $("#fifaPlayLineups").html("<tr><th>No Lineups Created</th></tr><tr><td>Click here to create a lineup</td><tr>");
        return;
    }
    var lineups = fifaPlayLineupsHeader;
    for (let i = 0; i < 11 && i < currLineup.starters.length; i++) {
        lineups = lineups + 
            "<tr class='fifaTable'><td>" + currLineup.starters[i].position + "</td>\
                <td>" + currLineup.starters[i].player.name + "</td></tr>";
    }
    $("#fifaPlayLineups").html(lineups);
    $("#currLineupName").html("Current Lineup: " + currLineup.name);
}

function lineupManagement(user) {
    var lineups = 
    saveObject.team[saveObject.settings.currentSelections.team].lineups;
    var currLineup = lineups[saveObject.settings.currentSelections.lineup];

    var html = 
        "<table class='fifaTable'><tr><td><table class='fifaTable'>";
    for (let i = 0; i < lineups.length + 1; i = i + 2) {
        if (i == lineups.length)
            html = html + "<tr><td class='bordered' onclick='editLineup(" + i  + ", \"" + user + "\")'>New Lineup</td><td class='bordered' ></td></tr>";
        else
            html = html + "<tr><td class='bordered' onclick='saveObject.settings.currentSelections.lineup = " + i + "; lineupManagement(\"" + user + "\")'>" + lineups[i].name + "</td>";
        if (i + 1 == lineups.length)
            html = html + "<td class='bordered' onclick='editLineup(" + (i + 1)  + ", \"" + user + "\")'>New Lineup</td></tr>";
        else if (i + 1 > lineups.length)
            continue;
        else
            html = html + "<td class='bordered' onclick='saveObject.settings.currentSelections.lineup = " + (i + 1) + "; lineupManagement(\"" + user + "\")'>" + lineups[i + 1].name + "</td></tr>";
    }
    html = html + "</table></td>";
    if (!currLineup) {
        html = html + "<td></td></tr></table>\
        <button type='button' onclick='closeModal()'>Close</button>";
        openModal(html);
        return;
    }
    html = html + 
        "<td><table class='fifaTable'><tr><th colspan='3'>" + currLineup.name + "</th></tr>\
            <tr><th colspan='2'>Starting IX</th><th>Bench</th></tr>\
            <tr><th>Position</th><th>Player</th><th>Player</th></tr>";
    for (let i = 0; i < 11; i++) {
        html = html + 
            "<tr class='fifaTable'>\
                <td>" + currLineup.starters[i].position + "</td>\
                <td>" + currLineup.starters[i].player.name + "</td>"
        if (i < 8)
            html = html + "<td>" + currLineup.bench[i].name + "</td></tr>";
        else
            html = html + "<td></td></tr>";
    }
    html = html + "<tr class='fifaTable'><td></td><td><button type='button' onclick='editLineup(" + saveObject.settings.currentSelections.lineup + ", \"" + user + "\")'>Edit Lineup</button></td><td>\
    <button type='button' onclick='saveObject.team[saveObject.settings.currentSelections.team].lineups[saveObject.team[saveObject.settings.currentSelections.team].lineups.length] = saveObject.team[saveObject.settings.currentSelections.team].lineups[saveObject.settings.currentSelections.lineup]; editLineup(saveObject.team[saveObject.settings.currentSelections.team].lineups.length - 1, \"" + user + "\")'>New Lineup from This Lineup</button></td></tr>";
    html = html + "</table></td></tr></table>\
    <button type='button' onclick='closeModal(); lineups(\"" + user + "\")'>Close</button>";
    openModal(html);
}

function editLineup(index, user) {
    sortRosterBy("position");
    var lineup = 
        saveObject.team[saveObject.settings.currentSelections.team].lineups[index];
    var roster = 
        saveObject.team[saveObject.settings.currentSelections.team].roster;
    if (!lineup) {
        var lineup = { name: "", starters: [], bench: [] };
    }

    html = 
        "<table class='fifaTable' id='lineupEditTable'>\
        <tr><th colspan='3'>Lineup Name: <input id='lineupName' type='text' value='" + lineup.name + "'></th></tr>\
        <tr><th colspan='2'>Starting XI</th><th>Bench</th>\
        <tr><th>Position</th><th>Player</th><th>Player</th></tr>";
    for (let i = 0; i < 11; i++) {
        if (lineup.starters[i])
            var sPos = lineup.starters[i].position;

        html = html + "<tr class='fifaTable'><td><select required>";
        var sPos = "";
        if (i == 0)
            html = html + "<option selected>GK</option>";
        else if (!lineup.starters[i])
            html = html + 
                "<option selected disabled>---</option>";
        else
            var sPos = lineup.starters[i].position;

        var disabled = "";
        if (i == 0)
            var disabled = "disabled";
        for (let j = 1; j < positionList().length; j++) {
            var selected = "";
            if (sPos == positionList()[j])
                var selected = "selected";
            html = html + 
                "<option " + selected + " " + disabled + ">" + positionList()[j] + "</option>";
        }
        html = html + "</select></td>";

        html = html + "<td><select required>";
        var sName = "";
        if (!lineup.starters[i])
            html = html + 
                "<option selected disabled>---</option>";
        else
            sName = lineup.starters[i].player.name;
        for (let j = 0; j < roster.length; j++) {
            var selected = "";
            if (sName == roster[j].name) {
                var selected = "selected";
            }
            html = html + 
                "<option " + selected + ">" + roster[j].name + ": " + roster[j].position + "</option>";
        }
        html = html + "</select></td>";

        if (i < 8) {
            html = html + "<td><select required>";
            var bName = "";
            if (!lineup.bench[i])
                html = html + 
                    "<option selected disabled>---</option>";
            else
                var bName = lineup.bench[i].name;
            for (let j = 0; j < roster.length; j++) {
                var selected = "";
                if (bName == roster[j].name)
                    var selected = "selected";
                html = html + 
                    "<option " + selected + ">" + roster[j].name + ": " + roster[j].position + "</option>";
            }
            html = html + "</select></td></tr>";
        } else
            html = html + "<td></td></tr>";
    }
    html = html + "</table><p id='fifaPlayLineupEditError' style='color: red'>You must fill all fields</p>";
    html = html + 
        "<button type='button' onclick='saveLineup(" + index + ", \"" + user + "\")'>\
            Save Lineup</button>\
        <button type='button' onclick='lineupManagement(\"" + user + "\")'>\
            Cancel</button>";
    openModal(html);
    $("#fifaPlayLineupEditError").hide();
}

function saveLineup(index, user) {
    var lineup = new Object();
    lineup.name = $("#lineupName").val();
    lineup.starters = getStarters();
    lineup.bench = getBench();
    
    if ($("#fifaPlayLineupEditError").is(":hidden")) {
        lineup.starters.sort(function(a, b) {
            return positionList().indexOf(a.position) - positionList().indexOf(b.position);
        });
        lineup.bench.sort(function(a, b) {
            return positionList().indexOf(a.position[0]) - positionList().indexOf(b.position[0]);
        });
        saveObject.team[saveObject.settings.currentSelections.team].lineups[index] = lineup;
        saveObject.settings.currentSelections.lineup = index;
    }
    lineupManagement(user);
}

function getStarters() {
    var playerTable = document.getElementById("lineupEditTable");
    var playerRows = playerTable.children[0].children;
    var players = [];
    for (let i = 3; i < playerRows.length; i++)
        players[i - 3] = getStarter(playerRows[i]);
    return players;
}

function getBench() {
    var playerTable = document.getElementById("lineupEditTable");
    var playerRows = playerTable.children[0].children;
    var players = [];
    for (let i = 3; i < playerRows.length - 3; i++)
        players[i - 3] = getBenchPlayer(playerRows[i]);
    return players;
}

function getStarter(playerRow) {
    var roster = saveObject.team[saveObject.settings.currentSelections.team].roster;
    var player = new Object();
    player.position = playerRow.children[0].children[0].value;
    var name = playerRow.children[1].children[0].value;
    if (player.position == "---" || player.name == "---")
        $("#fifaPlayLineupEditError").show();
    else
        player.player = findPlayerInRoster(name.split(":")[0], roster);
    return player;
}

function getBenchPlayer(playerRow) {
    var roster = saveObject.team[saveObject.settings.currentSelections.team].roster;
    var player;
    var name = playerRow.children[2].children[0].value;
    if (name == "---" || $("#lineupName").val() == "")
        $("#fifaPlayLineupEditError").show();
    else
        player = findPlayerInRoster(name.split(":")[0], roster);
    return player;
}
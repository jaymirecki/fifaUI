function loadFifaContent() {
    var auth = new MAuth();
    auth.login(function(user) {
        showForm(user);
    });
}

function showForm(user) {
    var formText = 
        "<form id='newGame'>\
            <label for='gameSelect'>Choose a game:</label>\
            <select id='gameSelect' required>\
                <option value='' disabled selected>---</option>\
            </select><br>\
            <label for='leagueSelect'>Choose a league:</label>\
            <select id='leagueSelect' required disabled>\
                <option value='' disabled selected>---</option>\
            </select><br>\
            <label for='teamSelect'>Choose a team:</label>\
            <select id='teamSelect' required disabled>\
                <option value='' disabled selected>---</option>\
            </select>\
            <table id='players'><tr><th>Name</th>\
                    <th>Position</th>\
                    <th>Age</th>\
                    <th>Wage</th>\
                    <th>Contract</th>\
                    <th>Value</th>\
                    <th>Nationality</th>\
                    <th>Overall</th>\
                    <th></th></tr>";
    for (var i = 0; i < 18; i = i + 1)
        formText = formText + playerInfo;
    formText = formText + 
        "   <tr><td colspan='9'><button onclick='addPlayer(this)'>Add Player</button></td></tr></table>\
            <button type='button' onclick='exportPlayers()'>Export Current Roster</button>\
            <button type='button' onclick='importPlayers()'>Import to Current Roster</button>\
            <textarea id='rosterJson'></textarea>\
            <input type='submit' value='New Game' disabled>\
        </form>";
    $("#fifaContent").html(formText);
    $("select").change(user, formChange);
    $(".removePlayer").attr("disabled", true);
    showGames(user);
}

function formChange(user) {
    if ($(this).attr('id') == "gameSelect")
        showLeagues(user);
    else if ($(this).attr('id') == "leagueSelect")
        showTeams(user);
}

function showGames(user) {
    var request = new XMLHttpRequest();
    var getUrl = baseUrl + "game";
    request.open("GET", getUrl, true);
    request.onreadystatechange = function() {
        if (request.readyState != 4)
            return;
        var results = JSON.parse(request.responseText);
        if (results.error) {
            fifaError(results.error);
            return;
        }
        var games = "<option value='' disabled selected>---</option>";;
        for (key in results) {
            games = games + "<option value='" + key + "'>" + key + "</option>";
        }
        $("#gameSelect").html(games);
    }
    request.send();
}

function showLeagues(user) {
    var game = $("#gameSelect").val();
    var getUrl = baseUrl + "game?game=" + game;
    var request = new XMLHttpRequest();
    request.open("GET", getUrl, true);
    request.onreadystatechange = function() {
        if (request.readyState != 4)
            return;
        var results = JSON.parse(request.responseText);
        if (results.error) {
            fifaError(results.error);
            return;
        }
        var leagues = "<option value='' disabled selected>---</option>";
        results.leagues.forEach(function (l) {
            leagues = leagues + "<option value='" + l + "'>" + l + "</option>"; 
        });
        $("#leagueSelect").html(leagues);
        $("#leagueSelect").attr('disabled', false);
        $("#teamSelect").attr('disabled', true);
    }
    request.send();
}

function showTeams(user) {
    var game = $("#gameSelect").val();
    var league = $("#leagueSelect").val();
    var getUrl = baseUrl + "league?game=" + game + "&league=" + league;
    var request = new XMLHttpRequest();
    request.open("GET", getUrl, true);
    request.onreadystatechange = function() {
        if (request.readyState != 4)
            return;
        var results = JSON.parse(request.responseText);
        if (results.error) {
            fifaError(results.error);
            return;
        }
        var teams = "<option value='' disabled selected>---</option>";
        results.teams.forEach(function (t) {
            teams = teams + "<option value='" + t + "'>" + t + "</option>"; 
        });
        $("#teamSelect").html(teams);
        $("#teamSelect").attr('disabled', false);
    }
    request.send();
}

function useTeam(user) {

}

function addPlayer(player) {
    player.parentNode.parentNode.outerHTML =
        playerInfo
        + player.parentNode.parentNode.outerHTML;
    $(".removePlayer").attr("disabled", false);
}

function resetPlayer(player) {
    player.parentNode.parentNode.outerHTML = playerInfo;
}
function removePlayer(player) {
    if (player.parentNode.parentNode.parentNode.children.length <= 21)
        $(".removePlayer").attr("disabled", true);
    player.parentNode.parentNode.outerHTML = "";
}

function getPlayers() {
    var playerTable = document.getElementById("players");
    var playerRows = playerTable.children[0].children;
    var players = [];
    for (let i = 1; i < playerRows.length - 1; i++)
        players[i - 1] = getPlayer(playerRows[i]);
    return players;
}

function setPlayers(players) {
    var playerTable = document.getElementById("players");
    var playerRows = playerTable.children[0].children;
    for (let i = 0; i < players.length - playerRows.length + 3; i++)
        addPlayer(document.getElementById("players").children[0].children[4].children[0].children[0]);
    var playerTable = document.getElementById("players");
    var playerRows = playerTable.children[0].children;
    for (let i = 0; i < players.length; i++)
        setPlayer(playerRows[i + 1], players[i]);
}

function getPlayer(playerRow) {
    var player = new Object();
    player.name = playerRow.children[0].children[0].value;
    player.position = $(playerRow.children[1].children[0]).val();
    player.age = parseInt(playerRow.children[2].children[0].value, 10);
    player.wage = parseInt(playerRow.children[3].children[0].value, 10);
    player.contract = new Date(playerRow.children[4].children[0].value);
    player.value = parseInt(playerRow.children[5].children[0].value, 10);
    player.nationality = playerRow.children[6].children[0].value;
    player.overall = parseInt(playerRow.children[7].children[0].value, 10);
    return player;
}

function setPlayer(playerRow, player) {
    playerRow.children[0].children[0].value = player.name;
    playerRow.children[1].children[0].value = player.position;
    playerRow.children[2].children[0].value = player.age;
    playerRow.children[3].children[0].value = player.wage;
    playerRow.children[4].children[0].value = player.contract;
    playerRow.children[5].children[0].value = player.value;
    playerRow.children[6].children[0].value = player.nationality;
    playerRow.children[7].children[0].value = player.overall;
}

function exportPlayers() {
    $("#rosterJson").val(JSON.stringify(getPlayers()));
    return false;
}

function importPlayers() {
    var players = JSON.parse($("#rosterJson").val());
    setPlayers(players);
    return false;
}

var nationalities = 
    ['American', 'Argentinian', 'Bosnian', 'Brazilian', 'Cameroonian', 'Canadian', 'Congolese', 'Dutch', 'English', 'French', 'German', 'Jamaican', 'Mexican', 'Polish', 'Scottish', 'Spanish']
var playerInfo = 
    "<tr><td><input type='text'></td>\
        <td><select multiple>\
                <option value='GK'>GK</option>\
                <optgroup label='Defenders'>\
                    <option value='RB'>RB</option>\
                    <option value='CB'>CB</option>\
                    <option value='LB'>LB</option>\
                </optgroup>\
                <optgroup label='Midfielders'>\
                    <option value='CDM'>CDM</option>\
                    <option value='LM'>LM</option>\
                    <option value='CM'>CM</option>\
                    <option value='RM'>RM</option>\
                    <option value='CAM'>CAM</option>\
                </optgroup>\
                <optgroup label='Attackers'>\
                    <option value='CF'>CF</option>\
                    <option value='LW'>LW</option>\
                    <option value='ST'>ST</option>\
                    <option value='RW'>RW</option>\
                </optgroup>\
            </select></td>\
        <td><input type='number'></td>\
        <td><input type='number'></td>\
        <td><input type='number'></td>\
        <td><input type='number'></td>\
        <td><select><option value='' disabled selected>---</option>";
nationalities.forEach(function(n) {
    playerInfo = playerInfo + "<option value='" + n + "'>" + n + "</option>";
});
playerInfo = playerInfo + "</select></td>\
        <td><input type='number'></td>\
        <td><button onclick='resetPlayer(this)'>Reset</button></td>\
        <td><button class='removePlayer' onclick='removePlayer(this)'>Remove</button></td>\
    </tr>";
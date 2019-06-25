function loadFifaContent(user) {
    var auth = new MAuth();
    auth.login(function(user) {
        showSaves(user);
    });
}

function showSaves(user) {
    var userId = user._id;
    var request = new XMLHttpRequest();
    var getString = baseUrl + "saves?u=" + userId;
    request.open("GET", getString, true);
    console.log(getString);
    request.onreadystatechange = function() {
        if (request.readyState != 4)
            return;
        console.log(request.responseText);
        var results = JSON.parse(request.responseText);
        if (results.error) {
            $("#fifaContent").html("ERROR: " + results.error);
        }
        var saveTable =
            "<table class='fifaTable' id='saves'><tr class='fifaTable' onclick='selectGame(this)'><th class='fifaTable'>Name</th><th class='fifaTable'>Date Modified</th></tr>";
        for (save in results)
            saveTable = 
                saveTable + "<tr class='fifaTable'><td class='fifaTable' name='name'>" 
                + save.name + "</td><td class='fifaTable'>" + save.mod 
                + "</td></tr>"
        saveTable = 
            saveTable + "<tr class='fifaTable' onclick='selectGame(this)' id='newgame'><td class='fifaTable' colspan='2'>New Game</td></tr></table><button type='button' onclick='logout()'>Logout</button>"
        $("#fifaContent").html(saveTable);
    }
    request.send();
}

function logout() {
    var auth = new MAuth(function() {
        auth.logout('/');
    });
}

function selectGame(game) {
    var gameName = game.id;
    if (gameName == "newgame")
        window.location.href = baseUrl + "new_game";
    else
        window.location.href = baseUrl + "game/" + gameName;
}
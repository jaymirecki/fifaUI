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
    request.onreadystatechange = function() {
        if (request.readyState != 4)
            return;
        var results = JSON.parse(request.responseText);
        if (results.error) {
            $("#fifaContent").html("ERROR: " + results.error);
        }
        var saveTable =
            "<table class='centered' class='fifaTable' id='saves'><tr class='fifaTable'><th class='fifaTable'>Name</th><th class='fifaTable'>Date Modified</th></tr>";
        for (let i = 0; i < results.length; i++) {
            save = results[i];
            save.doc = new Date(save.doc);
            save.dom = new Date(save.dom);
            save.date = new Date(save.date);
            saveTable = 
                saveTable + "<tr class='fifaTable' onclick='selectGame(this)' id='" + save._id + "'><td class='fifaTable' name='name'>" 
                + save.name + "</td><td class='fifaTable'>" + save.dom.toLocaleString("default"); 
                + "</td></tr>";
            }
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
        window.location.href = baseUrl + "play/" + gameName;
}
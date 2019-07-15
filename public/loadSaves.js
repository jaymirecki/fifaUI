function loadFifaContent(user) {
    var auth = new MAuth(function() {
        auth.login(function(user) {
            showSaves(user._id);
        });
    });
    
}

function showSaves(userId) {
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
        results.sort(function(a, b) {
            if (a.dom > b.dom)
                return -1;
            else if (a.dom < b.dom)
                return 1;
            else
                return 0;
        });
        var saveTable =
            "<div class='centered'><table class='fifaTable' id='saves'><tr class='fifaTable'><th class='fifaTable'>Name</th><th>Team</th><th class='fifaTable'>Date Modified</th><th></th></tr>";
        for (let i = 0; i < results.length; i++) {
            save = results[i];
            save.doc = new Date(save.doc);
            save.dom = new Date(save.dom);
            save.date = new Date(save.date);
            saveTable = 
                saveTable + "<tr class='fifaTable' id='" + save._id + "'><td class='fifaTable' name='name' onclick='selectGame(this.parentNode)'>" 
                + save.name + "</td><td class='fifaTable' onclick='selectGame(this.parentNode)'>" + save.settings.currentSelections.team + "</td><td class='fifaTable' onclick='selectGame(this.parentNode)'>" + save.dom.toLocaleString("default") + "</td><td><button type='button' onclick='deleteGame(\"" + userId + "\", \"" + save._id + "\")'>Delete</button></tr>";
            }
        saveTable = 
            saveTable + "<tr class='fifaTable' onclick='selectGame(this)' id='newgame'><td class='fifaTable' colspan='4'>New Game</td></tr></table></div><button type='button' onclick='logout()'>Logout</button>"
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

function deleteGame(user, gameId) {
    openModal(
        "<p>Are you sure you want to delete this game?</p>\
        <button type='button' onclick='confirmDelete(\"" + user + "\", \"" + gameId + "\")'>Yes</button>\
        <button type='button' onclick='closeModal()'>No</button>");
}
function confirmDelete(user, gameId) {
    var posturl = baseUrl + "delete";
    var request = new XMLHttpRequest();
    request.open("POST", posturl, true);
    request.onreadystatechange = function() {
        if (request.readyState != 4)
            return;
        console.log(request.responseText);
        var results = JSON.parse(request.responseText);
        if (results.success) {
            closeModal();
            showSaves(user);
        } else {
            stopLoading();
            fifaError(results.error);
        }
    }
    var postString = "u=" + user + "&s=" + gameId;
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(postString);
}
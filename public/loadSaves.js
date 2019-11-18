function loadFifaContent() {
    var auth = new MAuth(function () {
        auth.login(function (user) {
            getSaves(user._id);
        });
    });
}

function getSaves(userId) {
    var request = new XMLHttpRequest();
    var getString = "/saves?user=" + userId;
    console.log(getString);
    request.open("GET", getString, true);
    request.onreadystatechange = function () {
        if (request.readyState != 4)
            return;
        console.log(request.responseText);
        var results = JSON.parse(request.responseText);
        if (results.error) {
            $("#fifaContent").html("ERROR: " + results.error);
        } else {
            showSaves(userId, results);
        }
    };
    request.send();
}

function showSaves(userId, results) {
    results.sort(function (a, b) {
        if (a.dom > b.dom)
            return -1;
        else if (a.dom < b.dom)
            return 1;
        else
            return 0;
    });

    var saveTable = 
        "<div class='centered'>\
            <table class='fifaTable' id='saves'>\
                <tr class='fifaTable'><th class='fifaTable'>Name</th><th>Team</th><th class='fifaTable'>Date Modified</th><th></th></tr>";
    for (var i = 0; i < results.length; i++) {
        save = results[i];
        save.doc = new Date(save.doc);
        save.dom = new Date(save.dom);
        save.date = new Date(save.date);
        saveTable =
            saveTable + "<tr class='fifaTable' id='" + save._id + "'><td class='fifaTable' name='name' onclick='selectGame(this.parentNode)'>"
                + save.name + "</td><td class='fifaTable' onclick='selectGame(this.parentNode)'>" + save.team + "</td><td class='fifaTable' onclick='selectGame(this.parentNode)'>" + save.dom.toLocaleString("default") + "</td><td><button type='button' onclick='deleteGame(\"" + userId + "\", \"" + save._id + "\")'>Delete</button></tr>";
    }
    saveTable =
        saveTable + 
        "<tr class='fifaTable' id='newgame'><td class='fifaTable' colspan='4'>New Game</td></tr>\
        </table></div><button type='button' onclick='logout()'>Logout</button>";
    $("#fifaContent").html(saveTable);
    $("#newgame").click(function() {
        newGameForm(userId);
    })
}

function logout() {
    var auth = new MAuth(function() {
        auth.logout('/');
    });
}

var newGameForm = (user) => {
    var request = new XMLHttpRequest();
    var getString = "/newgame";
    request.open("GET", getString, true);
    request.onreadystatechange = function () {
        if (request.readyState != 4)
            return;
        var results = JSON.parse(request.responseText);
        if (results.error) {
            $("#fifaContent").html("ERROR: " + results.error);
        } else {
            console.log(results);
            let form = 
                '<form id="fifaNewGame" action="javascript:void(0)">\
                    <label for="name">Name:</label>\
                    <input id="name" type="text" required>\
                    <label for="manName">Manager Name:</label>\
                    <input id="manName" type="text" required>\
                    <label for="gameSelect">Choose Game:</label>\
                    <select id="gameSelect" required>\
                        <option value="" disabled selected>---</option>'
            for (let game in results) {
                form = form + 
                    '<option value="' + game + '">' + game + '</option>';
            }
            form = form +
                    '</select><br>\
                    <label for="leagueSelect">Choose League:</label>\
                    <select id="leagueSelect" required>\
                        <option value="" disabled selected>---</option>\
                    </select><br>\
                    <label for="teamSelect">Choose Team:</label>\
                    <select id="teamSelect" required>\
                        <option value="" disabled selected>---</option>\
                    </select><br>\
                    <input id="formSubmit" type="submit">\
                </form>';
            openModal(form);
            $("#fifaNewGame").submit(function() {
                createGame(user, results);
            });
            $("#gameSelect").change(function() {
                updateLeagues(results[this.value]);
            });
            $("#leagueSelect").change(function() {
                updateTeams(results[$("#gameSelect").val()][this.value].teams);
            });
        }
    };
    request.send();
}

function updateLeagues(leagues) {
    let form = 
        '<option value="" disabled selected>---</option>';
    for (league in leagues) {
        form = form + 
            '<option value="' + league + '">' + league + '</option>';
    }
    $("#leagueSelect").html(form);
    $("#teamSelect").html('<option value="" disabled selected>---</option>');
}

function updateTeams(teams) {
    let form = 
        '<option value="" disabled selected>---</option>';
    for (i in teams) {
        form = form + 
            '<option value="' + teams[i] + '">' + teams[i] + '</option>';
    }
    $("#teamSelect").html(form);
}

function createGame(user, results) {
    $("#formSubmit").prop("disabled", true);
    let save = {
        user: user,
        name: $("#name").val(),
        managerName: $("#manName").val(),
        game: $("#gameSelect").val(),
        shared: false,
        doc: new Date().getTime(),
        dom: new Date().getTime(),
        date: new Date(results[$("#gameSelect").val()][$("#leagueSelect").val()].date).getTime(),
        league: $("#leagueSelect").val(),
        team: $("#teamSelect").val(),
    };
    save = objectToPostString(save);
    var request = new XMLHttpRequest();
    var getString = "/newsave";
    request.open("POST", getString, true);
    request.onreadystatechange = function () {
        if (request.readyState != 4)
            return;
        var results = JSON.parse(request.responseText);
        window.location.href = window.location.href + "?g=" + results.id;
    };
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send(save);
}

function objectToPostString(obj) {
    let postString = "";
    for (key in obj) {
        postString = postString +
            "&" + key + "=" + obj[key];
    }
    return postString.slice(1);
}

function selectGame(game) {
    var gameName = game.id;
    if (gameName == "newgame")
        window.location.href = "/new_game";
    else
        window.location.href = "/play?g=" + gameName;
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
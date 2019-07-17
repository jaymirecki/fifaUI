function loadPlayGame(fixture, user) {
    var teamName = saveObject.getCurrentTeam().name;
    if (fixture.home == teamName)
        var side = "home";
    else
        var side = "away";
    var lineups = new FCLineups()
    $("#fifaPlayContent").html("<table><tr id='playGameLayout'></tr></table>");
    fifaPlayGameLineupSelect(fixture, teamName, user);
    
}

function fifaPlayGameLineupSelect(fixture, teamName, user) {
    var lineups = new FCLineups(saveObject.getLineups(), saveObject.getCurrentLineup());
    var lineupsHtml = FCLineups.getLineupWidget() 
        + "<button type='button' id='fifaPlayGameSelectLineup'>\
            Select This Lineup and Start Game\
        </button>";

    $("#playGameLayout").append(lineupsHtml);
    lineups.updateLineupWidget(false);
    $("#fifaPlayGameSelectLineup").click(function() {
        $("#fifaPlayGameSelectLineup").prop("disabled", true);
        lineups.disableWidget();
        fifaPlayGameStartGame(fixture, lineups.getLineup());
    });
}

function fifaPlayGameStartGame(fixture, lineup) {
    fifaPlayGameRoster(lineup);

    var matchEvents = 
        "<td><table class='fifaTable'>\
        <tr><th>" + fixture.home + "</th>\
            <th>" + fixture.away + "</th>\
            <th id='currentTime'>0'</th></tr>\
        <tr><th id='homeScore'>0</th>\
            <th id='awayScore'>0</th><th></th></tr>\
        <tr><th><button type='button' id='homeGoalButton'>Add Home Goal</button></th>\
            <th><button type='button' id='awayGoalButton'>Add Away Goal</button></th>\
            <th><button type='button' id='subButton'>Substitution</button>\
            <br><button type='button' id='yellowCardButton'>Add Yellow Card</button>\
            <br><button type='button' id='redCardButton'>Add Red Card</button></th></tr></table></td>";
    $("#playGameLayout").append(matchEvents);
    $("#homeGoalButton").click(function() {
        var html = 
            "Minute: <input type='number' id='newTime' value='" + $("#currentTime").html().split("'")[0] + "'>\
            <button type='button' id='addHomeGoal'>Add Home Goal</button>\
            <button type='button' onclick='closeModal()'>Cancel</button>";
        openModal(html);
        $("#addHomeGoal").click(function() {
            $("#homeScore").html(parseInt($("#homeScore").html(), 10) + 1);
            $("#currentTime").html($("#newTime").val() + "'");
            closeModal()
        })
    });
    $("#awayGoalButton").click(function() {
        var html = 
            "Minute: <input type='number' id='newTime' value='" + $("#currentTime").html().split("'")[0] + "'>\
            <button type='button' id='addAwayGoal'>Add Away Goal</button>\
            <button type='button' onclick='closeModal()'>Cancel</button>";
        openModal(html);
        $("#addAwayGoal").click(function() {
            $("#awayScore").html(parseInt($("#awayScore").html(), 10) + 1);
            $("#currentTime").html($("#newTime").val() + "'");
            closeModal()
        })
    });
    $("#subButton").click(function() {
        var html =
            "<table class='fifaTable'><tr><th>OUT</th><th>IN</th><th>TIME</th></tr>\
            <tr><td><select id='outPlayer'>";
        for (let i=0; i < 18; i++) {
            if (i < 11)
                var player = lineup.starters[i].player;
            else
                var player = lineup.bench[i - 11];
            var position = $("#" + player.name.replace(/ /g, "") + "pos").html();
            if (position != "SUB" && position != "OUT")
                html = html + 
                    "<option>" + player.name + "</option>";
        }
        html = html + "</select></td><td><select id='inPlayer'>";
        for (let i=0; i < 7; i++) {
            var player = lineup.bench[i];
            var position = $("#" + player.name.replace(/ /g, "") + "pos").html();
            if (position == "SUB")
                html = html + 
                    "<option>" + player.name + "</option>";
        }
        html = html + "</select></td><td><input type='number' id='subTime' value='" + $("#currentTime").html().split("'")[0] + "'></td></tr>\
        <tr><td><button type='button' id='makeSub'>Make Sub</button></td>\
            <td><button type='button' onclick='closeModal()'>Cancel</button</td>\
            <td></td></tr></table>";
        openModal(html);
        $("#makeSub").click(function() {
            var outPlayer = $("#outPlayer").val().replace(/ /g, "");
            var inPlayer = $("#inPlayer").val().replace(/ /g, "");
            $("#" + inPlayer + "pos").html($("#" + outPlayer + "pos").html());
            $("#" + outPlayer + "pos").html("OUT");
            $("#" + inPlayer + "min").html(- parseInt($("#subTime").val(), 10));
            $("#" + outPlayer + "min").html(parseInt($("#subTime").val(), 10));
            $("#currentTime").html($("#subTime").val() + "'");
            closeModal();
        });
    });

    $("#yellowCardButton").click(function() {
        var html =
            "<table class='fifaTable'><tr><th>PLAYER</th><th>TIME</th></tr>\
            <tr><td><select id='cardPlayer'>";
        for (let i=0; i < 18; i++) {
            if (i < 11)
                var player = lineup.starters[i].player;
            else
                var player = lineup.bench[i - 11];
            var position = $("#" + player.name.replace(/ /g, "") + "pos").html();
            if (position != "SUB" && position != "OUT")
                html = html + 
                    "<option>" + player.name + "</option>";
        }
        html = html + "</select></td><td><input type='number' id='cardTime' value='" + $("#currentTime").html().split("'")[0] + "'></td></tr>\
        <tr><td><button type='button' id='giveCard'>Give Card</button></td>\
            <td><button type='button' onclick='closeModal()'>Cancel</button</td></tr></table>";
        openModal(html);

        $("#giveCard").click(function() {
            var cardPlayer = $("#cardPlayer").val().replace(/ /g, "");
            $("#" + cardPlayer + "yellow").html(parseInt($("#" + cardPlayer + "yellow").html(), 10) + 1);
            if (parseInt($("#" + cardPlayer + "yellow").html(), 10) == 2)
                $("#" + cardPlayer + "pos").html("OUT");
            $("#currentTime").html($("#cardTime").val() + "'");
            closeModal();
        });
    });

    $("#redCardButton").click(function() {
        var html =
            "<table class='fifaTable'><tr><th>PLAYER</th><th>TIME</th></tr>\
            <tr><td><select id='cardPlayer'>";
        for (let i=0; i < 18; i++) {
            if (i < 11)
                var player = lineup.starters[i].player;
            else
                var player = lineup.bench[i - 11];
            var position = $("#" + player.name.replace(/ /g, "") + "pos").html();
            if (position != "SUB" && position != "OUT")
                html = html + 
                    "<option>" + player.name + "</option>";
        }
        html = html + "</select></td><td><input type='number' id='cardTime' value='" + $("#currentTime").html().split("'")[0] + "'></td></tr>\
        <tr><td><button type='button' id='giveCard'>Give Red Card</button></td>\
            <td><button type='button' onclick='closeModal()'>Cancel</button</td></tr></table>";
        openModal(html);

        $("#giveCard").click(function() {
            var cardPlayer = $("#cardPlayer").val().replace(/ /g, "");
            $("#" + cardPlayer + "red").html(parseInt($("#" + cardPlayer + "red").html(), 10) + 1);
            $("#" + cardPlayer + "pos").html("OUT");
            $("#currentTime").html($("#cardTime").val() + "'");
            closeModal();
        });
    });
}

function fifaPlayGameRoster(lineup) {
    var gameRosterTable = 
        "<td><table class='fifaTable'><tr><th>Player</th><th>Position</th><th>Minutes</th><th>Goals</th><th>Yellow Cards</th><th>Red Cards</th></tr>";
    for (let i = 0; i < 18; i++) {
        if (i < 11) {
            var player = lineup.starters[i].player.name;
            var position = lineup.starters[i].position;
        } else {
            var player = lineup.bench[i - 11].name;
            var position = "SUB";
        }
        var name = player.replace(/ /g, "");
        gameRosterTable = gameRosterTable + 
            "<tr class='fifaTable'>\
                <td>" + player + "</td>\
                <td id='" + name + "pos'>" + position + "</td>\
                <td id='" + name + "min'>0</td>\
                <td id='" + name + "goals'>0</td>\
                <td id='" + name + "yellow'>0</td>\
                <td id='" + name + "red'>0</td>\
            </tr>";
    }
    var gameRosterTable = gameRosterTable + "</table></td>";
    $("#playGameLayout").append(gameRosterTable);
}
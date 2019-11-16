class FCGame {
    constructor(fixture, teamName, lineups, continuation) {
        this.fixture = fixture;
        this.team = teamName;
        this.lineups = lineups;
        this.continuation = continuation;
        this.key = new Date().getTime();
        this.time = 0;
        this.homeScore = 0;
        this.awayScore = 0;
        this.gameLineup = { xi: [], bench: [], out: [] };

        this.getUiElements.bind(this);
        this.selectLineup.bind(this);
        this.updateRoster.bind(this);
        this.updateScoreline.bind(this);
        this.substitution.bind(this);
        
        if (this.fixture.home == teamName)
            this.side = "home";
        else
            this.side = "away";
        
        $("#fifaPlayContent").html("<table><tr id='playGameLayout'></tr></table>");
        var lineupsHtml = 
            FCLineups.getLineupWidget() + 
            "<button type='button' id='FCGameSelectLineup" + this.key + "'>\
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

    getUiElements(lineupsDiv, rosterDiv, eventsDiv) {
        var lineupsHtml = 
            FCLineups.getLineupWidget() +
            "<button type='button' id='FCGameSelectLineup" + this.key + "'>\
                Select This Lineup and Start Game\
            </button>";


            
        var gameRosterTable = 
            "<table class='fifaTable' id='FCGameRoster" + this.key + "'><tr>\
                <th>Player</th><th>Position</th><th>Minutes</th>\
                <th>Goals</th><th>Yellow Cards</th><th>Red Cards</th></tr>";
        for (let i = 0; i < 18; i++) {
            gameRosterTable = gameRosterTable + "<tr class='fifaTable'>\
            <td>[PLAYER]</td><td>[POS]</td><td>[0]</td>\
            <td>[0]</td><td>[0]</td><td>[0]</td></tr>"
        }
        gameRosterTable = gameRosterTable + "</table>";

        var matchEventsHtml = 
            "<table class='fifaTable' id='matchEvents" + this.key + "'>\
            <tr><th>" + this.fixture.home + "</th>\
            <th>" + this.fixture.away + "</th>\
            <th>Time</th></tr>\
            <tr id='FCGameScoreline" + this.key + "'>\
                <th>[HOME SCORE]</th>\
                <th>[AWAY SCORE]</th>\
                <th>[TIME ELAPSED]</th></tr>\
            <tr>\
                <th><button type='button' id='FCGameHomeGoalButton" + this.key + "'>Add Home Goal</button></th>\
                <th><button type='button' id='FCGameAwayGoalButton" + this.key + "'>Add Away Goal</button></th>\
                <th><button type='button' id='FCGameSubButton" + this.key + "'>Substitution</button>\
                <br><button type='button' id='FCGameYellowCardButton" + this.key + "'>Add Yellow Card</button>\
                <br><button type='button' id='FCGameRedCardButton" + this.key + "'>Add Red Card</button>\
                <br><button type='button' id='FCGameEndGame" + this.key + "'>End Game</button></th></tr>\
            </table>";

        $("#" + lineupsDiv).html(lineupsHtml);
        this.lineups.updateLineupWidget();
        $("#" + rosterDiv).html(gameRosterTable);
        $("#" + eventsDiv).html(matchEventsHtml);
        // $("#roster" + this.key).hide();
        // $("#matchEvents" + this.key).hide();
        $("#home")
        $("#FCGameSelectLineup" + this.key).click(function() {this.selectLineup()}.bind(this));
        $("#FCGameHomeGoalButton" + this.key).click(function() {this.addGoal("home")}.bind(this));
        $("#FCGameAwayGoalButton" + this.key).click(function() {this.addGoal("away")}.bind(this));
        $("#FCGameSubButton" + this.key).click(function() {this.substitution()}.bind(this));
        $("#FCGameYellowCardButton" + this.key).click(function() {this.addCard("yellow")}.bind(this));
        $("#FCGameRedCardButton" + this.key).click(function() {this.addCard("red")}.bind(this));
        $("#FCGameEndGame" + this.key).click(function() {this.endGame()}.bind(this));
    }

    selectLineup() {
        this.lineups.disableWidget();
        $("#FCGameSelectLineup" + this.key).prop("disabled", "true");
        $("#matchEvents" + this.key).show();
        this.updateScoreline();

        var lineup = this.lineups.getLineup();
        console.log(this.gameLineup.xi);
        for (let i = 0; i < 11; i++) {
            var p = lineup.starters[i];
            this.gameLineup.xi.push({ 
                name: p.player.name, 
                position: p.position,
                possible: p.player.position,
                start: 0,
                goals: 0,
                yellows: 0,
                reds: 0 });
        }
        for (let i = 0; i < lineup.bench.length; i++) {
            var p = lineup.bench[i];
            this.gameLineup.bench.push({ 
                name: p.name, 
                position: "SUB",
                possible: p.position,
                start: 0,
                goals: 0,
                yellows: 0,
                reds: 0 });
        }
        
        this.updateRoster();
    }

    updateScoreline() {
        var newScoreline = 
            "<th>" + this.homeScore + "</th>\
            <th>" + this.awayScore + "</th>\
            <th>" + this.time + "'</th>";
        $("#FCGameScoreline" + this.key).html(newScoreline);
    }
    updateRoster() {
        var gameRosterTable = 
            "<tr>\
                <th>Player</th><th>Position</th><th>Minutes</th>\
                <th>Goals</th><th>Yellow Cards</th><th>Red Cards</th></tr>";
        var xi = this.gameLineup.xi;
        var bench = this.gameLineup.bench;
        var out = this.gameLineup.out;
        for (let i = 0; i < xi.length + bench.length + out.length; i++) {
            if (i < xi.length) {
                var player = xi[i];
                player.minutes = this.time - player.start;
            } else if (i - xi.length < bench.length) {
                var player = bench[i - xi.length];
                player.minutes = 0;
            } else {
                var player = out[i - (bench.length + xi.length)];
                player.minutes = player.end - player.start;
            }
            gameRosterTable = gameRosterTable + "<tr class='fifaTable'>\
                <td>" + player.name + "</td><td>" + player.position + "</td>\
                <td>" + player.minutes + "</td><td>" + player.goals + "</td>\
                <td>" + player.yellows + "</td><td>" + player.reds + "</td>\
            </tr>";
        }
        $("#FCGameRoster" + this.key).html(gameRosterTable);
    }
    addGoal(side) {
        var formHtml = "";
        if (side == this.side) {
            formHtml = 
                "<select id='FCGameScorer" + this.key + "'>";
            for (let i = 0; i < this.gameLineup.xi.length; i++)
                formHtml = formHtml + 
                    "<option>" + this.gameLineup.xi[i].name + "</option>";
            formHtml = formHtml + "</select>";
        }
        formHtml = formHtml + 
            "<input type='number' id='FCGameNewTime" + this.key + "' value='" + this.time + "'>\
            <button type='button' id='FCGameAddGoal" + this.key + "'>Add Goal</button>\
            <button type='button' id='FCGameCloseModal" + this.key + "'>Cancel</button>";
        openModal(formHtml);
        $("#FCGameAddGoal" + this.key).click(function() {
            this.time = parseInt($("#FCGameNewTime" + this.key).val(), 10);
            if (side == "home")
                this.homeScore = this.homeScore + 1;
            else
                this.awayScore = this.awayScore + 1;
            if (side == this.side) {
                var scorerName = $("#FCGameScorer" + this.key).val();
                var scorer = this.gameLineup.xi.find(function(p, i, xi) {
                    return p.name == scorerName;
                });
                scorer.goals = scorer.goals + 1;
            }
            this.updateScoreline();
            this.updateRoster();
            closeModal();
        }.bind(this));
        $("#FCGameCloseModal" + this.key).click(function() {
            closeModal();
        });
    }
    addCard(color) {
        var formHtml = "<select id='FCGameCard" + this.key + "'>";
        for (let i = 0; i < this.gameLineup.xi.length; i++)
            formHtml = formHtml + "<option>" + this.gameLineup.xi[i].name + "</option>";
        formHtml = formHtml + 
            "</select><input type='number' id='FCGameNewTime" + this.key + "' value='" + this.time + "'>\
            <button type='button' id='FCGameAddCard" + this.key + "'>Add Card</button>\
            <button type='button' id='FCGameCloseModal" + this.key + "'>Cancel</button>";
        openModal(formHtml);
        $("#FCGameAddCard" + this.key).click(function() {
            var cardName = $("#FCGameCard" + this.key).val();
            this.time = parseInt($("#FCGameNewTime" + this.key).val(), 10);
            var card = this.gameLineup.xi.find(function(p) {
                return p.name == cardName
            });
            if (color == "yellow") {
                card.yellows = card.yellows + 1;
                if (card.yellows == 2) {
                    card.reds = 1;
                    this.playerOut(card.name);
                }
            } else {
                card.reds = 1;
                this.playerOut(card.name);
            }
            this.updateRoster();
            this.updateScoreline();
            closeModal();
        }.bind(this));
        
        $("#FCGameCloseModal" + this.key).click(closeModal);
    }
    playerOut(playerName) {
        var index = -1;
        for (let i = 0; i < this.gameLineup.xi.length; i++) {
            if (this.gameLineup.xi[i].name == playerName) {
                var player = this.gameLineup.xi[i];
                index = i;
            }
        }
        if (index > -1) {
            player.position = "OUT";
            player.end = this.time;
            this.gameLineup.out.push(player);
            this.gameLineup.xi.splice(index, 1);
        }
    }
    playerIn(playerName, position) {
        var index = -1;
        for (let i = 0; i < this.gameLineup.bench.length; i++) {
            if (this.gameLineup.bench[i].name == playerName) {
                var player = this.gameLineup.bench[i];
                index = i;
            }
        }
        if (index > -1) {
            player.position = position;
            player.start = this.time;
            this.gameLineup.xi.push(player);
            this.gameLineup.bench.splice(index, 1);
        }
    }
    substitution() {
        var formHtml = 
            "<table><tr><th>Out</th><th>In</th><th>Position</th><th>Time</th></tr>\
            <tr><td><select id='FCGamePlayerOut" + this.key + "'>";
        for (let i = 0; i < this.gameLineup.xi.length; i++) {
            formHtml = formHtml + 
                "<option>" + this.gameLineup.xi[i].name + "</option>";
        }
        formHtml = formHtml + 
            "</select></td><td><select id='FCGamePlayerIn" + this.key + "'>";
        for (let i = 0; i < this.gameLineup.bench.length; i++) {
            formHtml = formHtml +
                "<option>" + this.gameLineup.bench[i].name + "</option>";
        }
        for (let i = 0; i < this.gameLineup.xi.length; i++) {
            formHtml = formHtml + 
                "<option>" + this.gameLineup.xi[i].name + "</option>";
        }
        formHtml = formHtml + "</select></td>\
            <td><select id='FCGameNewPosition" + this.key + "'>"
        for (let i = 0; i < positionList().length; i++) {
            formHtml = formHtml + "<option>" + positionList()[i] + "</option>";
        }
        formHtml = formHtml + 
            "</select></td><td><input type='number' value=" + this.time + " id='FCGameNewTime" + this.key + "'></td></tr></table>\
            <button type='button' id='FCGameSub" + this.key + "'>Make Substitution</button>\
            <button type='button' id='FCGameCloseModal" + this.key + "'>Cancel</button>";
        openModal(formHtml);
        $("#FCGameSub" + this.key).click(function() {
            var playerOut = $("#FCGamePlayerOut" + this.key).val();
            var playerIn = $("#FCGamePlayerIn" + this.key).val();
            var newPosition = $("#FCGameNewPosition" + this.key).val();
            this.time = $("#FCGameNewTime" + this.key).val();
            if (playerIn == playerOut)
                this.gameLineup.xi.find(function(p) {
                    return p.name == playerIn;
                }).position = newPosition;
            else {
                this.playerOut(playerOut);
                this.playerIn(playerIn, newPosition);
            }
            this.updateRoster();
            this.updateScoreline();
            closeModal();
        }.bind(this));
        $("#FCGameCloseModal" + this.key).click(closeModal);
    }
    endGame() {
        this.time = 90;
        for (let i = 0; i < this.gameLineup.xi.length; i++)
            this.gameLineup.xi[i].end = this.time;
        var thesePlayers = this.gameLineup.xi.concat(this.gameLineup.out);
        var roster = this.lineups.getRoster();
        console.log(saveObject.getSettings());
        for (let i = 0; i < thesePlayers.length; i++) {
            var gamePlayer = thesePlayers[i];
            var playerGameStats = { stats: {}, deepStats: {} }
            for (key in saveObject.getSettings().stats) {
                if (saveObject.getSettings().stats[key].on && gamePlayer[key] > -1) {
                    playerGameStats.stats[key] = gamePlayer[key];
                }
            }
            var player = roster.find(function(p) {
                return p.name == gamePlayer.name;
            });
            console.log(playerGameStats);
        }
        console.log(this.fixture);
    }
}
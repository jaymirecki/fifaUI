class FCLineups {
    constructor(lineups, index) {
        this.lineups = lineups;
        this.index = index;
        this.saveGame = false;
        this.tableHeader = 
            "<tr><th colspan='2' id='currLineupName'>Current Lineup: [LINEUP NAME]</th></tr>\
            <tr><th>Position</th><th>Player</th></tr>";

        this.updateLineupWidget.bind(this);
        this.saveLineups.bind(this);
        this.getLineupTable.bind(this);
        this.editLineup.bind(this);
        this.lineupManagement.bind(this);
        // this.lineup
    }

    static getLineupWidget() {
        var lineupHtml = 
            "<div id='fifaPlayLineups'><table class='fifaTable'>" + 
            this.tableHeader;
        for (let i = 0; i < 11; i++)
            lineupHtml = lineupHtml + 
                "<tr class='fifaTable'><td>[POS]</td><td>[PLAYER]</td><td>[BENCH]</td></tr>";
        lineupHtml = lineupHtml + "</table></div>";
        return lineupHtml;
    };

    getLineup() {
        return this.lineups[this.index];
    }
    
    updateLineupWidget(saveGame) {
        var currLineup = this.lineups[this.index];
        $("#fifaPlayLineups").click(function() {
            this.lineupManagement();
        }.bind(this));
        if (!currLineup) {
            $("#fifaPlayLineups").html("<tr><th>No Lineups Created</th></tr><tr><td>Click here to create a lineup</td><tr>");
            return;
        }
        $("#fifaPlayLineups").html("");
        this.getLineupTable(this.index, false, "fifaPlayLineups");
        $("#currLineupName").html("Current Lineup: " + currLineup.name);
        this.saveGame = saveGame;
    }

    saveLineups() {
        saveObject.team[saveObject.settings.currentSelections.team].lineups = this.lineups;
        saveObject.settings.currentSelections.lineup = this.index;
    }

    getLineupTable(index, edit, domId) {
        var lineup = this.lineups[index];
        var lineupHtml = 
            "<table class='fifaTable'><tr><th colspan='3'>Lineup: " + lineup.name + "</th></tr>\
            <tr><th colspan='2'>Starting IX</th><th>Bench</th></tr>\
            <tr><th>Position</th><th>Player</th><th>Player</th></tr>";
        for (let i = 0; i < 11; i++) {
            lineupHtml = lineupHtml + 
                "<tr class='fifaTable'>\
                    <td>" + lineup.starters[i].position + "</td>\
                    <td>" + lineup.starters[i].player.name + "</td>"
            if (i < 8)
                lineupHtml = lineupHtml + "<td>" + lineup.bench[i].name + "</td></tr>";
            else
                lineupHtml = lineupHtml + "<td></td></tr>";
        }
        if (edit) {
            lineupHtml = lineupHtml + 
                "<tr class='fifaTable'><td></td><td>\
                <button type='button' id='FCLineupsEditCurrentLineup'>\
                    Edit Lineup</button></td><td>\
                <button type='button' id='FCLineupsNewFromCurrentLineup'>\
                    New Lineup from This Lineup</button></td></tr>";
        }
        $("#" + domId).append(lineupHtml);
        $("#FCLineupsEditCurrentLineup").click(function() {
            this.editLineup(lineup, index);
        }.bind(this));
        $("#FCLineupsNewFromCurrentLineup").click(function() {
            var newLineup = {};
            Object.assign(newLineup, lineup).name = "";
            this.editLineup(newLineup, this.lineups.length);
        }.bind(this));
    }

    editLineup(lineup, index) {
        sortRosterBy("position");
        var roster = 
            saveObject.team[saveObject.settings.currentSelections.team].roster;
        if (!lineup) {
            var lineup = { name: "", starters: [], bench: [] };
        }
    
        var html = 
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
            "<button type='button' id='FCLineupsEditSave'>\
                Save Lineup</button>\
            <button type='button' id='FCLineupsEditClose'>\
                Cancel</button>";
        openModal(html);
        $("#fifaPlayLineupEditError").hide();
        $("#FCLineupsEditClose").click(function() {
            this.lineupManagement();
        }.bind(this));

        $("#FCLineupsEditSave").click(function() {
            this.saveLineup(index);
        }.bind(this));
    }
    
    lineupManagement() {
        if (this.index >= this.lineups.length)
            this.index = this.lineups.length - 1;
        var currLineup = this.lineups[this.index];
    
        var html = 
            "<table class='fifaTable'><tr><td id='FCLineupsManagementGrid'></td>";
        if (!currLineup) {
            html = html + "<td></td></tr></table>\
            <button type='button' onclick='closeModal()'>Close</button>";
            openModal(html);
            return;
        }
        html = html + 
            "<td id='FCLineupsManagementTable'></td></tr></table>\
        <button type='button' id='fifaPlayFixturesCloseModal'>Close</button>";
        openModal(html);
        this.getLineupTable(this.index, true, "FCLineupsManagementTable");
        this.getLineupGrid("FCLineupsManagementGrid")
        $("#fifaPlayFixturesCloseModal").click(function() {
            if (this.saveGame)
                this.saveLineups();
            closeModal();
            this.updateLineupWidget();
        }.bind(this));
    }
    
    getLineupGrid(domId) {
        var html = "<table class='fifaTable'>";
        for (let i = 0; i <= this.lineups.length; i = i + 2) {
            if (i == this.lineups.length)
                html = html + "<tr><td class='bordered' id='FCLineupsNewLineup'>New Lineup</td><td></td></tr>";
            else
                html = html + "<tr><td class='bordered' id='FCLineupsGrid" + i + "'>" + this.lineups[i].name + "</td>";
            if (i + 1 == this.lineups.length)
                html = html + "<td class='bordered' id='FCLineupsNewLineup'>New Lineup</td></tr>";
            else if (i + 1 > this.lineups.length)
                continue;
            else
                html = html + "<td class='bordered' id='FCLineupsGrid" + (i + 1) + "'>" + this.lineups[i + 1].name + "</td></tr>";
        }
        html = html + "</table>";
        $("#" + domId).append(html);
        $("#FCLineupsNewLineup").click(function() {
            this.editLineup(false, this.lineups.length);
        }.bind(this));
        for (let i = 0; i < this.lineups.length; i++) {
            $("#FCLineupsGrid" + i).click(function() {
                this.index = i;
                this.lineupManagement();
            }.bind(this));
        }
    }
    
    saveLineup(index) {
        var lineup = new Object();
        lineup.name = $("#lineupName").val();
        lineup.starters = this.getStarters();
        lineup.bench = this.getBench();
        
        if ($("#fifaPlayLineupEditError").is(":hidden")) {
            lineup.starters.sort(function(a, b) {
                return positionList().indexOf(a.position) - positionList().indexOf(b.position);
            });
            lineup.bench.sort(function(a, b) {
                return positionList().indexOf(a.position[0]) - positionList().indexOf(b.position[0]);
            });
            this.lineups[index] = lineup;
            this.index = index;
        }
        this.lineupManagement();
    }
    
    getStarters() {
        var playerTable = document.getElementById("lineupEditTable");
        var playerRows = playerTable.children[0].children;
        var players = [];
        for (let i = 3; i < playerRows.length; i++)
            players[i - 3] = this.getStarter(playerRows[i]);
        return players;
    }
    
    getBench() {
        var playerTable = document.getElementById("lineupEditTable");
        var playerRows = playerTable.children[0].children;
        var players = [];
        for (let i = 3; i < playerRows.length - 3; i++)
            players[i - 3] = this.getBenchPlayer(playerRows[i]);
        return players;
    }
    
    getStarter(playerRow) {
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
    
    getBenchPlayer(playerRow) {
        var roster = saveObject.team[saveObject.settings.currentSelections.team].roster;
        var player;
        var name = playerRow.children[2].children[0].value;
        if (name == "---" || $("#lineupName").val() == "")
            $("#fifaPlayLineupEditError").show();
        else
            player = findPlayerInRoster(name.split(":")[0], roster);
        return player;
    }
}
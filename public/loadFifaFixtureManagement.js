function showFullFixtures() {
    var fixtures = saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].fixtures;
    var html = 
        "<table class='fifaTable'><tr class='fifaTable'><th colspan='4'></th></tr>";
    for (let i = 0; i < fixtures.length; i++) {
        var f = fixtures[i]
        html = html + 
            "<tr class='fifaTable' onclick='editFixtureNumber(" + i + ")'><td>" + new Date(f.date).toLocaleDateString("default", { timeZone: "UTC" }) + "</td>";
        if (f.score)
            html = html + 
                "<td>" + f.away + "<br>" + f.score.away + "</td><td>vs.</td>\
                <td>" + f.home + "<br>" + f.score.home + "</td></tr>";
        else
            html = html + 
            "<td>" + f.away + "</td><td>vs.</td>\
            <td>" + f.home + "</td></tr>";
    }
    html = html + "</table><button type='button' onclick='closeModal()'>Close</button>";
    openModal(html);
}

function addFixtures(user) {
    var divisions = 
        saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].divisions
    var teams = [];
    for (key in divisions)
        teams = teams.concat(divisions[key].teams);
    teams.sort(function(a, b) {
        var a0 = a.charAt(0);
        var b0 = b.charAt(0);
        if (a0 < b0)
            return -1;
        else if (a0 > b0)
            return 1;
        else
            return 0;
    });
    var html = 
        "<button type='button' onclick='closeModal()'>Done</button>\
        <form action='javascript:void(0)' onsubmit='addThisFixture(\"" + user + "\")'>\
        <table><tr>\
        <td>Date<input type='date' value='" + saveObject.date.toISOString().substring(0, 10) + "' id='fixtureDate' autofocus>\
        <td>Away Team<br><select id='awayTeam' required>\
            <option value='' disabled selected>---</option>";
    for (let i = 0; i < teams.length; i++)
        html = html + "<option value='" + teams[i] + "'>"+ teams[i] + "</option>"
    html = html + "</select></td>\
    <td>Home Team<br><select id='homeTeam'required>\
    <option value='' disabled selected>---</option>";
    for (let i = 0; i < teams.length; i++)
        html = html + "<option value='" + teams[i] + "'>"+ teams[i] + "</option>";
    html = html + "</select></td></tr></table>\
        <input type='submit' value='Add Fixture'>\
        </form>";
    openModal(html);
}

function addThisFixture(user) {
    var newFixture = new Object();
    newFixture.date = new Date($("#fixtureDate").val());
    newFixture.away = $("#awayTeam").val();
    newFixture.home = $("#homeTeam").val();
    saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].fixtures.push(newFixture);
    fixtures(user);
}
function editFixtureNumber(i) {
    var f = saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].fixtures[i];

    var divisions = 
        saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].divisions;
    var teams = [];
    for (key in divisions)
        teams = teams.concat(divisions[key].teams);
    teams.sort(function(a, b) {
        var a0 = a.charAt(0);
        var b0 = b.charAt(0);
        if (a0 < b0)
            return -1;
        else if (a0 > b0)
            return 1;
        else
            return 0;
    });

    var html =
        "<button type='button' onclick='showFullFixtures()'>Cancel</button>\
        <form action='javascript:void(0)' onsubmit='updateThisFixture(" + i + ")'>\
        <table><tr><th>Date</th><th>Away Team</th><th>Home Team</th></tr><tr>\
        <td><input type='date' value='" + new Date(f.date).toISOString().substring(0, 10) + "' id='fixtureDate' focus>\
        <td><select id='awayTeam' required>";
    for (let i = 0; i < teams.length; i++) {
        if (teams[i] == f.away)
            html = html + "<option value='" + teams[i] + "' selected>"+ teams[i] + "</option>";
        else
            html = html + "<option value='" + teams[i] + "'>"+ teams[i] + "</option>";
    }
    html = html + "</select></td>\
    <td><select id='homeTeam'required>";
    for (let i = 0; i < teams.length; i++) {
        if (teams[i] == f.home)
            html = html + "<option value='" + teams[i] + "' selected>"+ teams[i] + "</option>";
        else
            html = html + "<option value='" + teams[i] + "'>"+ teams[i] + "</option>";
    }
    if (f.score)
        html = html + "</select></td></tr>\
            <tr><td></td><td><input type='number' id='awayScore' value='" + f.score.away + "'></td>\
            <td><input type='number' id='homeScore' value='" + f.score.home + "'></td></tr>";
    html = html + "</table><input type='submit' value='Update'></form>";
    openModal(html);
    // console.log(html);
}

function updateThisFixture(i) {
    var f = saveObject.team[saveObject.settings.currentSelections.team].league.competitions[saveObject.settings.currentSelections.competition].fixtures[i];

    f.date = new Date($("#fixtureDate").val());
    f.away = $("#awayTeam").val();
    f.home = $("#homeTeam").val();
    if (f.score) {
        f.score.away = $("#awayScore").val();
        f.score.home = $("#homeScore").val();
        if (f.score.away > f.score.home)
            f.score.result = "away";
        else if (f.score.away < f.score.home)
            f.score.result = "home";
        else
            f.score.result = "draw";
    }
    table();
    power();
    showFullFixtures();
}

function completeFixtures(newDate, user) {
    newDate = new Date(newDate);
    var competitions =
        saveObject.team[saveObject.settings.currentSelections.team].league.competitions;
    for (key in competitions) {
        var fixtures = competitions[key].fixtures;
        for (let i = 0; i < fixtures.length; i++) {
            var f = fixtures[i];
            if (!f.score && new Date(f.date) < newDate) {
                var html = 
                    "Please enter the score for this game:\
                    <table><tr><td colspan='3'>"+ key + "</td></tr>\
                    <tr><td>" + fixtures[i].away + "<input type='number' id='away'></td>\
                    <td>vs.</td><td>" + fixtures[i].home + "<input type='number' id='home'></td></tr></table>\
                    <button type='button' onclick='completeFixtures(\"" + newDate + "\", \"" + user + "\")'>Submit Score</button>";
                if ($("#away").val() && $("#home").val()) {
                    f.score = { away: $("#away").val(), home: $("#home").val() };
                    var awayResult, homeResult;
                    if (f.score.away > f.score.home) {
                        awayResult = "w";
                        homeResult = "l";
                        f.score.result = "away";
                    } else if (f.score.away < f.score.home) {
                        awayResult = "l";
                        homeResult = "w";
                        f.score.result = "home";
                    } else {
                        awayResult = homeResult = "d";
                        f.score.result = "draw";
                    }
                    for (d in competitions[key].divisions) {
                        var division = competitions[key].divisions[d];
                        if (division.teams.indexOf(f.away) > -1)
                            for (let i = 0; i < division.table.length; i++)
                                if (division.table[i].t == f.away)
                                    division.table[i][awayResult]++;
                        if (division.teams.indexOf(f.home) > -1)
                            for (let i = 0; i < division.table.length; i++)
                                if (division.table[i].t == f.home)
                                    division.table[i][homeResult]++;
                    }
                    $("#away, #home").val("");
                    closeModal();
                    completeFixtures(newDate, user);
                } else
                    openModal(html);
                return;
            }
        }
    }
    saveObject.date = newDate;
    insertSaveInfo(user);
}
var fifaPlaySave;
var fifaPlayRoster;

async function loadFifaContent() {
    $("#fifaContent").html('<div id="fifaPlayHeader"></div><div id="fifaPlayContent"></div>');
    if (isMobile())
        addStyle("/fifaSiteMobile.css");
    addHeaderTemplate();
    addContentTemplate();
    addRosterTemplate();
    loadScripts();
}
function loadScripts() {
    loadScript('FCSave.js', function() {
        getSave();
        loadScript('FCRoster.js', function() {
            fifaPlayRoster = new FCRoster();
        });
    });
}

function addHeaderTemplate() {
    let header = '<select id="fifaPlayTeam" class="fifaPlayHeader">\
        <option>---</option>\
    </select><br>\
    <select id="fifaPlayCompetition" class="fifaPlayHeader">\
        <option>---</option>\
    </select><br>\
    <select id="fifaPlayDivision" class="fifaPlayHeader">\
        <option>---</option>\
    </select><br>';
    $("#fifaPlayHeader").html(header);
    $("#fifaPlayTeam").change(function() {
        fifaPlaySave.changeTeam($("#fifaPlayTeam").val());
        updateHeader();
    });
    $("#fifaPlayCompetition").change(function() {
        fifaPlaySave.changeCompetition($("#fifaPlayCompetition").val());
        updateHeader();
    });
    $("#fifaPlayDivision").change(function() {
        fifaPlaySave.changeDivision($("#fifaPlayDivision").val());
        updateHeader();
    });
}

function addContentTemplate() {
    let content = 
        '<button id="fifaPlayRosterButton" class="fifaPlayContent disable">Roster</button><br>\
        <button id="fifaPlayTablesButton" class="fifaPlayContent disable">Tables</button><br>\
        <button id="fifaPlayFixturesButton" class="fifaPlayContent disable">Fixtures</button><br>';
    $("#fifaPlayContent").html(content);
    $("#fifaPlayRosterButton").click(function() {
        addRosterTemplate();
        if (fifaPlayRoster.getRoster(fifaPlaySave.team))
            updateRoster();
        else
            getRoster();
    });
}

function addRosterTemplate() {
    let roster = 
        '<button id="fifaPlayBack" class="fifaPlayContentTab disable">Back</button>\
        <button id="fifaPlayRosterButton" class="fifaPlayContentTab disable">Roster</button>\
        <button id="fifaPlayLineupButton" class="fifaPlayContentTab disable">Lineups</button>\
        <table id="fifaPlayRosterTable" class="fifaPlayContent">\
            <tr><th>Name</th><th>Position</th><th>Age</th><th>Ovr</th></tr>';
        for (let i = 0; i < 18; i++) {
            roster = roster + 
                '<tr><td>---</td><td>---</td><td>---</td><td>---</td>'
        }
        roster = roster + '</table>';
    $("#fifaPlayContent").html(roster);
    $(".fifaPlayContentTab").css("width", (1 / 3 * 100).toString() + "%");
    $("#fifaPlayBack").click(function() {
        addContentTemplate();
    })
}

function getSave() {
    let gameId = 
        new URLSearchParams(window.location.href.split("?")[1]).get('g');

    teams = new XMLHttpRequest();
    let getString = "/playerteams?id=" + gameId;
    teams.open("GET", getString);
    teams.onreadystatechange = function() {
        if (teams.readyState != 4)
            return;
        let result = JSON.parse(teams.responseText);
        fifaPlaySave.teams = result;
        updateHeader();
        getRoster();
    }

    getString = "/save?id=" + gameId;
    let request = new XMLHttpRequest();
    request.open("GET", getString);
    request.onreadystatechange = function() {
        if (request.readyState != 4)
            return;
        let result = JSON.parse(request.responseText);
        fifaPlaySave = new FCSave(result);
        teams.send();
    };
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send();
}

function getRoster() {
    let gameId = 
        new URLSearchParams(window.location.href.split("?")[1]).get('g');

    players = new XMLHttpRequest();
    let getString = "/players?game=" + gameId + "&team=" + fifaPlaySave.team;
    players.open("GET", getString);
    players.onreadystatechange = function() {
        if (players.readyState != 4)
            return;
        let result = JSON.parse(players.responseText);
        console.log(result);
        fifaPlayRoster.addRoster(fifaPlaySave.team, result);
        updateRoster();
    }
    players.send();
}

function updateHeader() {
    if (!fifaPlaySave) {
        getSave();
        return;
    }
    let teams = "";
    for (let i in fifaPlaySave.teams) {
        teams = teams + '<option';
        if (i == fifaPlaySave.team)
            teams = teams + " selected>";
        else teams = teams + ">";
        teams = teams + i + "</option>";
    }
    let comps = '';
    for (let i in fifaPlaySave.competitions()) {
        comps = comps + '<option';
        if (i == fifaPlaySave.competition)
            comps = comps + ' selected>';
        else comps = comps + '>';
        comps = comps + i + '</option>';
    }
    let divs = '';
    for (let i in fifaPlaySave.divisions()) {
        divs = divs + '<option';
        if (fifaPlaySave.divisions()[i] == fifaPlaySave.division)
            divs = divs + ' selected>';
        else divs = divs + '>';
        divs = divs + fifaPlaySave.divisions()[i] + '</option>';
    }
    $("#fifaPlayTeam").html(teams);
    $("#fifaPlayCompetition").html(comps);
    $("#fifaPlayDivision").html(divs);
}

function updateRoster() {
    let roster = fifaPlayRoster.getRoster(fifaPlaySave.team);
    let content = "<tr><th>Name</th><th>Position</th><th>Age</th><th>Ovr</th></tr>";
    for (let i in roster) {
        let p = roster[i];
        p.age = new Date(fifaPlaySave.date - p.age).getUTCFullYear() - 1970
        content = content + 
            '<tr id="' + p.id + '" class="fifaPlayTable"><td>' + p.firstName + ' ' + p.lastName + '</td><td>' + p.position + '</td><td>' + p.age + '</td><td>' + p.ovr + '</td></tr>';
    }
    $("#fifaPlayRosterTable").html(content);
}
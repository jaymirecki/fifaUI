var fifaPlaySave;
var fifaPlayRoster;

async function loadFifaContent() {
    $("#fifaContent").html('<div id="fifaPlayHeader"></div><div id="fifaPlayContent"></div>');
    if (isMobile())
        addStyle("/fifaSiteMobile.css");
    addHeaderTemplate();
    addContentTemplate();
    // addRosterTemplate();
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
        <button id="fifaPlayRosterButton" class="fifaPlayContentTab fifaPlayContentTabSelected" disable">Roster</button>\
        <button id="fifaPlayLineupButton" class="fifaPlayContentTab disable">Lineups</button>\
        <table id="fifaPlayRosterTable" class="fifaPlayContent">\
            <tr class="fifaPlayContent"><th>Name</th><th>Position</th><th>Age</th><th>Ovr</th></tr>';
        for (let i = 0; i < 18; i++) {
            roster = roster + 
                '<tr class="fifaPlayContent"><td>---</td><td>---</td><td>---</td><td>---</td>'
        }
        roster = roster + '</table>';
    $("#fifaPlayContent").html(roster);
    $(".fifaPlayContentTab").css("width", (1 / 3 * 100).toString() + "%");
    $("#fifaPlayBack").click(function() {
        addContentTemplate();
    });
    $("#fifaPlayLineupButton").click(function() {
        addLineupTemplate();
    });
}

function addLineupTemplate() {
    let lineups = 
        '<button id="fifaPlayBack" class="fifaPlayContentTab disable">Back</button>\
        <button id="fifaPlayRosterButton" class="fifaPlayContentTab" disable">Roster</button>\
        <button id="fifaPlayLineupButton" class="fifaPlayContentTab fifaPlayContentTabSelected disable">Lineups</button>\
        <table id="fifaPlayLineupTable" class="fifaPlayContent"></table>';
    $("#fifaPlayContent").html(lineups);
    $(".fifaPlayLineupSelect").css('height', $(".fifaPlayLineupSelect").css('width'));
    $(".fifaPlayContentTab").css("width", (1 / 3 * 100).toString() + "%");
    $("#fifaPlayBack").click(function() {
        addContentTemplate();
    });
    $("#fifaPlayRosterButton").click(function() {
        addRosterTemplate();
        updateRoster();
    });
    // $('.fifaPlayLineupSelect').click(function() {
    //     let name = $(this).attr('id');
    //     if ($(this).attr('id') == 'jsdflsaldkhgsalonv') {
    //         console.log("new lineup");
    //         name = fifaPlayRoster.newLineup(fifaPlaySave.team);
    //     } else
    //         console.log("not a new lineup")
    //     console.log(name);
    //     editLineup(name);
    // });
    updateLineups();
}

function editLineup(name) {
    let lineup = fifaPlayRoster.getLineup(fifaPlaySave.team, name);
    editLineupStatic(name, lineup);
}

function editLineupStatic(name, lineup) {
    console.log(lineup);
    let table = 
        '<tr><th><input type="text" value="' + name + '"></th>\
            <th><button id="fifaPlayLineupSave" class="fifaPlayContent">Save</button></tr>\
        <tr><th colspan="2">Starters</th></tr>\
        <tr><th>Player</th><th>Position</th></tr>';
    for (let i in lineup.starters) {
        let s = lineup.starters[i];
        let replacements = fifaPlayRoster.getLineupReplacementsFor(lineup, s.id);
        table = table + 
            '<tr><td><select class="fifaPlayLineupName" id="name' + s.id + '"><option value="' + s.id + '">' + s.name + '</option>';
        for (let j in replacements) {
            let r = replacements[j];
            table = table + '<option value="' + r.id + '">' + r.name + '</option>'
        }
        table = table + '</td><td><select id="pos' + s.id + '"><option>' + s.playedPosition + '</option>';
        let positions = fifaPlayRoster.positions;
        for (let j in positions) {
            let p = positions[j];
            if (p != s.playedPosition)
                table = table + '<option>' + p + '</option>';
        }
        '</select></td></tr>';
    }
    table = table + 
        '<tr><th colspan="2">Bench</th></tr>\
        <tr><th>Player</th><th>Position</th></tr>';
    for (let i in lineup.bench) {
        let b = lineup.bench[i]
        table = table + 
            '<tr><td>' + lineup.bench[i].name + '</td><td>' + lineup.bench[i].position + '</td></tr>';
    }
    $('#fifaPlayLineupTable').html(table);
    $('.fifaPlayLineupName').change(function() {
        let current = $(this).attr('id');
        current = current.substring(4, current.length);
        let bench = $(this).val();
        fifaPlayRoster.switchPlayerToBenchStatic(lineup, current, bench);
        editLineupStatic(name, lineup);
    });
    $('#fifaPlayLineupSave').click(function() {
        console.log("Save");
        fifaPlayRoster.saveLineup(fifaPlaySave.team, name, lineup);
        updateLineups();
    });
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
    let content = '<tr class="fifaPlayContent"><th>Name</th><th>Position</th><th>Age</th><th>Ovr</th></tr>';
    for (let i in roster) {
        let p = roster[i];
        p.age = new Date(fifaPlaySave.date - p.age).getUTCFullYear() - 1970
        content = content + 
            '<tr id="' + p.id + '" class="fifaPlayContent"><td>' + p.firstName + ' ' + p.lastName + '</td><td>' + p.position + '</td><td>' + p.age + '</td><td>' + p.ovr + '</td></tr>';
    }
    $("#fifaPlayRosterTable").html(content);
}

function updateLineups() {
    let table = '';
    let count = 0;
    for (let i in fifaPlayRoster.lineups[fifaPlaySave.team]) {
        console.log(i);
        if (count % 2 == 0)
            table = table + "<tr>";
        table = table + 
            '<td class="fifaPlayLineupSelect" id="' + i + '">' + i + '</td>';
        if (count++ % 2 == 1)
            table = table + '</tr>';
    }
    if (count % 2 == 0)
        table = table + "<tr>";
    table = table + 
        '<td class="fifaPlayLineupSelect" id="jsdflsaldkhgsalonv">New Lineup</td><td></td><td></td>';
    if (count++ % 2 == 1)
        table = table + '</tr>';
    table = table + '</table>';
    $("#fifaPlayLineupTable").html(table);
    let padding = $('.fifaPlayLineupSelect').css('width');
    padding = padding.substring(0, padding.length - 2);
    padding = parseInt(padding) / 2 - 5;
    padding = padding + 'px';
    $(".fifaPlayLineupSelect").css('padding-top', padding);
    $(".fifaPlayLineupSelect").css('padding-bottom', padding);
    $("#fifaPlayBack").click(function() {
        addContentTemplate();
    });
    $('.fifaPlayLineupSelect').click(function() {
        let name = $(this).attr('id');
        if ($(this).attr('id') == 'jsdflsaldkhgsalonv') {
            name = fifaPlayRoster.newLineup(fifaPlaySave.team);
            editLineupStatic(name, fifaPlayRoster.getFreshLineup(fifaPlaySave.team, 7));
        } else
            editLineup(name);
    });
}
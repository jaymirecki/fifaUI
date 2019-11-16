var fifaPlaySave;

async function loadFifaContent() {
    $("#fifaContent").html('<div id="fifaPlayHeader"></div><div id="fifaPlayContent"></div>');
    if (isMobile())
        addStyle("/fifaSiteMobile.css");
    await addHeaderTemplate();
    loadScripts();
}
function loadScripts() {
    loadScript('FCSave.js', function() {
        getSave();
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
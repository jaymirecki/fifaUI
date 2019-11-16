function loadMireckiContent() {
    var gameId = new URLSearchParams(window.location.href.split("?")[1]).get('g');
    let players = false;
    let date = false;

    var playerRequest = new XMLHttpRequest();
    var getString = "/players?game=" + gameId;
    playerRequest.open("GET", getString, true);
    playerRequest.onreadystatechange = function () {
        if (playerRequest.readyState != 4)
            return;
        // console.log(playerRequest.responseText);
        var players = JSON.parse(playerRequest.responseText);
        console.log(players);
        buildTable(players, date);
    };
    
    var dateRequest = new XMLHttpRequest();
    var getString = "/save?id=" + gameId;
    dateRequest.open("GET", getString, true);
    dateRequest.onreadystatechange = function () {
        if (dateRequest.readyState != 4)
            return;
        console.log(dateRequest.responseText);
        date = new Date(JSON.parse(dateRequest.responseText).save.date);
        console.log(date);
        playerRequest.send();
    };
    dateRequest.send();
    // while (!players || !date)
    //     continue;
    // buildTable(players, date);
}
var path = window.location.pathname.split("/");
console.log(window.location.href.split("?")[1]);
var gameId = new URLSearchParams(window.location.href.split("?")[1]).get('g');
console.log(gameId);

function buildTable(players, date) {
    console.log("woo");
    console.log(date);
    let playersForm = '<form id="playersForm"><table><tr><th>First Name</th><th>Last Name</th><th>OVR</th><th>Age</th><th>Positions</th></tr>';

    for (let i in players) {
        let p = players[i];
        p.positions = "";
        let positions = ["gk", "sw", "rwb", "rb", "cb", "lb", "lwb", "cdm", "rm", "cm", "lm", "cam", "cf", "rw", "st", "lw"];
        for (let j = 1; j < 5; j++) {
            for (let i in positions) {
                if (p[positions[i]] == j)
                p.positions = p.positions + positions[i].toUpperCase() + ",";
            }
        }
        p.positions = p.positions.substring(0, p.positions.length - 1);
        playersForm = playersForm +
        '<tr><td><input type="text" id="' + i + 'firstName" value="' + p.firstName + '"></td><td><input type="text" id="' + i + 'lastName" value="' + p.lastName + '"></td><td><input type="number" id="' + i + 'ovr" value="' + p.ovr + '"></td><td><input type="number" id="' + i + 'age" value="' + (date.getYear() - new Date(p.age).getYear()) + '"></td><td><input type="text" id="' + i + 'positions" value="' + p.positions + '"></td></tr>';
    }

    for (let i = players.length; i < 18; i++) {
        playersForm = playersForm + 
            '<tr><td><input type="text" id="' + i + 'firstName"></td><td><input type="text" id="' + i + 'lastName"></td><td><input type="number" id="' + i + 'ovr"></td><td><input type="number" id="' + i + 'age"></td><td><input type="text" id="' + i + 'positions"></td></tr>';
    }
    playersForm = playersForm + "</table></form>";

    $("#mireckiContent").html(playersForm);
}

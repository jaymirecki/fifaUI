function loadMireckiContent() {
    buildTable([]);
}
var path = window.location.pathname.split("/");
console.log(window.location.href.split("?")[1]);
var gameId = new URLSearchParams(window.location.href.split("?")[1]).get('g');
console.log(gameId);

function buildTable(players) {
    let playersForm = '<form id="playersForm"><table><tr><th>First Name</th><th>Last Name</th><th>OVR</th><th>Age</th><th>Positions</th></tr>';

    for (let i in players) {
        let p = players[i];
        playersForm = playersForm +
        '<tr><td><input type="text" id="' + i + 'firstName" value="' + p.firstName + '"></td><td><input type="text" id="' + i + 'lastName" value="' + p.lastName + '"></td><td><input type="number" id="' + i + 'ovr" value="' + p.ovr + '"></td><td><input type="number" id="' + i + 'age" value="' + p.age + '"></td><td><input type="text" id="' + i + 'positions" value="' + p.positions + '"></td></tr>';
    }

    for (let i = players.length; i < 18; i++) {
        playersForm = playersForm + 
            '<tr><td><input type="text" id="' + i + 'firstName"></td><td><input type="text" id="' + i + 'lastName"></td><td><input type="number" id="' + i + 'ovr"></td><td><input type="number" id="' + i + 'age"></td><td><input type="text" id="' + i + 'positions"></td></tr>';
    }
    playersForm = playersForm + "</table></form>";

    $("#mireckiContent").html(playersForm);
}

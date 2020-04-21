var fifaSave;
var fifaFixtures;

function loadObjects(game) {
    loadScript('FCSave.js', () => {
        fifaSave = new FCSave(game); loadSelections();
    });
    // $('#fifaPlayHome').hide();
    // $('#fifaPlayTables').hide();
    $('#fifaPlayFixtures').show();

    $('.fifaBack').click(() => {
        $('#fifaPlayHome').show();
        $('#fifaPlayTables').hide();
        $('#fifaPlayFixtures').hide();
        loadSelections();
    });
    $('#fifaPlayAddFixture').unbind('click');

    $('#fifaTablesButton').click(() => {
        $('#fifaPlayHome').hide();
        $('#fifaPlayTables').show();
        $('#fifaPlayFixtures').hide();
    });
    $('#fifaStandingsButton').click(selectStandings);
    $('#fifaPowerButton').click(selectPower);

    $('#fifaFixturesButton').click(() => {
        $('#fifaPlayHome').hide();
        $('#fifaPlayTables').hide();
        $('#fifaPlayFixtures').show();
    });
    $('#fifaMyFixturesButton').click(selectMyFixtures);
    $('#fifaCompFixturesButton').click(selectCompFixtures);
    $('#fifaPlayAddFixture').click(() => location.href = 'add_fixture?g=' + fifaGame);

    fifaGetRequest('/fixtures?game=' + fifaGame, loadFixtures);
}

function loadSelections() {
    loadTeams();
    loadCompetitions();
    loadDivisions();
    $('#fifaTeam').change(changeTeam);
    $('#fifaCompetition').change(changeCompetition);
    $('#fifaDivision').change(changeDivision);

    $('#fifaManagerName').html(fifaSave.name);
    $('#fifaName').html(fifaSave.name);
    $('#fifaDate').html(fifaSave.date.toDateString());
    $('#fifaSave').click(fifaSave.save);
}

function loadTeams() {
    loadDropdown('fifaTeam', 
                 fifaSave.teams, 
                 'jid', 
                 'name', 
                 fifaSave.team);
}
function changeTeam() {
    fifaSave.team = $('#fifaTeam').val();
    loadCompetitions();
}

function loadCompetitions() {
    loadDropdown('fifaCompetition', 
                 fifaSave.competitions(), 
                 'name', 
                 'name', 
                 fifaSave.competition);
}
function changeCompetition() {
    fifaSave.competition = $('#fifaCompetition').val();
    loadDivisions();
}

function loadDivisions() {
    if (Object.keys(fifaSave.divisions()).length == 1)
        $('#fifaDivision').hide();
    else {
        $('#fifaDivision').show()
        loadDropdown('fifaDivision', 
                    fifaSave.divisions(), 
                    'name', 
                    'name', 
                    fifaSave.division);
    }
}
function changeDivision() {
    fifaSave.division = $('#fifaDivision').val();
}

function loadDropdown(id, values, ids, names, selected) {
    $('#' + id).html('');
    for (let i in values) {
        let option = document.createElement('option');
        option.value = values[i][ids];
        option.innerHTML = values[i][names];
        option.className = 'fifaHeader';
        $('#' + id).append(option);
    }
    $('#' + id).val(selected);
}

function selectStandings() {
    $('#fifaStandingsButton').addClass('fifaSelected');
    $('#fifaPowerButton').removeClass('fifaSelected');
    $('#fifaDivision').show();
}

function selectPower() {
    $('#fifaStandingsButton').removeClass('fifaSelected');
    $('#fifaPowerButton').addClass('fifaSelected');
    $('#fifaDivision').hide();
}

function selectMyFixtures() {
    $('#fifaMyFixturesButton').addClass('fifaSelected');
    $('#fifaCompFixturesButton').removeClass('fifaSelected');
}

function selectCompFixtures() {
    $('#fifaMyFixturesButton').removeClass('fifaSelected');
    $('#fifaCompFixturesButton').addClass('fifaSelected');
}

function loadFixtures(fixtures) {
    console.log(fixtures);
    var fixTable = $('#fifaFixtures');
    var fixHeader = fixTable.find('tr')[0];
    fixTable.html('');
    fixTable.append(fixHeader);
    for (let i in fixtures['2019'][fifaSave.competition]) {
        let fix = fixtures['2019'][fifaSave.competition][i];
        console.log(fix);
        let fixRow = document.createElement('tr');
        fixRow.className = 'fifa';
        let homeCell = document.createElement('td');
        homeCell.innerHTML = fix.homeTeam;
        console.log(homeCell);
        let dateCell = document.createElement('td');
        dateCell.innerText = new Date(fix.date).toLocaleDateString();
        let awayCell = document.createElement('td');
        awayCell.innerText = fix.awayTeam;

        fixRow.appendChild(homeCell);
        fixRow.appendChild(dateCell);
        fixRow.appendChild(awayCell);
        console.log(fixRow);
        fixTable.append(fixRow);
    }
}

fifaGetRequest("/game?game=" + fifaGame, loadObjects);
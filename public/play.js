var fifaSave;

function loadObjects(game) {
    loadScript('FCSave.js', () => {
        fifaSave = new FCSave(game); loadSelections();
    });
}

function loadSelections() {
    loadTeams();
    loadCompetitions();
    loadDivisions();
    $('#fifaTeam').change(changeTeam);
    $('#fifaCompetition').change(changeCompetition);
    $('#fifaDivision').change(changeDivision);
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
        // console.log(option);
        $('#' + id).append(option);
    }
    $('#' + id).val(selected);
}

fifaGetRequest("/game?game=" + fifaGame, loadObjects);
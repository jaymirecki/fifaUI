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
}

function loadTeams() {
    loadDropdown('fifaTeam', 
                 fifaSave.teams, 
                 'jid', 
                 'name', 
                 fifaSave.team);
}

function loadCompetitions() {
    loadDropdown('fifaCompetition', 
                 fifaSave.competitions(), 
                 'name', 
                 'name', 
                 fifaSave.competition);
}

function loadDivisions() {
    loadDropdown('fifaDivision', 
                 fifaSave.divisions(), 
                 'name', 
                 'name', 
                 fifaSave.division);
}

function loadDropdown(id, values, ids, names, selected) {
    $('#' + id).html('');
    for (let i in values) {
        let option = document.createElement('option');
        option.value = values[i][ids];
        option.innerHTML = values[i][names];
        console.log(option);
        $('#' + id).append(option);
    }
    $('#' + id).val(selected);
}

fifaGetRequest("/game?game=" + fifaGame, loadObjects);
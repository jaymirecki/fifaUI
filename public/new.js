function loadTeamSelection(teamSelection) {
    $('#fifaFormSubmit').click(createGame);
    var games = $('#fifaGameSelect');
    games.change(function() { updateLeagues(teamSelection)(this.value)});
    games.html('');
    for (let g in teamSelection) {
        var game = document.createElement('option');
        game.innerText = g;
        games.append(game);
        updateLeagues(teamSelection)(g);
    }
}

function updateLeagues(teamSelection) {
    return function(game) {
        var leagues = $('#fifaLeagueSelect');
        leagues.html('');
        for (let l in teamSelection[game]) {
            var league = document.createElement('option');
            league.innerText = l;
            leagues.append(league);
            updateTeams(teamSelection)(game, l);
        }
        leagues.change(function() { updateTeams(teamSelection)(game, this.value)});
    };
}

function updateTeams(teamSelection) {
    return function(game, league) {
        var teams = $('#fifaTeamSelect');
        teams.html('');
        var availableTeams = teamSelection[game][league].teams;
        for (let t in availableTeams) {
            var team = document.createElement('option');
            team.innerText = availableTeams[t].name;
            teams.append(team);
        }
    }
}

function createGame() {
    var game = {
        game: $('#fifaGameSelect').val(),
        team: $('#fifaTeamSelect').val(),
        user: fifaUser,
        name: $('#fifaSaveName').val(),
        managerName: $('#fifaManName').val()
    };
    console.log(game);
    fifaPostRequest('/new_save', game, x => location.href = '/play?g=' + x.id);
}

fifaGetRequest("/team_selection", loadTeamSelection)
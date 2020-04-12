function loadTeamSelection(teamSelection) {
    var games = $('#gameSelect');
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
        var leagues = $('#leagueSelect');
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
        var teams = $('#teamSelect');
        teams.html('');
        var availableTeams = teamSelection[game][league].teams;
        for (let t in availableTeams) {
            var team = document.createElement('option');
            team.innerText = availableTeams[t].name;
            teams.append(team);
        }
    }
}

fifaGetRequest("/team_selection", loadTeamSelection)
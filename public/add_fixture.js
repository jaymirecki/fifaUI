var fifaFixtures = [];

function updateForm(teams) {
    updateSeasons(teams);
    $('#fifaSeason').change(() => updateComps(teams[$('#fifaSeason').val()]));
    $('#fifaComp').change(() => updateHomeOne(teams[$('#fifaSeason').val()][$('#fifaComp').val()]));
    $('#fifaHome').change(() => updateAwayOne(teams[$('#fifaSeason').val()][$('#fifaComp').val()]));
    $('#fifaAway').change(() => updateHomeOne(teams[$('#fifaSeason').val()][$('#fifaComp').val()]));
    $('#fifaAddAnother').click(() => createFixture(teams, false));
    $('#fifaFinish').click(() => createFixture(teams, true));

}

function updateSeasons(seasons) {
    $('#fifaSeason').html('');
    for (let i in seasons) {
        let option = document.createElement('option');
        option.value = i;
        option.innerHTML = i;
        $('#fifaSeason').append(option);
    }
    updateComps(seasons[$('#fifaSeason').val()])
}

function updateComps(comps) {
    $('#fifaComp').html('');
    for (let i in comps) {
        let option = document.createElement('option');
        option.value = i;
        option.innerHTML = i;
        $('#fifaComp').append(option);
    }
    updateHomeOne(comps[$('#fifaComp').val()])
}

function updateHomeOne(teams) {
    teams.sort(function(a, b) { if (a.name < b.name) return -1;
                                else if (a.name > b.name) return 1;
                                else return 0; });
    updateTeams(teams, 'fifaHome', 'fifaAway', updateAwayTwo);
}

function updateAwayOne(teams) {
    teams.sort(function(a, b) { if (a.name < b.name) return -1;
                                else if (a.name > b.name) return 1;
                                else return 0; });
    updateTeams(teams, 'fifaAway', 'fifaHome', updateHomeTwo);
}

function updateHomeTwo(teams) {
    updateTeams(teams, 'fifaHome', 'fifaAway', updateAwayThree);
}

function updateAwayTwo(teams) {
    updateTeams(teams, 'fifaAway', 'fifaHome', updateHomeThree);
}

function updateHomeThree(teams) {
    updateTeams(teams, 'fifaHome', 'fifaAway', () => 1);
}

function updateAwayThree(teams) {
    updateTeams(teams, 'fifaAway', 'fifaHome', () => 1);
}

function updateTeams(teams, id, counterId, callback) {
    let current = $('#' + id).val();
    $('#' + id).html('');
    for (let i in teams) {
        if (teams[i].jid == $('#' + counterId).val()) continue;
        let option = document.createElement('option');
        option.value = teams[i].jid;
        option.innerHTML = teams[i].name;
        $('#' + id).append(option);
        if (teams[i].jid == current)
            $('#' + id).val(current);
    }
    callback(teams);
}

function createFixture(teams, done) {
    let newFixture = new Object();
    newFixture.season = $('#fifaSeason').val();
    newFixture.competition =  $('#fifaComp').val();
    newFixture.date = new Date();
    newFixture.date.setUTCFullYear($('#fifaDate').val().split('-')[0]);
    newFixture.date.setUTCMonth(parseInt($('#fifaDate').val().split('-')[1]) - 1);
    newFixture.date.setUTCDate($('#fifaDate').val().split('-')[2]);
    newFixture.homeTeam = $('#fifaHome').val();
    newFixture.awayTeam = $('#fifaAway').val();
    fifaFixtures.push(newFixture);
    if (done)
        finish();
    updateFixtures(teams);
}

function updateFixtures(teams) {
    fifaFixtures.reverse();
    fixtures = $('#fifaFixtures');
    let header = fixtures.find('tr')[0];
    fixtures.html('');
    fixtures.html(header);
    for (let i in fifaFixtures) {
        let row = document.createElement('tr');

        let homeCell = document.createElement('td');
        homeCell.innerHTML = findTeamName(teams, fifaFixtures[i].homeTeam);
        row.appendChild(homeCell);

        let date = document.createElement('td');
        date.innerHTML = fifaFixtures[i].date.toLocaleDateString();
        row.appendChild(date);

        let awayCell = document.createElement('td');
        awayCell.innerHTML = findTeamName(teams, fifaFixtures[i].awayTeam);
        row.appendChild(awayCell);

        fixtures.append(row);
    }
    fifaFixtures.reverse();
}

function findTeamName(teams, id) {
    for (let i in teams) {
        for (let j in teams[i])
            for (let k in teams[i][j]) {
                // console.log(teams[i][j][k]);
                if (teams[i][j][k].jid == id)
                    return teams[i][j][k].name;
                }
    }
}

function finish() {
    fifaPostRequest('/autosave_fixtures', { 
        fixtures: JSON.stringify( fifaFixtures ),
        game: fifaGame,
        user: fifaUser
    }, ret => location.href='/play?g=' + ret);
}

fifaGetRequest('/teams_by_competition?game=' + fifaGame, updateForm)
fifaGetRequest('/game?game=' + fifaGame + '&user=' + fifaUser, function (res) {
    let day = ("0" + new Date(res.date).getDate()).slice(-2);
    let month = ("0" + (new Date(res.date).getMonth() + 1)).slice(-2);
    let date = new Date(res.date).getFullYear() + "-" + month + "-" + day;
    $('#fifaDate').val(date);
});
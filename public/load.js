function loadSaves() {
    var savesTable = $('#savesTable');
    var savesHeader = $('#savesTable').find('tr')[0];
    savesTable.html('');
    savesTable.append(savesHeader);
    fifaGetRequest('/saves?user=' + fifaUser, insertSaves);
}

function insertSaves(saves) {
    var savesTable = $('#savesTable');
    saves.sort((a, b) => new Date(b.dom) - new Date(a.dom));
    saves.forEach(s => {
        createSaveRow(s);
    });
}

function createSaveRow(save) {
    var d = document
    var saveRow = d.createElement('tr');
    saveRow.className = 'fifa';
    saveRow.id = 'l';
    var nameCell = d.createElement('td');
    nameCell.innerHTML = save.name;
    saveRow.appendChild(nameCell);
    var teamCell = d.createElement('td');
    teamCell.innerHTML = save.teamName;
    saveRow.appendChild(teamCell);
    var domCell = d.createElement('td');
    domCell.innerHTML = new Date(save.dom).toLocaleString();
    saveRow.appendChild(domCell);
    var delCell = d.createElement('td');
    var delButton = d.createElement('button');
    delButton.className = "fifa";
    delButton.innerHTML = "Delete";
    delButton.onclick = () => deleteSave(save.jid);

    delCell.appendChild(delButton);
    saveRow.appendChild(delCell);
    savesTable.append(saveRow);
}

function deleteSave(saveId) {
    fifaPostRequest('delete', { user: fifaUser, game: saveId }, () => location.reload());
}

loadSaves();
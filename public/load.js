function loadSaves() {
    var savesTable = $('#savesTable');
    var savesHeader = $('#savesTable').find('tr')[0];
    savesTable.html('');
    savesTable.append(savesHeader);
    fifaGetRequest('/saves?user=' + fifaUser, insertSaves);
}

function insertSaves(saves) {
    var savesTable = $('#savesTable');
    saves.push({ id: 0, name: 'Test Game', team: 'Seattle Sounders', dom: new Date()});
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
    teamCell.innerHTML = save.team;
    saveRow.appendChild(teamCell);
    var domCell = d.createElement('td');
    domCell.innerHTML = save.dom.toLocaleString();
    saveRow.appendChild(domCell);
    var delCell = d.createElement('td');
    var delButton = d.createElement('button');
    delButton.className = "fifa";
    delButton.innerHTML = "Delete";
    delButton.onclick = () => console.log('delete' + save.id);

    delCell.appendChild(delButton);
    saveRow.appendChild(delCell);
    savesTable.append(saveRow);
}

loadSaves();
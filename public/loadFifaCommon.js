function newSaveObject() {
    var saveObject = 
        {   name: "name of save",
            doc: "date created",
            dom: "date modified",
            manager: "manager name",
            team: {},
            game: "name of game",
            date: new Date(),
            settings: { 
                stats: { 
                    rating:     { display: "Rating", on: true },
                    apps:       { display: "Appearances", on: true },
                    minutes:    { display: "Minutes", on: true },
                    goals:      { display: "Goals", on: true },
                    assists:    { display: "Assists", on: true },
                    clean:      { display: "Clean Sheets", on: true },
                    yellows:    { display: "Yellow Cards", on: true },
                    reds:       { display: "Red Cards", on: true } 
                }, 
                deepStats: {
                    shots:      { display: "Shots", on: true },
                    sot:        { display: "Shots on Target", on: true }, 
                    passes:     { display: "Passes", on: true },
                    pot:        { display: "Passes Completed", on: true },
                    dribs:      { display: "Dribbles", on: true },
                    dot:        { display: "Dribbles Completed", on: true },
                    crosses:    { display: "Crosses", on: true },
                    cot:        { display: "Crosses Completed", on: true },
                    tackles:    { display: "Tackles", on: true },
                    tot:        { display: "Successful Tackles", on: true },
                    saves:      { display: "Saves", on: true },
                },
                attr: { 
                    ovr:        { display: "Overall", on: true },
                    age:        { display: "Age", on: true },
                    wage:       { display: "Wage", on: true },
                    contract:   { display: "Contract Time Remaining", on: true },
                    value:      { display: "Value", on: true },
                    nat:        { display: "Nationality", on: true }
                },
                halftime: { display: "Log Halftime Stats", on: false },
                currentSelections: {
                    team: "name of current team",
                    competition: "name of current competition",
                    division: "name of current division"
                }
            }
        };

    return saveObject;
}

function newStatsObject() {
    var statsObject = new Object();
    statsObject.stats = newSaveObject().settings.stats;
    statsObject.deepStats = newSaveObject().settings.deepStats;
    for (key in statsObject.stats)
        statsObject.stats[key] = 0;
    for (key in statsObject.deepStats)
        statsObject.deepStats[key] = 0;
    return statsObject;
}

function newPlayerObject() {
    var settingsObject = newSaveObject().settings;
    var playerObject =
        {   name: "",
            position: [],
            season: {},
            career: {},
            games: [],
            attr: {}
        }
    playerObject.season = newStatsObject();
    playerObject.career = newStatsObject();
    for (key in settingsObject.attr)
        playerObject.attr[key] = 0;
    return playerObject;
}

function positionList() {
    return ['GK', 'RB', 'CB', 'LB', 'CDM', 'RM', 'CM', 'LM', 'CAM', 'RW', 'CF', 'LW', 'ST'];
}

function newTable(teams) {
    var table = [];
    for (let i = 0; i < teams.length; i++) {
        table[i] = new Object();
        table[i].t = teams[i];
        table[i].w = 0;
        table[i].d = 0;
        table[i].l = 0;
        table[i].gf = 0;
        table[i].ga = 0;
    }
    return table;
}
function newPower(teams) {
    var table = [];
    for (let i = 0; i < teams.length; i++) {
        table[i] = new Object();
        table[i].t = teams[i];
        table[i].p = 0;
        table[i].str = 0;
        table[i].scr = 0;
        table[i].m = 0;
    }
    return table;
}

function startLoading() {
    openModal("Loading...");
}

function stopLoading() {
    closeModal();
}

function saveGame(user, save, success, failure) {
    var savesRequest = new XMLHttpRequest();
    var getString = baseUrl + "saves?u=" + user;
    savesRequest.open("GET", getString, true);
    savesRequest.onreadystatechange = function() {
        if (savesRequest.readyState != 4)
            return;
        var results = JSON.parse(savesRequest.responseText);
        if (results.error) {
            $("#fifaContent").html("ERROR: " + results.error);
        }
        var html = 
            "<form id='saveGameForm' action='javascript:void(0)'>\
                <label>Name your save:</label>\
                <input type='text' id='saveGameName' />\
                <input type='submit' value='Save Game' />\
                <button type='button' onclick='closeModal()'>Cancel</button>\
            </form>";
        openModal(html);
        $("#saveGameForm").submit(function() {
            var saveName= $("#saveGameName").val();
            if (results.filter(s => s.name == saveName).length > 0) {
                closeModal();
                if (window.confirm("Are you sure you want to overwrite file \"" + saveName + "\"")) {
                    closeModal();
                    save.name = saveName;
                    sendSaveRequest(user, save, success)
                } else {
                    closeModal();
                    saveGame(user, save, success, failure);
                }
            } else {
                closeModal();
                save.name = saveName;
                sendSaveRequest(user, save, success)
            }
        });
    }
    savesRequest.send();
}

function sendSaveRequest(user, save, success, failure) {
    startLoading();
    console.log(user, save);
    var request = new XMLHttpRequest();
    var posturl = baseUrl + "save";
    var postString = "u=" + user + "&s=" + JSON.stringify(save);
    request.open("POST", posturl, true);
    request.onreadystatechange = function() {
        if (request.readyState != 4)
            return;
        var results = JSON.parse(request.responseText);
        console.log(results);
        if (results.success) {
            stopLoading();
            success(results);
        } else {
            stopLoading();
            failure(results);
        }
    }
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(postString);
}

var modalLoaded = false;

function openModal(innerHTML) {
    if (modalLoaded) {
        $("#fifaModal").html(innerHTML);
        $("#fifaModalBackground").show();
        return;
    }
    var modalBackground = document.createElement("div");
    modalBackground.id = "fifaModalBackground"
    modalBackground["z-index"] = "1";

    var modal = document.createElement("div");
    modal.innerHTML = innerHTML;
    modal.id = "fifaModal";

    modalBackground.append(modal);
    document.body.append(modalBackground);
    modalLoaded = true;
}

function closeModal() {
    if (modalLoaded)
        $("#fifaModalBackground").hide();
}
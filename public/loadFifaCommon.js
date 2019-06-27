function newSaveObject() {
    var saveObject = 
        {   name: "Name of save",
            doc: "date created",
            dom: "date modified",
            manager: "manager name",
            team: "name of team",
            game: "name of game",
            league: "name of league",
            date: new Date(),
            competitions: [],
            roster: [],
            lineups: [],
            settings: 
                { stats: 
                    {   rating:     { display: "Rating", on: true },
                        apps:       { display: "Appearances", on: true },
                        minutes:    { display: "Minutes", on: true },
                        goals:      { display: "Goals", on: true },
                        assists:    { display: "Assists", on: true },
                        clean:      { display: "Clean Sheets", on: true },
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
                        yellows:    { display: "Yellow Cards", on: true },
                        reds:       { display: "Red Cards", on: true } 
                    }, 
                attr:
                    {   ovr:        { display: "Overall", on: true },
                        age:        { display: "Age", on: true },
                        wage:       { display: "Wage", on: true },
                        contract:   { display: "Contract Time Remaining", on: true },
                        value:      { display: "Value", on: true },
                        nat:        { display: "Nationality", on: true }
                    },
                halftime: { display: "Log Halftime Stats", on: false }
                }
        };

    return saveObject;
}

function newStatsObject() {
    var statsObject = newSaveObject().settings.stats;
    for (key in statsObject)
        statsObject[key] = 0;
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
    return ['GK', 'RB', 'CB', 'LB', 'CDM', 'RM', 'CM', 'LM', 'CAM', 'RW', 'CF', 'LW', 'ST', ''];
}
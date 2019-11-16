var newGameForm = (user: string) => {
    '<form id="fifaNewGame" action="javascript:void(0)" onsubmit="createGame(' + user + ')>\
        <label for="name">Name:</label>\
        <input id="name" type="text" required>\
        <label for="manName">Manager Name:</label>\
        <input id="manName" type="text" required>\
        <label for="gameSelect">Choose Game:</label>\
        <select id="gameSelect" required>\
            <option value="" disabled selected>---</option>\
        </select><br>\
        <label for="leagueSelect">Choose League:</label\
        <select id="leagueSelect" required disabled>\
            <option value="" disabled selected>---</option>\
        </select><br>\
        <label for="teamSelect">Choose Team:</label>\
        <select id="teamSelect" required disabled>\
            <option value="" disabled selected>---</option>\
        </select><br>\
    </form>';
}
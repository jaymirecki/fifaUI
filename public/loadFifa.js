function loadMireckiContent() {
    addStyle("fifaSiteDesktop.css");

    var mauthUrl = detectHost("https://mirecki-auth.herokuapp.com/mauth.js",
                              "http://mirecki-auth.herokuapp.com/mauth.js",
                              "https://mirecki-auth.herokuapp.com/mauth.js");
    baseUrl = detectHost("http://localhost:8888/",
                             "http://fifa-companion.herokuapp.com/",
                             "https://fifa-companion.herokuapp.com/");

    loadScript(mauthUrl, function() {
        $("#mireckiContent").html("<div id='fifaContent'></div>");
        loadFifaContent();
    });
}

function fifaError(error) {
    $("#fifaContent").html("ERROR: " + error);
}
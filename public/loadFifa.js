function loadMireckiContent() {
    baseUrl = detectHost("http://localhost:8888/",
                             "http://fifa-companion.herokuapp.com/",
                             "https://fifa-companion.herokuapp.com/")
    addStyle("/fifaSiteDesktop.css");

    var mauthUrl = detectHost("https://mirecki-auth.herokuapp.com/mauth.js",
                              "http://mirecki-auth.herokuapp.com/mauth.js",
                              "https://mirecki-auth.herokuapp.com/mauth.js");;

    loadScript("https://code.jquery.com/jquery-3.4.1.slim.js", function() {
        loadScript(mauthUrl, function() {
            $("#mireckiContent").html("<div id='fifaContent'></div>");
            loadScript("/loadFifaCommon.js", function() {
                loadFifaContent();
            });
        });
    });
}

function fifaError(error) {
    $("#fifaContent").html("ERROR: " + error);
}
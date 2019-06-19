function loadMireckiContent() {
    addStyle("fifaSite.css");

    var mauthUrl = detectHost("https://mirecki-auth.herokuapp.com/mauth.js",
                              "http://mirecki-auth.herokuapp.com/mauth.js",
                              "https://mirecki-auth.herokuapp.com/mauth.js");

    loadScript(mauthUrl, function() {
        $("#mireckiContent").html("<div id='fifaContent'></div>");
        var auth = new MAuth();
        auth.login(function(user) {
            loadFifaContent(user)
        });
    });
}
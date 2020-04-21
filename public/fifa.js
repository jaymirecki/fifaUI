var fifaUser;
var fifaGame;

function loadScript(filename, callback) {
    var script = document.createElement('script');
    script.src = filename;
    script.async = true;
    script.onload = callback;
    document.getElementsByTagName('head')[0].appendChild(script);
}
function addStyle(filename) {
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';
    stylesheet.href = filename;
    document.getElementsByTagName('head')[0].appendChild(stylesheet);
}

function main() {
    addStyle('mobile.css');
    var path = location.pathname
    if (path != "/") {
        fifaUser = "test";
        var url_string = window.location.href
        var url = new URL(url_string);
        fifaGame = url.searchParams.get("g");
        // console.log(fifaUser);
        // console.log(fifaGame);
    }
    loadScript('jquery.js', () => loadScript(path + '.js'));
}

function fifaGetRequest(getString, callback) {
    fifaRequest(true, getString, {}, callback);
}
function objectToPostString(obj) {
    let postString = "";
    for (key in obj) {
        postString = postString +
            "&" + key + "=" + obj[key];
    }
    return postString.slice(1);
}
function fifaRequest(get, url, parameters, callback) {
    var DEBUG = true;
    var request = new XMLHttpRequest();
    var getString = url;
    if (get)
        request.open("GET", getString, true);
    else
        request.open("POST", getString, true);
    request.onreadystatechange = function () {
        if (request.readyState != 4)
            return;
        try {
            var result = JSON.parse(request.responseText);
            if (DEBUG) console.log(result);
            if (result.success)
                callback(result.content);
        } catch(e) {
            if (DEBUG) console.log(e);
        }
    };
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    if (get)
        request.send();
    else
        request.send(objectToPostString(parameters));
}
function fifaPostRequest(url, parameters, callback) {
    fifaRequest(false, url, parameters, callback);
}
function convertDate(date) {
    newDate = new Date();
    newDate.setDate(date.getUTCDate());
    newDate.setMonth(date.getUTCMonth());
    newDate.setYear(date.getUTCFullYear());
    return newDate;
}

main();
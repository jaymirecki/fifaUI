var fifaUser;

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
        // console.log(fifaUser);
    }
    loadScript('jquery.js', () => loadScript(path + '.js'));
}

function fifaGetRequest(getString, callback) {
    var request = new XMLHttpRequest();
    var getString = getString;
    request.open("GET", getString, true);
    request.onreadystatechange = function () {
        if (request.readyState != 4)
            return;
        // console.log(request.responseText);
        var result = JSON.parse(request.responseText);
        // console.log(result)
        callback(result);
    };
    request.send();
}
function objectToPostString(obj) {
    let postString = "";
    for (key in obj) {
        postString = postString +
            "&" + key + "=" + obj[key];
    }
    return postString.slice(1);
}
function fifaPostRequest(url, parameters, callback) {
    var request = new XMLHttpRequest();
    var getString = url;
    request.open("POST", getString, true);
    request.onreadystatechange = function () {
        if (request.readyState != 4)
            return;
        // console.log(request.responseText);
        var result = JSON.parse(request.responseText);
        // console.log(result)
        callback(result);
    };
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.send(objectToPostString(parameters));
}

main();
var queries = parseQueries();
var bpm = 60;
var noteLength = 15 / bpm;
var cutoff = 0.9;
var beats = 16;
var context;
var sequencerNodes = [];
var waveforms = ["sine", "sawtooth", "square", "triangle"];
var keys = ["c", "d", "e", "f", "g", "a", "b"];
var currentKey = keys[0];
var major = true;
var frequencies = [
    1046.50,
    987.77,
    880.00,
    783.99,
    698.46,
    659.25,
    587.33,
    523.25,
    493.88,
    440.00,
    392.00,
    349.23,
    329.63,
    293.66,
    261.64
];
var keyButtons = {
    "cButton": "c",
    "dButton": "d",
    "eButton": "e",
    "fButton": "f",
    "gButton": "g",
    "aButton": "a",
    "bButton": "b",
};
var oscillators = [];
var gainNodes = [];
var currentWaveForm = waveforms[0];

var randomise = false;
var nodeAdded = false;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();
context.suspend();

for (var i = 0; i < frequencies.length; i++) {
    var osc = context.createOscillator();
    var gain = context.createGain();
    gain.gain.value = 0;
    osc.frequency.value = frequencies[i];
    osc.type = currentWaveForm;
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    oscillators[i] = osc;
    gainNodes[i] = gain;
}

window.setInterval(playSynth, 10);
window.setInterval(randomiseGrid, 10);

function createGrid() {
    for (var y = 0; y < frequencies.length; y++) {
        row = document.createElement("tr");
        var cellArray = []
        for (var x = 0; x < beats; x++) {
            cell = document.createElement("td");
            node = document.createElement("div");
            node.className += "sequencerNode";
            node.onclick = toggleChecked;
            cell.appendChild(node);
            cellArray[x] = node;
            row.appendChild(cell);
        }
        sequencerNodes[y] = cellArray
        document.getElementById("sequencerGrid").appendChild(row);
    }

    if (queries != null && 'sequence' in queries) {
        decodeStringSequence(queries['sequence']);
    }
}

function startAudio() {
    context.resume();
}

function stopAudio() {
    context.suspend();
}

function playSynth() {
    if (context.state == "running") {
        var x = Math.floor((context.currentTime / noteLength) % beats);
        clearSelection();
        for (var y = 0; y < oscillators.length; y++) {
            var noteProgress = (context.currentTime / noteLength) % 1;
            sequencerNodes[y][x].classList.add("selected");
            if (sequencerNodes[y][x].classList.contains("checked")
                && noteProgress < cutoff) {
                gainNodes[y].gain.value = 1;
            }
            else {
                gainNodes[y].gain.value = 0;
            }
        }
    }
}

function toggleChecked(e) {
    var evt = e || window.event;
    var node = evt.target || evt.srcElement;
    node.classList.toggle("checked");
}

function clearSelection() {
    for (var y = 0; y < oscillators.length; y++) {
        for (var x = 0; x < beats; x++) {
            node = sequencerNodes[y][x];
            if (node.classList.contains("selected")) {
                node.classList.remove("selected");
            }
        }
    }
}

function changeScale(key, isMajor) {
    var tonality = isMajor ? "major" : "minor";
    if (scales != null && key in scales) {
        frequencies = scales[key][tonality];
        for (var i = 0; i < frequencies.length; i++) {
            oscillators[i].frequency.value = frequencies[i];
        }
    }
    major = isMajor;
    currentKey = key;
}

function changeWaveform(waveform) {
    if (waveform != currentWaveForm) {
        switch (waveform) {
            case "sine":
                switch (currentWaveForm) {
                    case "sawtooth":
                        var saw = document.getElementById("sawtoothButton").classList.remove("selected");
                        break;
                    case "square":
                        var square = document.getElementById("squareButton").classList.remove("selected");
                        break;
                    case "triangle":
                        var triangle = document.getElementById("triangleButton").classList.remove("selected");
                        break;
                }
                document.getElementById("sineButton").classList.add("selected");
                currentWaveForm = waveform;
                break;

            case "sawtooth":
                switch (currentWaveForm) {
                    case "sine":
                        document.getElementById("sineButton").classList.remove("selected");
                        break;
                    case "square":
                        var square = document.getElementById("squareButton").classList.remove("selected");
                        break;
                    case "triangle":
                        var triangle = document.getElementById("triangleButton").classList.remove("selected");
                        break;
                }
                document.getElementById("sawtoothButton").classList.add("selected");
                currentWaveForm = waveform;
                break;

            case "square":
                switch (currentWaveForm) {
                    case "sine":
                        document.getElementById("sineButton").classList.remove("selected");
                        break;
                    case "sawtooth":
                        var saw = document.getElementById("sawtoothButton").classList.remove("selected");
                        break;
                    case "triangle":
                        var triangle = document.getElementById("triangleButton").classList.remove("selected");
                        break;
                }
                document.getElementById("squareButton").classList.add("selected");
                currentWaveForm = waveform;
                break;

            case "triangle":
                switch (currentWaveForm) {
                    case "sine":
                        document.getElementById("sineButton").classList.remove("selected");
                        break;
                    case "sawtooth":
                        var saw = document.getElementById("sawtoothButton").classList.remove("selected");
                        break;
                    case "square":
                        var square = document.getElementById("squareButton").classList.remove("selected");
                        break;
                }
                document.getElementById("triangleButton").classList.add("selected");
                currentWaveForm = waveform;
                break;
        }

        for (var i = 0; i < oscillators.length; i++) {
            oscillators[i].type = waveform;
        }
    }
}

function clearGrid() {
    var nodes = document.getElementsByClassName("sequencerNode");
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.classList.contains("checked")) {
            node.classList.remove("checked");
        }
    }
}

function toggleRandomise() {
    var randomiseButton = document.getElementById("randomiseButton");
    if (randomiseButton.classList.contains("selected")) {
        randomise = false;
        randomiseButton.classList.remove("selected");
    }
    else {
        randomise = true;
        randomiseButton.classList.add("selected");
    }
}

function randomiseGrid() {
    if (context.state == "running" && randomise) {
        if (Math.floor((context.currentTime / noteLength) % beats) == 0) {
            if (!nodeAdded) {
                var x = Math.round(Math.random() * (beats - 1));
                var y = Math.round(Math.random() * (sequencerNodes.length - 1));
                var node = sequencerNodes[y][x];
                if (node.classList.contains("checked")) {
                    node.classList.remove("checked");
                }
                else {
                    node.classList.add("checked");
                }
                nodeAdded = true;
            }
        }
        else {
            nodeAdded = false;
        }
    }
}

function encodeGrid() {
    var encodedValue = "";
    var groupCount = Math.ceil((frequencies.length * beats) / 6);
    for (var i = 0; i < groupCount; i++) {
        var binary = "";
        for (var g = 0; g < 6; g++) {
            var y = Math.floor((g + i * 6) / beats);
            var x = (g + (i * 6)) % beats;
            var node = sequencerNodes[y][x];
            if (node.classList.contains("checked")) {
                binary += "1";
            }
            else {
                binary += "0";
            }
        }
        encodedValue += convertBase(binary, 2, 64);
    }
    var options = major ? "0" : "1";
    var keyBinary = convertBase(keys.indexOf(currentKey).toString(), 10, 2);
    while (keyBinary.length < 3) {
        keyBinary = "0" + keyBinary;
    }
    var waveBinary = convertBase(waveforms.indexOf(currentWaveForm).toString(), 10, 2);
    while (waveBinary.length < 2) {
        waveBinary = "0" + waveBinary;
    }

    options += keyBinary + waveBinary;
    encodedValue += convertBase(options, 2, 64);
    return encodedValue;
}

function decodeStringSequence(sequence) {
    clearGrid();
    var chars = sequence.split('');
    for (var g = 0; g < chars.length - 1; g++) {
        var binary = convertBase(chars[g], 64, 2);
        while (binary.length < 6) {
            binary = "0" + binary;
        }
        for (var i = 0; i < binary.length; i++) {
            var y = Math.floor((i + (g * 6)) / beats);
            var x = (i + (g * 6)) % beats;
            var node = sequencerNodes[y][x];
            if (binary[i] == "1") {
                node.classList.add("checked");
            }
        }
    }
    var optionsChar = chars[chars.length - 1];
    var optionsBinary = convertBase(optionsChar, 64, 2);
    while (optionsBinary.length < 6) {
        optionsBinary = "0" + optionsBinary;
    }
    var isMajor = optionsBinary[0] == "0" ? true : false;
    var newKey = convertBase(optionsBinary.substr(1, 3), 2, 10);
    var newWaveform = convertBase(optionsBinary.substr(4, 2), 2, 10);
    changeScale(keys[parseInt(newKey)], isMajor);
    changeWaveform(waveforms[parseInt(newWaveform)]);
}

// GitHub Gist: https://gist.github.com/ryansmith94/91d7fd30710264affeb9
function convertBase(value, from_base, to_base) {
    var range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
    var from_range = range.slice(0, from_base);
    var to_range = range.slice(0, to_base);

    var dec_value = value.split('').reverse().reduce(function (carry, digit, index) {
        if (from_range.indexOf(digit) === -1) throw new Error('Invalid digit `' + digit + '` for base ' + from_base + '.');
        return carry += from_range.indexOf(digit) * (Math.pow(from_base, index));
    }, 0);

    var new_value = '';
    while (dec_value > 0) {
        new_value = to_range[dec_value % to_base] + new_value;
        dec_value = (dec_value - (dec_value % to_base)) / to_base;
    }
    return new_value || '0';
}

function parseQueries() {
    var url = window.location.href;
    var queryIndex = url.indexOf('?');
    if (queryIndex < 0 || queryIndex >= url.length - 1) {
        return null;
    }
    var queryString = url.substring(queryIndex + 1);
    var queryArray = queryString.split('&');
    var queries = {};
    for (var i = 0; i < queryArray.length; i++) {
        var query = queryArray[i].split('=');
        queries[query[0]] = query[1];
    }

    return queries;
}

function toggleScalesDialog() {
    var scalesDialog = document.getElementById("scalesDialog");
    scalesDialog.classList.toggle("active");
    if (scalesDialog.classList.contains("active")) {
        var majorButton = document.getElementById("majorButton");
        var minorButton = document.getElementById("minorButton");
        if (major) {
            if (!majorButton.classList.contains("selected")) {
                majorButton.classList.add("selected");
            }
            if (minorButton.classList.contains("selected")) {
                minorButton.classList.remove("selected");
            }
        }
        else {
            if (!minorButton.classList.contains("selected")) {
                minorButton.classList.add("selected");
            }
            if (majorButton.classList.contains("selected")) {
                majorButton.classList.remove("selected");
            }
        }
        for (var keyButton in keyButtons) {
            var btn = document.getElementById(keyButton);
            if (keyButtons[keyButton] == currentKey) {
                if (!btn.classList.contains("selected")) {
                    btn.classList.add("selected");
                }
            }
            else {
                if (btn.classList.contains("selected")) {
                    btn.classList.remove("selected");
                }
            }
        }
    }
}

function changeTonality(e) {
    var evt = e || window.event;
    var sender = evt.target || evt.srcElement;
    var isMajor = true;
    if (sender.id == "minorButton") {
        isMajor = false;
    }
    if (isMajor != major) {
        document.getElementById("majorButton").classList.toggle("selected");
        document.getElementById("minorButton").classList.toggle("selected");
        changeScale(currentKey, isMajor);
    }
}

function changeKey(e) {
    var evt = e || window.event;
    var sender = evt.target || evt.srcElement;
    var newKey = "c";
    if (sender.id in keyButtons) {
        newKey = keyButtons[sender.id];
    }
    if (newKey != currentKey) {
        document.getElementById(currentKey + "Button").classList.remove("selected");
        document.getElementById(newKey + "Button").classList.add("selected");
        changeScale(newKey, major);
    }
}

function toggleShareDialog() {
    var shareDialog = document.getElementById("shareDialog");
    shareDialog.classList.toggle("active");
    if (shareDialog.classList.contains("active")) {
        generateShareURL();
    }
}

function generateShareURL() {
    var shareURL = "http://synthsequencer.herokuapp.com?sequence=" + encodeGrid();
    var shareTextBox = document.getElementById("shareLink");
    shareTextBox.value = shareURL;
    shareTextBox.select();
}

function copyShareURL() {
    var shareTextBox = document.getElementById("shareLink");
    shareTextBox.select();
    document.execCommand('copy');
}
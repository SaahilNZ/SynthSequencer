var bpm = 60;
var noteLength = 15 / bpm;
var cutoff = 0.9;
var beats = 16;
var context;
var sequencerNodes = []
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
var oscillators = [];
var gainNodes = [];

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
    osc.type = "sine";
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

function toggleChecked(isManual) {
    var node = window.event.srcElement;
    if (node.classList.contains("checked")) {
        node.classList.remove("checked");
    }
    else {
        node.classList.add("checked")
    }
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

function changeWaveform(waveform) {
    var sine = document.getElementById("sineButton");
    var saw = document.getElementById("sawtoothButton");
    var square = document.getElementById("squareButton");
    var triangle = document.getElementById("triangleButton");

    if (waveform == "sine") {
        if (saw.classList.contains("selected")) {
            saw.classList.remove("selected");
        }
        if (square.classList.contains("selected")) {
            square.classList.remove("selected");
        }
        if (triangle.classList.contains("selected")) {
            triangle.classList.remove("selected");
        }

        if (!sine.classList.contains("selected")) {
            sine.classList.add("selected");
            for (var i = 0; i < oscillators.length; i++) {
                oscillators[i].type = waveform;
            }
        }
    }
    else if (waveform == "sawtooth") {
        if (sine.classList.contains("selected")) {
            sine.classList.remove("selected");
        }
        if (square.classList.contains("selected")) {
            square.classList.remove("selected");
        }
        if (triangle.classList.contains("selected")) {
            triangle.classList.remove("selected");
        }

        if (!saw.classList.contains("selected")) {
            saw.classList.add("selected");
            for (var i = 0; i < oscillators.length; i++) {
                oscillators[i].type = waveform;
            }
        }
    }
    else if (waveform == "square") {
        if (saw.classList.contains("selected")) {
            saw.classList.remove("selected");
        }
        if (sine.classList.contains("selected")) {
            sine.classList.remove("selected");
        }
        if (triangle.classList.contains("selected")) {
            triangle.classList.remove("selected");
        }

        if (!square.classList.contains("selected")) {
            square.classList.add("selected");
            for (var i = 0; i < oscillators.length; i++) {
                oscillators[i].type = waveform;
            }
        }
    }
    else if (waveform == "triangle") {
        if (saw.classList.contains("selected")) {
            saw.classList.remove("selected");
        }
        if (square.classList.contains("selected")) {
            square.classList.remove("selected");
        }
        if (sine.classList.contains("selected")) {
            sine.classList.remove("selected");
        }

        if (!triangle.classList.contains("selected")) {
            triangle.classList.add("selected");
            for (var i = 0; i < oscillators.length; i++) {
                oscillators[i].type = waveform;
            }
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
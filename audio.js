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

window.AudioContext = window.AudioContext||window.webkitAudioContext;
context = new AudioContext();
context.suspend();

for (var i = 0; i < frequencies.length; i++) {
    var osc = context.createOscillator();
    var gain = context.createGain();
    gain.gain.value = 0;
    osc.frequency.value = frequencies[i];
    osc.type = "square";
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    oscillators[i] = osc;
    gainNodes[i] = gain;
}

window.setInterval(playSynth, 10);

function createGrid() {
    for (var y = 0; y < frequencies.length; y++) {
        row = document.createElement("tr");
        var cellArray = []
        for (var x = 0; x < beats; x++) {
            cell = document.createElement("td");
            sequencerNode = document.createElement("input");
            sequencerNode.type = "checkbox";
            cell.appendChild(sequencerNode);
            cellArray[x] = sequencerNode;
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
        for (var y = 0; y < oscillators.length; y++) {
            var noteProgress = (context.currentTime / noteLength) % 1;
            if (sequencerNodes[y][x].checked && noteProgress < cutoff) {
                gainNodes[y].gain.value = 1;
            }
            else {
                gainNodes[y].gain.value = 0;
            }
        }
    }
}
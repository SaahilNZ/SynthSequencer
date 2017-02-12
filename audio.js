var bpm = 60;
var noteLength = bpm / 60;
var beats = 16;
var context;
var sequencerNodes = []
var frequencies = [
    261.64,
    293.66,
    329.63,
    349.23,
    392.00,
    440.00,
    493.88,
    523.25,
    587.33,
    659.25,
    698.46,
    783.99,
    880.00,
    987.77,
    1046.50
];
var oscillators = [];
var gainNodes = [];

window.AudioContext = window.AudioContext||window.webkitAudioContext;
context = new AudioContext();
context.suspend();

for (var i = 0; i < frequencies.length; i++) {
    var osc = context.createOscillator();
    var gain = context.createGain();
    gain.gain.value = 1;
    osc.frequency.value = frequencies[i];
    osc.type = "square";
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    oscillators[i] = osc;
    gainNodes[i] = gain;
}

function createGrid() {
    for (var y = 0; y < frequencies.length; y++) {
        row = document.createElement("tr");
        cellArray = []
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
    
}
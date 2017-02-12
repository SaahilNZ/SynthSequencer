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

window.AudioContext = window.AudioContext||window.webkitAudioContext;
context = new AudioContext();

function createGrid() {
    for (y = 0; y < frequencies.length; y++) {
        row = document.createElement("tr");
        cellArray = []
        for (x = 0; x < beats; x++) {
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
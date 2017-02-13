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
    osc.type = "sine";
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

function toggleChecked() {
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

function changeWaveform() {
    var cb = document.getElementById("waveform");
    var waveform = cb.options[cb.selectedIndex].text;

    for (var i = 0; i < oscillators.length; i++) {
        oscillators[i].type = waveform.toLowerCase();
    }
}
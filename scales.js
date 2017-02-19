var noteFrequencies = [
    // g6, f#6, f6, e6, d#6
    1567.98, 1479.98, 1396.91, 1318.51, 1244.51,
    // d6, c#6, c6, b5, a#5
    1174.66, 1108.73, 1046.50, 987.77, 932.33,
    // a5, g#5, g5,f#5, f5
    880.00, 830.61, 783.99, 739.99, 698.46,
    // e5, d#5, d5, c#5, c5
    659.25, 622.25, 587.33, 554.37, 523.25,
    // b4, a#4, a4, g#4, g4
    493.88, 466.16, 440.00, 415.30, 392.00,
    // f#4, f4, e4, d#4, d4
    369.99, 349.23, 329.63, 311.13, 293.66,
    // c#4, c4, b3, a#3, a3
    277.18, 261.63, 246.94, 233.08, 220.00
];

var keyOffsets = {
    "c": 7,
    "d": 5,
    "e": 3,
    "f": 2,
    "g": 0,
    "a": 10,
    "b": 8
}

var scales = {};
var majorIntervals = [1, 2, 2, 2, 1, 2, 2];
var minorIntervals = [2, 2, 1, 2, 2, 1, 2];

for (var key in keyOffsets) {
    var scale = {
        "major": generateScale(keyOffsets[key], majorIntervals),
        "minor": generateScale(keyOffsets[key], minorIntervals)
    };
    scales[key] = scale;
}

function generateScale(initial, intervals) {
    var offset = 0;
    var scale = [];
    for (var i = 0; i < 15; i++) {
        scale[i] = noteFrequencies[initial + offset];
        offset += intervals[i % intervals.length];
    }
    return scale;
}
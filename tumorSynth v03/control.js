autowatch = 1;
inlets = 1;
outlets = 8;

var maxVoices = 24;
var vcs = [];


//toggle between setup the voices and turn all voices off
function msg_int(n) {
    if (n === 1) {
        makeVoicesArray();
        setVoices(maxVoices);
        turnOn(1, 150, 64);
    } else {
        turnAllOff();
    }
}


//divide the voice if there is a voice available
function divide(f, p) {
    var ava = findAvailableVoice();
    if (ava !== false) {
        turnOn(ava, f, p);
    }
}


//kill a voice unless it is the only voice left playing
function kill(n, f) {
    if (getPlayingVoices() > 1) {
        turnOff(n);
    } else {
        resetVoice(n);
        divide(f);
    }
}


//reset the voice (i.e. set random lifetime, etc.)
function resetVoice(n) {
    setTarget(n);
    outlet(6, 1);
}


//returns the number of currently playing voices
function getPlayingVoices() {
    var ans = 0;
    for (var i = 1; i < vcs.length; i++) {
        if (vcs[i] === true) {
            ans++;
        }
    }
    return ans;
}


//returns an available voice, or returns 'false' when there is none
function findAvailableVoice() {
    var ans = false;
    for (var i = vcs.length; i > 1; i--) {
        if (vcs[i] === false) {
            ans = i;
        }
    }
    return ans;
}


//make an array with voices and sets all voices to 'false'
function makeVoicesArray() {
    for (var i = 1; i < maxVoices + 1; i++) {
        vcs[i] = false;
    }
}


//outputs the number of voices to the patch
function setVoices(n) {
    outlet(0, n);
}


//outputs the target number to the patch
function setTarget(n) {
    outlet(1, n);
}


//turns on a voice with voicenumber (n), pitch (f) and pan (p)
//outputs to the patch
function turnOn(n, f, p) {
    vcs[n] = true;
    setTarget(n);
    outlet(4, f); //pitch
    outlet(5, p); //pan
    outlet(2, n); //voice number
    outlet(3, 1); //turn on
    outlet(7, getPlayingVoices()); //output number of playing voices
}


//turns of a voice with voicenumber (n)
//outputs to the patch
function turnOff(n) {
    vcs[n] = false;
    setTarget(n);
    outlet(3, 0); //turn off
    outlet(7, getPlayingVoices()); //output number of playing voices
}


//turns off all voices
//outputs to the patch
function turnAllOff() {
    setTarget(0);
    outlet(3, 0);
}

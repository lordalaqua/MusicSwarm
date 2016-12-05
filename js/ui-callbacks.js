/*----------------------------------------------------------------------------*/
/**
 * Callbacks to update global control variables
 *
 */

function updateSize(slideAmount) {
    var sliderDiv = document.getElementById("sizeAmount");
    sliderDiv.innerHTML = slideAmount;
    scale = parseInt(slideAmount);
}

function updateTail(slideAmount) {
    var sliderDiv = document.getElementById("tailAmount");
    sliderDiv.innerHTML = slideAmount;
}

function updateRadius(slideAmount) {
    var sliderDiv = document.getElementById("radiusAmount");
    sliderDiv.innerHTML = slideAmount;
    radius = parseInt(slideAmount);
}

function updateAttraction(slideAmount) {
    var sliderDiv = document.getElementById("attractionAmount");
    sliderDiv.innerHTML = slideAmount;
    attraction = parseInt(slideAmount)/3000;
}

function updateRepellency(slideAmount) {
    var sliderDiv = document.getElementById("repellencyAmount");
    sliderDiv.innerHTML = slideAmount;
    repellency = parseInt(slideAmount)/3000;
}

function updateFlocking(slideAmount) {
    var sliderDiv = document.getElementById("flockingAmount");
    sliderDiv.innerHTML = slideAmount;
    flocking = parseInt(slideAmount)/1000;
}

function updateRandom(slideAmount) {
    var sliderDiv = document.getElementById("randomAmount");
    sliderDiv.innerHTML = slideAmount;
    random = parseInt(slideAmount)/100;
}

function updateVelocity(slideAmount) {
    var sliderDiv = document.getElementById("velocityAmount");
    sliderDiv.innerHTML = slideAmount;
    velocity = parseInt(slideAmount)/5000;
}

function updateDamping(slideAmount) {
    var sliderDiv = document.getElementById("dampingAmount");
    sliderDiv.innerHTML = slideAmount;
    damping = parseInt(slideAmount);
    dampingFactor = (1000-damping)/1000;
}

// Read a file to memory when uploaded
var fileInput = document.getElementById('file');
fileInput.onchange = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    source = audioCtx.createBufferSource();
    reader.onload = function(event) {
        var audioData = event.target.result;
        var fileStatus = document.getElementById('fileStatus');
        fileStatus.innerHTML = "File is loading...";
        audioCtx.decodeAudioData(audioData, (buffer) => {
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.loop = true;
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            source.start();
            loadedFile = true;
            connectSources(false);
            fileStatus.innerHTML = "File Loaded!";
            var stopButton = document.getElementById('stopButton');
            stopButton.style.display = 'inline';
        });
    }
    reader.readAsArrayBuffer(file);
}

function stopSong(button) {
    source.stop();
    loadedFile = false;
    connectSources(true);
    button.style.display = 'none';
}

function showCube(checked) {
    if(checked)
        scene.add(cubeMesh);
    else
        scene.remove(cubeMesh);
}

function selectColors(value,checked) {
    colors = value || 'none';
}

function selectVizType(value,checked) {
    vizType = value || 'bars';
}
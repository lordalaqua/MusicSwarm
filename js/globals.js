/*----------------------------------------------------------------------------*/
/*----------------------------  Globals ------------------------------------*/

// Global array for particles, and number of particles
var particles = [];
var numParticles = 100;

// Controllable Parameters
var scale = 1;
var radius = 40;
var attraction = 1/3000;
var repellency = 0;
var flocking = 0;
var random = 4;
var velocity = 0.1;
var damping = 0;
var dampingFactor = 1;
var fall = 0;
var tailSize = 5;
var colors ='position';
var vizType = 'bars';

// Geometry to make the particles
var sphereGeometry = new THREE.SphereGeometry(1);

// Sound control variables
var audioCtx = new AudioContext();
var leftChannelNode = audioCtx.createStereoPanner();
leftChannelNode.pan.value = -1;
leftChannelNode.connect(audioCtx.destination);
var rightChannelNode = audioCtx.createStereoPanner();
rightChannelNode.pan.value = 1;
rightChannelNode.connect(audioCtx.destination);

// Sound file loading variables
var source;
var analyser = audioCtx.createAnalyser();
var loadedFile = false;
var file_fbc_array = new Uint8Array(analyser.frequencyBinCount);
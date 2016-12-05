/*----------------------------------------------------------------------------*/
/*----------------------------  Scene Setup ----------------------------------*/

// Setup the 3D scene and camera
var scene = new THREE.Scene();
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight / 2;
var aspectRatio = windowWidth / windowHeight;
var camera = new THREE.PerspectiveCamera( 60, aspectRatio, 0.1, 10000 );
// Create the canvas element on the HTML body
var canvas = document.getElementById('canvas');
var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias:true, });
renderer.setSize( windowWidth, windowHeight );

// Setup the camera and controls
var cameraDistance = 100;
var cubeSize = 100;
var centerPoint = cubeSize/2;

camera.position.x = cameraDistance + centerPoint;
camera.position.y = cameraDistance + centerPoint;
camera.position.z = cameraDistance + centerPoint;
camera.lookAt(new THREE.Vector3(centerPoint,centerPoint,centerPoint));
controls = new THREE.OrbitControls( camera,canvas);

controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.5;
controls.panSpeed = 0.8;

controls.enableZoom = true;
controls.enablePan = true;
controls.target = new THREE.Vector3(centerPoint,centerPoint,centerPoint);

controls.enableDamping = true;
controls.dampingFactor = 0.3;

// Setup the lighting
hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( -1, 1.75, 1 );
dirLight.position.multiplyScalar( 50 );
scene.add( dirLight );

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

var d = 50;

dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = -0.0001;

// Create a cube to contain the particle's movement and add to the scene
var cube = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
var cubeMesh = new THREE.LineSegments(
    new THREE.EdgesGeometry(cube),
    new THREE.LineBasicMaterial({linewidth: 20, color: 0x666666})
);
cubeMesh.position.x = cubeSize / 2;
cubeMesh.position.y = cubeSize / 2;
cubeMesh.position.z = cubeSize / 2;
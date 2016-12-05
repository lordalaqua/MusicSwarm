/*----------------------------------------------------------------------------*/
/*----------------------------  Particles ------------------------------------*/

/**
 * Particle constructor, create an object containing the particle's
 * 3D mesh, oscillators, velocity, and tail
 */
function Particle() {
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(Math.random()%255,Math.random()%255,Math.random()%255)
    });
    this.mesh = new THREE.Mesh(sphereGeometry, material);
    this.mesh.position.x = Math.random()*cubeSize;
    this.mesh.position.y = Math.random()*cubeSize;
    this.mesh.position.z = Math.random()*cubeSize;
    createWebAudioAPIOscillators(this);
    scene.add(this.mesh);
    this.delta = new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5);
    this.velocity = new THREE.Vector3(1,1,1);
    this.tailSize = 5;
    this.tail = [];
    var scaleFactor = 0.85;
    var scale = scaleFactor;
    for(let i = 0; i < tailSize; ++i) {
        let tailSegment = this.mesh.clone();
        tailSegment.scale.multiplyScalar(scale);
        scale *= scaleFactor;
        this.tail.push(tailSegment);
        scene.add(tailSegment);
    }
}

/**
 * Define a getter for the particle position from the 3D mesh
 */
Object.defineProperty(Particle.prototype, "position", {
  get: function() { return this.mesh.position }
});

/**
 * Create oscillators for a particle using the web audio api
 */
function createWebAudioAPIOscillators(particle) {
    // Web Audio API Oscillators
    particle.osc = {
        x: audioCtx.createOscillator(),
        y: audioCtx.createOscillator(),
        z: audioCtx.createOscillator(),
        gain: {
            x: audioCtx.createGain(),
            y: audioCtx.createGain(),
            z: audioCtx.createGain()
        }
    };
    particle.osc.gain.x.gain.value = 10;
    particle.osc.gain.y.gain.value = 50;
    particle.osc.gain.z.gain.value = 200;
    particle.osc.x.connect(particle.osc.gain.x);
    particle.osc.y.connect(particle.osc.gain.y);
    particle.osc.z.connect(particle.osc.gain.z);
    particle.osc.gain.x.connect(particle.osc.x.frequency);
    particle.osc.gain.y.connect(particle.osc.z.frequency);
    particle.osc.gain.z.connect(particle.osc.x.frequency);
    particle.osc.x.start();
    particle.osc.y.start();
    particle.osc.z.start();
}

/**
  * Go through all particles and add some (arbitrary) particles to
  * the left and right channels of the output
 */
function connectSources(connect) {

    particles.forEach((particle,i) => {
        if(i < 2) {
            if(connect)
                particle.osc.z.connect(leftChannelNode);
            else
                particle.osc.z.disconnect();
        }
        if(i > numParticles - 3 ){
            if(connect)
                particle.osc.z.connect(rightChannelNode);
            else
                particle.osc.z.disconnect();
        }
    });
}

/**
 * Update a particle every animation frame
 */
Particle.prototype.update = function(songBytes,index) {
    // Update color
    if(colors==='position') {
        this.mesh.material.color.x = this.position.x / cubeSize;
        this.mesh.material.color.y = this.position.y / cubeSize;
        this.mesh.material.color.z = this.position.z / cubeSize;
    }
    else if(colors==='random') {
        this.mesh.material.color.x = Math.random();
        this.mesh.material.color.y = Math.random();
        this.mesh.material.color.z = Math.random();
        if(index === numParticles-1)
            colors = 'none';
    }
    else if(colors==='epilepsy') {
        this.mesh.material.color.x = Math.random();
        this.mesh.material.color.y = Math.random();
        this.mesh.material.color.z = Math.random();
    }
    // Update tail positions
    for(let i = tailSize-1; i > 0; --i) {
        this.tail[i].position.x = this.tail[i-1].position.x;
        this.tail[i].position.y = this.tail[i-1].position.y;
        this.tail[i].position.z = this.tail[i-1].position.z;
        this.tail[i].material.color = this.mesh.material.color;
    }
    this.tail[0].position.x = this.position.x;
    this.tail[0].position.y = this.position.y;
    this.tail[0].position.z = this.position.z;
    this.tail[0].material.color = this.mesh.material.color;

    // Set scale (only works for the head)
    this.mesh.scale.set(scale,scale,scale);

    // Update particle position when a song is loaded
    if(loadedFile) {
        let convertByte = (b,i) => {
            if(vizType === 'fountain')
                return ((b/255-0.5)*cubeSize*4)+centerPoint;
            else {
                if(i===2)
                    return (b/255)*cubeSize;
                else
                    return (index/numParticles)*cubeSize;
            }
        };
        this.position.x = convertByte(songBytes[3*index+50],1);
        this.position.y = convertByte(songBytes[3*index+51],2);
        this.position.z = convertByte(songBytes[3*index+52],3);
    }
    // Update particle position according to swarm logic
    this.delta.add(new THREE.Vector3((Math.random()-0.5)*random,(Math.random()-0.5)*random,(Math.random()-0.5)*random));
    this.delta.multiplyScalar(dampingFactor);
    this.velocity = new THREE.Vector3(velocity,velocity,velocity);
    const deltaPos = new THREE.Vector3().multiplyVectors(this.delta,this.velocity);
    this.position.add(deltaPos);

    // Update oscillator frequncy according to particle movement
    if(this.osc) {
        this.osc.x.frequency.value = deltaPos.x * 100 + 400*(this.position.x/cubeSize);
        this.osc.y.frequency.value = deltaPos.y * 200 + 200*(this.position.y/cubeSize);
        this.osc.z.frequency.value = deltaPos.z * 400 + 100*(this.position.z/cubeSize);
    }
}

/**
 * Make particles avoid the given boundaries, and if they trespass it, make them
 * return to inside the boundaries.
 */
Particle.prototype.avoidBoundary = function(xSize, ySize, zSize, offset) {
    function avoidBoundaryCoord(particle, coord, size){
        if (particle.mesh.position[coord] < offset && particle.delta[coord] < 0) {
            particle.delta[coord] = -0.5 * particle.delta[coord];
        }
        if (particle.mesh.position[coord] > size-offset && particle.delta[coord] > 0) {
            particle.delta[coord] =  -0.5 * particle.delta[coord];
        }
    }
    avoidBoundaryCoord(this,'x',xSize);
    avoidBoundaryCoord(this,'y',ySize);
    avoidBoundaryCoord(this,'z',zSize);
}

/**
 * Create the attraction, reppelence and flocking behavior for particles
 */
Particle.prototype.flock = function(positionCenter, deltaCenter) {
    let diffPos = positionCenter.clone();
    let diffPosR = positionCenter.clone();
    let diffDelta = deltaCenter.clone();
    this.delta.add(diffPos.sub(this.position).multiplyScalar(attraction));
    this.delta.add(diffPosR.sub(this.position).multiplyScalar(-repellency));
    this.delta.add(diffDelta.sub(this.delta).multiplyScalar(flocking));

}

/**
 * Iterate through global particle array and update particles
 */
function updateParticles(particles) {
    // Update byte frequency data when a song is loaded
    if(loadedFile){
        analyser.getByteFrequencyData(file_fbc_array);
    }

    // Go through all particles updating them
    particles.forEach((particle,i)=>{
        particle.update(file_fbc_array,i);
        particle.avoidBoundary(cubeSize,cubeSize,cubeSize, 10);
    });
    // Update flocking and attraction based on neighbours
    particles.forEach((particle, index)=> {
        let positionCenter = new THREE.Vector3(0,0,0);
        let deltaCenter = new THREE.Vector3(0,0,0);
        let numNeighbors = 0;
        particles.forEach((neighbor, neighborIndex) => {
            if (index != neighborIndex) {
                const distance = neighbor.mesh.position.clone().sub(particle.mesh.position);
                if (Math.abs(distance.x) < radius &&
                    Math.abs(distance.y) < radius &&
                    Math.abs(distance.z) < radius)
                {
                    positionCenter.add(neighbor.mesh.position);
                    deltaCenter.add(neighbor.delta);
                    ++numNeighbors;
                }
            }
        });
        if (numNeighbors != 0)
        {
            positionCenter.divideScalar(numNeighbors);
            deltaCenter.divideScalar(numNeighbors);
            particle.flock(positionCenter,deltaCenter);
        }
    });
}
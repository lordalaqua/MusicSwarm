/*----------------------------------------------------------------------------*/
/*-------------------------  Program Execution -------------------------------*/

// Create the particles
for(var i = 0; i < numParticles; ++i) {
    particles.push(new Particle());
    ////////////////////////////////////////////////////////////////////////////
    // Lorenzo:
    // A conexão dos osciladores pode ser feita aqui na inicialização das partículas
    ////////////////////////////////////////////////////////////////////////////
    if(i > 0 && particles[i].osc) {
        particles[i-1].osc.gain.z.connect(particles[i].osc.x.frequency);
    }
}
// Connect the particle oscillators to the destination
connectSources(true);

/**
 * Main render and update loop
 */
function animate() {
    requestAnimationFrame( animate );
    controls.update();
    updateParticles(particles);
    renderer.render(scene, camera);
}

/*----------------------------------------------------------------------------*/
/*----------------------------- Tone.js Sound --------------------------------*/
////////////////////////////////////////////////////////////////////////////////
// Lorenzo:
// Eu removi esse código na versão com os osciladores da Web Audio API,
// mas eu moveria essa lógica pra uma função como a createWebAudioAPIOscillators
// onde os osciladores são adicionados ao objeto Particle
////////////////////////////////////////////////////////////////////////////////
// var oscs = [];

// for (var i = 0; i < numParticles; i++) {
//     var osc = new Tone.Oscillator(20, "sine")

//     oscs.push(osc);
// }

// var rngMap = function (num, in_min, in_max, out_min, out_max) {
//   return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
// }
// function updateSound(i, iBall){
//     // update one of ocilators based on the ball position
//     var os = oscs[i];
//     os.frequency.rampTo(rngMap(iBall.mesh.position.x, 0, cubeSize, 100, 440));
//     os.volume.rampTo(rngMap(iBall.mesh.position.y, 0, cubeSize, 0, -40));
// }


////////////////////////////////////////////////////////////////////////////////

function start(){
    ////////////////////////////////////////////////////////////////////////////////
    // Lorenzo: Mesma coisa aqui, mover essa lógica pra uma função de
    // inicialização dos osciladores por partícula
    ////////////////////////////////////////////////////////////////////////////////
    // // Need to stop oscillators when loadedFile is true
    // for(var i = 0; i < numParticles; i++) {
    //     oscs[i].toMaster().start();
    // }
    animate();
}

start();
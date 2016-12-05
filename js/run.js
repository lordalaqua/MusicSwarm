/*----------------------------------------------------------------------------*/
/*-------------------------  Program Execution -------------------------------*/

// Create the particles
for(var i = 0; i < numParticles; ++i) {
    particles.push(new Particle());
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

animate();
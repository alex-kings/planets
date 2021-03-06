import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { Planet } from "./Planet.js";

// Our array of planets
let planets = [];

// Event handlers for our scenarios
const s1 = document.getElementById("scenario 1");
const s2 = document.getElementById("scenario 2");
const s3 = document.getElementById("scenario 3");
const s4 = document.getElementById("scenario 4");
const s5 = document.getElementById("scenario 5");
s1.addEventListener("click",()=>{
    newScenario([new Planet(0.2,1,[0,-2,0],[1,0,-0.5],"Planet 1", "venus1"),
                new Planet(0.2,1,[2,0,0],[0,1,0.2],"Planet 2", "earth1"),
                new Planet(0.2,1,[0,4,0],[-3,-1,0.3],"Planet 2", "jupiter1")])
});
s2.addEventListener("click",()=>{
    newScenario([new Planet(1.2,10,[0,0,0],[0,0,0],"Planet 1", "sun"),
                new Planet(0.3,0.2,[0,0,4],[6,0,0],"Planet 2", "mars1"),
                new Planet(0.3,0.2,[0,4,0],[-8,0,0],"Planet 2", "venus2"),
                new Planet(0.2,0.05,[0,0,3],[4,-5,0],"planet","uranus1")]);
});
s3.addEventListener("click",()=>{
    newScenario([new Planet(0.6,10,[0,0,0],[0,0,0],"Planet 1", "uranus1"),
                new Planet(0.2,0.05,[0,2,0],[8,0,0],"Planet 2", "venus2"),
                new Planet(0.2,0.05,[0,3.6,0],[-8,0,0],"Planet 2", "jupiter1")])
});
s4.addEventListener("click",()=>{
    newScenario([new Planet(0.3,2,[-2,0,0],[0,-2,0],"Planet 1", "earth1"),
                new Planet(0.3,2,[2,0,0],[0,2,0],"Planet 1", "jupiter1"),
                new Planet(0.2,0.05,[0,0,-3],[4,0,0],"Planet 1", "mars1"),
                new Planet(0.2,0.05,[0,0,3],[-4,0,0],"Planet 1", "venus1"),
                new Planet(0.1,0.005,[0,0,0],[0.4,0,0],"Planet","venus2")]);
});
s5.addEventListener("click",()=>{
    newScenario([new Planet(2,5,[0,0,0],[0,-0.8,0],"Sun", "sun"),
                new Planet(0.4,1,[5,0,0],[0,5,0],"Earth", "uranus1"),
                new Planet(0.1,0.05,[5.8,0,0],[0,0,2],"Moon", "sun")])
})

/**
 * Creates a scenario with new planets filling the scene.
 * @param {Planet[]} newPlanets Planets to fill the scene with.
 */
function newScenario(newPlanets){
    planets.forEach((planet)=>{
        scene.remove(planet);
    })
    planets = newPlanets;
    planets.forEach((planet)=>{scene.add(planet)});
}

// Create renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("Jolycanvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

// Create scene
const scene = new THREE.Scene();

// Set lighting
scene.add(new THREE.AmbientLight("rgb(20,30,40)"));
const light = new THREE.DirectionalLight("rgb(255,255,255)");
light.position.set(40, 40, 40);
scene.add(light);

// Time interval since last render
let date = performance.now();
const physicsDt = 1/60;
let timeBuffer = 0;

// Render the scene
const render = () => {
    // Get dt
    const now = performance.now();
    let dt = (now - date);
    date = now;

    // Update time buffer
    timeBuffer += dt;
    if(timeBuffer >= physicsDt){
        timeBuffer -= physicsDt;
        // Do physics updates here
        planets.forEach((planet)=>{
            planet.updateSpeed(physicsDt,planets);
        })
        planets.forEach((planet)=>{
            planet.updatePosition(physicsDt)
        })
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};
render();

// Camera controls
document.addEventListener("keydown",(event)=>{
    let name = event.key;
    if(name === "a") {camera.position.x -= 0.1}
    if(name === "d") {camera.position.x += 0.1}
    if(name === "s") {camera.position.y -= 0.1}
    if(name === "w") {camera.position.y += 0.1}
    if(name === "q") {camera.position.z -= 0.1}
    if(name === "e") {camera.position.z += 0.1}
});


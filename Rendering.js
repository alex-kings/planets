import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { Planet } from "./Planet.js";

// Our array of planets
let planets = [];

// Event handlers for our scenarios
const s1 = document.getElementById("scenario 1");
const s2 = document.getElementById("scenario 2");
const s3 = document.getElementById("scenario 3");
const s4 = document.getElementById("scenario 4");
s1.addEventListener("click",()=>{
    newScenario([new Planet(0.2,1,[0,-2,0],[1,0,-0.5],"Planet 1", "rgb(35,170,170)"),
                new Planet(0.2,1,[2,0,0],[0,1,0.2],"Planet 2", "rgb(24,100,20)"),
                new Planet(0.2,1,[0,4,0],[-3,-1,0.3],"Planet 2", "rgb(170,45,55)")])
});
s2.addEventListener("click",()=>{
    newScenario([new Planet(1.2,10,[0,0,0],[0,0,0],"Planet 1", "rgb(255,255,255)"),
                new Planet(0.1,0.2,[0,0,4],[7,0,0],"Planet 2", "rgb(240,240,30)"),
                new Planet(0.1,0.2,[0,4,0],[-7,0,0],"Planet 2", "rgb(220,45,120)")]);
});
s3.addEventListener("click",()=>{
    newScenario([new Planet(0.4,10,[0,0,0],[0,0,0],"Planet 1", "rgb(35,170,170)"),
                new Planet(0.05,0.05,[0,2,0],[7,0,0],"Planet 2", "rgb(240,240,30)"),
                new Planet(0.05,0.05,[0,3.6,0],[-7,0,0],"Planet 2", "rgb(220,45,120)")])
});
s4.addEventListener("click",()=>{
    newScenario([new Planet(0.2,2,[-2,0,0],[0,-2,0],"Planet 1", "rgb(220,170,100)"),
                new Planet(0.2,2,[2,0,0],[0,2,0],"Planet 1", "rgb(35,170,170)"),
                new Planet(0.1,0.05,[0,0,-3],[4,0,0],"Planet 1", "rgb(255,20,20)"),
                new Planet(0.1,0.05,[0,0,3],[-4,0,0],"Planet 1", "rgb(255,20,20)"),
                new Planet(0.08,0.005,[0,0,0],[0.4,0,0],"Planet","rgb(0,0,255)")]);
});

/**
 * Creates a scenario with new planets filling the scene.
 * @param {Planet[]} newPlanets Planets to fill the scene with.
 */
function newScenario(newPlanets){
    scene.clear();
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
light.position.set(0, 40, 0);
scene.add(light);
const light2 = new THREE.DirectionalLight("rgb(255,255,255)");
light2.position.set(5, 0, 0);
scene.add(light2);

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


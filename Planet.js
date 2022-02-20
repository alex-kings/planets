import * as THREE from "https://cdn.skypack.dev/three@0.133.1";

class Planet extends THREE.Mesh{
    /**
     * @param {float} size The radius of the planet
     * @param {[x,y,z]} initialPos The initial position of the planet
     * @param {[vx,vy,vz]} initialSpeed The initial speed of the planet
     */
    constructor(size,mass,initialPos,initialSpeed,name, col){
        // Geometry and material
        const geo = new THREE.SphereGeometry(size);
        const mat = new THREE.MeshStandardMaterial( { color: col} );
        super(geo,mat)
        this.position.x = initialPos[0];
        this.position.y = initialPos[1];
        this.position.z = initialPos[2];
        this.speed = initialSpeed;
        this.mass = mass;
        this.name = name;
    }

    //constants
    G = 20;

    getPos(){
        return [this.position.x,this.position.y,this.position.z];
    }
    setPos(pos){
        this.position.x = pos[0];
        this.position.y = pos[1];
        this.position.z = pos[2];
    }

    /**
     * Calculates the gravitational force exerted on this planet by another one.
     * @param {Planet} planet The planet exerting force on this one.
     * @returns The force.
     */
    calculateForce(planet){
        let d2 = this.getDistSquared(planet)
        let Ftot = this.G*planet.mass*this.mass / d2
        let R = this.getVectorR(planet);
        return R.map((r)=>{return Ftot*(r)/Math.sqrt(d2)});
    }

    getDistSquared(planet){
        let A = planet.getPos();
        let B = this.getPos();
        return B.reduce((acc,i,j)=>{return (acc + (A[j] - i)**2)},0);
    }

    getVectorR(planet){
        return planet.getPos().map((pos,index)=>{
            return pos-this.getPos()[index];
        })
    }

    /**
     * Calculates the total gravitational force acting on this planet by an array of planets.
     * @param {[]} planets The array of planets.
     * @returns The total force acting on this planet.
     */
    totalForce(planets){
        let F = [0,0,0];
        planets.forEach((planet)=>{
            // Makes sure that we are not including this planet in the calculations.
            if(planet !== this){
                let force = this.calculateForce(planet);
                // Sum of the forces in one direction.
                for(let i = 0; i<F.length; i++){
                    F[i]+= force[i];
                }
            }
        });
        return F;
    }

    updateSpeed(dt,planets){
        let F = this.totalForce(planets);
        this.speed[0] += (F[0]*dt)/this.mass;
        this.speed[1] += (F[1]*dt)/this.mass;
        this.speed[2] += (F[2]*dt)/this.mass;
    }

    updatePosition(dt){
        this.position.x += this.speed[0]*dt;
        this.position.y += this.speed[1]*dt;
        this.position.z += this.speed[2]*dt;
    }
}

export {Planet};
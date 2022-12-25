import {
    AParticle,
    ASerializable,
    BasicParticleSystem2DModel,
    Color,
    Mat3,
    V2,
    Vec2,
    VertexArray2D, VertexAttributeArray2D, VertexIndexArray, VertexPositionArray2DH
} from "../../../../../anigraph";
import {Particle} from "./Particle";
import {PlayerModel} from "../Player";

enum AppStateKeys{
    ExampleParticleParam="ExampleParticleParam"
}

@ASerializable("ParticleSystem2DModel")
export class ParticleSystem2DModel extends BasicParticleSystem2DModel{
    static AppStateKeys = AppStateKeys;

    lastTime = 0;

    exampleParticleParam:number=1

    nParticles = 20; // TODO: Change depending on time or difficulty

    BPS = 3; // Bullets Per Second
    lastBullet = 0; // approx. value for t when last bullet spawned
    playerHeading = new Vec2(0, 1);

    bullets: Particle[] = [];

    gameOn = true;

    get particles(): Particle[] {
        return this._particles as Particle[];
    };

    getTransformForParticle(p: Particle): Mat3 {
        if (p.state == 10) {
            console.log(Mat3.Translation2D(p.position).times(Mat3.Scale2D(p.radius)));
        }
        return Mat3.Translation2D(p.position).times(Mat3.Scale2D(p.radius));
    }

    init(): void {
        for(let i=0;i<this.nParticles;i++){
            let p = new Particle(i, this.getRandomPosition(), Math.random() * 2 + 1, Color.Random());
            p.direction = this.getRandomDirection(p.position);
            this.particles.push(p);
        }
    }

    /** Picks the position that a particle will spawn at.
     * A particle will spawn in the space between a [-30,30]x[-30,30] grid and a [-15,15]x[-15,15] grid (~ size of canvas),
     * which will be off the canvas but close to its border. */
    getRandomPosition() : Vec2 {
        let x = Math.random() * 60 - 30; // number between -30 and 30
        let y = 0;
        let yPicker = x > 15 || x < -15? 0 : 1;
        if (yPicker == 0) { // x-coordinate falls outside of canvas
            // y-coordinate can be anything in [-30,30]
            y = Math.random() * 60 - 30;
        }
        else { // x-coordinate falls within the canvas
            let yPicker = Math.random(); // number between 0 and 1
            let yLeftRegion = Math.random() * 15 - 30; // number between -15 and -30
            let yRightRegion = Math.random() * 15 + 15; // number between 15 and 30
            y = yPicker > 0.5? yLeftRegion : yRightRegion;
        }
        return new Vec2(x,y);
    }

    /** Picks the direction the particle will go.
     * Point must pass through the [-10,10]x[-10,10] square at the center. */
    getRandomDirection(position: Vec2) : Vec2 {
        // get random point within the center 20x20 square
        let x = Math.random() * 20 - 10; // number between -10 and 10
        let y = Math.random() * 20 - 10; // number between -10 and 10

        // direction toward this random point
        let dir = new Vec2(x - position.x, y - position.y);

        //normalize direction
        dir.normalize();

        // velocity adjustment factor so not all particles travel at same speed
        let f = Math.random() + 1; // number between 1 and 2
        dir = dir.times(f);
        return dir;
    }


    getColorForParticle(p: Particle): Color {
        return p.color;
    }

    /** respawn a particle once it has gone across the canvas */
    recycleParticle(par: Particle) {
        par.state = 0;
        par.position = this.getRandomPosition();
        par.radius = Math.random() * 2 + 1;
        par.color = Color.Random();
        par.direction = this.getRandomDirection(par.position);
        //TODO: Perhaps when a particle respawns, there's a chance (dependant on difficulty
        //      that the particle count goes up? Whether it respawns due to it dying or due to it
        //      leaving the screen?
    }


    newTimeUpdate(t:number, player:PlayerModel):void {
        if (this.gameOn) {
            for(let p of this.particles){
                if (!this.gameOn) {
                    break;
                }
                //p.position = V2(Math.cos(t+p.id), Math.sin(t+p.id)).times(this.exampleParticleParam);
                var velocity_param = this.exampleParticleParam; //how much direction is scaled by

                // Change direction depending on how far from player
                var v = player.verts.clone();
                v.ApplyMatrix(player.getWorldTransform());
                // console.log(v);
                var avgX = 0;
                var avgY = 0;
                for (var i = 0; i < v.nVerts; i++) {
                    var vert = v.getPoint2DAt(i);
                    avgX += vert.x;
                    avgY += vert.y;
                }
                avgX /= v.nVerts;
                avgY /= v.nVerts;
                var center = new Vec2(avgX, avgY);
                // console.log(center.x, center.y);

                let part_center_x = p.position.x + (p.radius / 2);
                let part_center_y = p.position.y + (p.radius / 2);
                var pos = new Vec2(part_center_x, part_center_y);
                // console.log(pos.x, pos.y);

                var deltaDir = center.minus(pos);
                // console.log(deltaDir.x, deltaDir.y);

                // this should change the direction depending on how far they are
                var distance = Math.max(1.5, Math.sqrt((center.x - pos.x) ** 2 + (center.y - pos.y)**2));
                var weight = 0.05 // TODO: Change with difficulty

                // console.log(weight * (1 / distance));
                // console.log(p.direction.x, p.direction.y);
                var old_direction = p.direction;
                if (distance < 10) {
                    // p.color = new Color(255, 0, 0, 255);
                    p.direction = p.direction.plus(deltaDir.times(weight * (1 / ((distance) ** 2))));
                }
                else {
                    // p.color = new Color(0, 255, 0, 255);
                }
                // console.log(p.direction.x, p.direction.y);
                p.direction.normalize();

                var changeInPos = velocity_param * (t - this.lastTime);

                p.position = V2(p.position.x + p.direction.x * changeInPos, p.position.y + p.direction.y * changeInPos);

                p.direction = old_direction;

                var inCanvas = p.position.x > -15 && p.position.x < 15 && p.position.y > -15 && p.position.y < 15;
                if (p.state == 0 && inCanvas) {
                    // Checks for particle not being in canvas, and then entering
                    p.state = 1; // particle is now in the canvas
                }
                if (p.state == 1 && inCanvas) {
                    // Checks for particle being in canvas and colliding with another
                    for(let p2 of this.particles){
                        if (p != p2 && (p2.state == 1 || p2.state > 100)) {
                            var d = Math.sqrt((p.position.x - p2.position.x) ** 2 + (p.position.y - p2.position.y) ** 2);
                            if (d <= p.radius / 2 + p2.radius / 2) {
                                var old_p_r = p.radius;
                                var old_p2_r = p2.radius;
                                p.state = Math.max(100, 100 + (p.radius - p2.radius));
                                p2.state = Math.max(100, 100 + (p2.radius - p.radius));
                                var r = (p.color.r + p2.color.r) / 2;
                                var g = (p.color.g + p2.color.g) / 2;
                                var b = (p.color.b + p2.color.b) / 2;
                                var c = new Color(r, g, b);
                                p.color = c;
                                p2.color = c;
                            }
                        }
                    }
                }
                if (p.state >= 100) {
                    //Checks for particle having collided with another
                    if (p.color.a <= 0) {
                        p.state = 0;
                        this.recycleParticle(p)
                    }
                    if (p.state == 100) {
                        p.radius -= 0.02;
                        p.color = new Color(p.color.r, p.color.g, p.color.b, p.color.a - 0.03);
                        if (p.radius <= 0.1) {
                            p.state = 0;
                            this.recycleParticle(p);
                        }
                    }
                    else {
                        p.radius -= 0.02;
                        if (p.radius <= Math.max(p.state - 100), 1) {
                            p.state = 1;
                        }
                    }


                }
                if (!inCanvas && p.state == 1) { // particle just got off the canvas
                    this.recycleParticle(p);
                }
            }

            this.signalParticleUpdate();
            this.lastTime = t;
        }
    }

    // newTimeUpdate(t:number, player:PlayerModel):void {
    //     if (this.gameOn) {
    //         for (let p of this.particles) {
    //             //p.position = V2(Math.cos(t+p.id), Math.sin(t+p.id)).times(this.exampleParticleParam);
    //             var velocity_param = this.exampleParticleParam; //how much direction is scaled by
    //
    //
    //             // Player position
    //             // Change direction depending on how far from player
    //             var v = player.verts.clone();
    //             v.ApplyMatrix(player.getWorldTransform());
    //             // console.log(v);
    //             var avgX = 0;
    //             var avgY = 0;
    //             for (var i = 0; i < v.nVerts; i++) {
    //                 var vert = v.getPoint2DAt(i);
    //                 avgX += vert.x;
    //                 avgY += vert.y;
    //             }
    //             avgX /= v.nVerts;
    //             avgY /= v.nVerts;
    //             var center = new Vec2(avgX, avgY);
    //
    //             this.playerHeading = Mat3.Rotation(player._rotationVelocity).times(this.playerHeading);
    //             this.playerHeading.normalize();
    //             // console.log(this.playerHeading.x, this.playerHeading.y);
    //
    //             // If at least (1/BPS) seconds have gone by since a bullet has spawned
    //             if (t * this.BPS >= this.lastBullet + 1) {
    //                 // spawn bullet
    //                 var bullet = new Particle(100000 + this.lastBullet, center, 5, new Color(0, 0, 0, 255));
    //                 bullet.state = 1; // bullet state
    //                 bullet.direction = this.playerHeading;
    //                 this.lastBullet += 1;
    //                 this.bullets.push(bullet);
    //             }
    //             console.log(this.bullets.length);
    //             // Bullet states: 0: dead; 1: in-canvas, alive; 2: in-canvas, collided and fading; 3: completely dead
    //
    //             for (let p of this.bullets) {
    //                 //p.position = V2(Math.cos(t+p.id), Math.sin(t+p.id)).times(this.exampleParticleParam);
    //                 var velocity_param = this.exampleParticleParam; //how much direction is scaled by
    //
    //                 p.direction.normalize();
    //
    //                 var changeInPos = velocity_param * (t - this.lastTime);
    //
    //                 p.position = V2(p.position.x + p.direction.x * changeInPos, p.position.y + p.direction.y * changeInPos);
    //
    //                 // p.direction = old_direction;
    //
    //                 var inCanvas = p.position.x > -15 && p.position.x < 15 && p.position.y > -15 && p.position.y < 15;
    //
    //                 if (p.state == 0 && inCanvas) {
    //                     p.state = 1;
    //                 }
    //                 if (p.state == 1 && !inCanvas) {
    //                     // flew out the map
    //                     p.state = 0;
    //                 }
    //                 if (p.state == 1 && inCanvas) {
    //                     for (let p2 of this.particles) {
    //                         if (p2.state == 1 || p2.state > 100) {
    //                             var d = Math.sqrt((p.position.x - p2.position.x) ** 2 + (p.position.y - p2.position.y) ** 2);
    //                             if (d <= p.radius / 2 + p2.radius / 2) {
    //                                 p.state = 2;
    //                                 p2.state = 100 + p2.radius - 2;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 if (p.state == 2) {
    //                     p.radius -= 0.02;
    //                     if (p.radius <= 0.1) {
    //                         p.state = 3;
    //                     }
    //                 }
    //             }
    //
    //             for (let p of this.particles) {
    //                 //p.position = V2(Math.cos(t+p.id), Math.sin(t+p.id)).times(this.exampleParticleParam);
    //                 var velocity_param = this.exampleParticleParam; //how much direction is scaled by
    //
    //
    //                 // console.log(center.x, center.y);
    //                 var pos = p.position;
    //                 // console.log(pos.x, pos.y);
    //
    //                 var deltaDir = center.minus(pos);
    //                 // console.log(deltaDir.x, deltaDir.y);
    //
    //                 // this should change the direction depending on how far they are
    //                 var distance = Math.max(1.5, Math.sqrt((center.x - pos.x) ** 2 + (center.y - pos.y) ** 2));
    //                 var weight = 0.05 // TODO: Change with difficulty
    //
    //                 // console.log(weight * (1 / distance));
    //                 // console.log(p.direction.x, p.direction.y);
    //                 var old_direction = p.direction;
    //                 if (distance < 10) {
    //                     // p.color = new Color(255, 0, 0, 255);
    //                     p.direction = p.direction.plus(deltaDir.times(weight * (1 / ((distance) ** 2))));
    //                 } else {
    //                     // p.color = new Color(0, 255, 0, 255);
    //                 }
    //                 // console.log(p.direction.x, p.direction.y);
    //                 p.direction.normalize();
    //
    //                 var changeInPos = velocity_param * (t - this.lastTime);
    //
    //                 p.position = V2(p.position.x + p.direction.x * changeInPos, p.position.y + p.direction.y * changeInPos);
    //
    //                 p.direction = old_direction;
    //
    //                 var inCanvas = p.position.x > -15 && p.position.x < 15 && p.position.y > -15 && p.position.y < 15;
    //                 if (p.state == 0 && inCanvas) {
    //                     // Checks for particle not being in canvas, and then entering
    //                     p.state = 1; // particle is now in the canvas
    //                 }
    //                 if (p.state == 1 && inCanvas) {
    //                     // Checks for particle being in canvas and colliding with another
    //                     for (let p2 of this.particles) {
    //                         if (p != p2 && (p2.state == 1 || p2.state > 100)) {
    //                             var d = Math.sqrt((p.position.x - p2.position.x) ** 2 + (p.position.y - p2.position.y) ** 2);
    //                             if (d <= p.radius / 2 + p2.radius / 2) {
    //                                 var old_p_r = p.radius;
    //                                 var old_p2_r = p2.radius;
    //                                 p.state = Math.max(100, 100 + (p.radius - p2.radius));
    //                                 p2.state = Math.max(100, 100 + (p2.radius - p.radius));
    //                                 var r = (p.color.r + p2.color.r) / 2;
    //                                 var g = (p.color.g + p2.color.g) / 2;
    //                                 var b = (p.color.b + p2.color.b) / 2;
    //                                 var c = new Color(r, g, b);
    //                                 p.color = c;
    //                                 p2.color = c;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 if (p.state >= 100) {
    //                     //Checks for particle having collided with another
    //                     if (p.color.a <= 0) {
    //                         p.state = 0;
    //                         this.recycleParticle(p)
    //                     }
    //                     if (p.state == 100) {
    //                         p.radius -= 0.02;
    //                         p.color = new Color(p.color.r, p.color.g, p.color.b, p.color.a - 0.03);
    //                         if (p.radius <= 0.1) {
    //                             p.state = 0;
    //                             this.recycleParticle(p);
    //                         }
    //                     } else {
    //                         p.radius -= 0.02;
    //                         if (p.radius <= Math.max(p.state - 100), 1) {
    //                             p.state = 1;
    //                         }
    //                     }
    //
    //
    //                 }
    //                 if (!inCanvas && p.state == 1) { // particle just got off the canvas
    //                     this.recycleParticle(p);
    //                 }
    //             }
    //
    //             this.signalParticleUpdate();
    //             this.lastTime = t;
    //         }
    //     }
    // }

    getVertsForParticle(p: AParticle): VertexArray2D
        {
            console.log("Verts")
            let verts = new VertexArray2D();
            verts.position = new VertexPositionArray2DH();
            verts.position.push(V2(0, 0))
            verts.position.push(V2(1, 0))
            verts.position.push(V2(1, 1))
            verts.position.push(V2(0, 1))
            verts.uv = new VertexAttributeArray2D()
            verts.uv.push(V2(0, 0));
            verts.uv.push(V2(1, 0));
            verts.uv.push(V2(1, 1));
            verts.uv.push(V2(0, 1));
            verts.indices = new VertexIndexArray(3);
            verts.indices.push([0, 1, 2]);
            verts.indices.push([0, 2, 3]);
            return verts;
        }



}


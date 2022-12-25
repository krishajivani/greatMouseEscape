import {Color, Mat3, Mat4, V2, Vec2, VertexArray2D} from "../../../../anigraph";
import {LineSegment} from "./LineSegment";
import {Particle} from "../ParticleScene/particles";

export class Polygon2D extends VertexArray2D{

    static FromLists(positions:Vec2[], colors?:Color[]){
        let v = new this();
        if(colors===undefined) {
            v.addVertices(positions);
        }else{
            v.initColorAttribute()
            v.addVertices(positions, colors);
        }
        return v;
    }

    static Square(){
        return this.FromLists([
            V2(-1, -1),
            V2(1, -1),
            V2(1, 1),
            V2(-1, 1)
        ]);
    }

    /**
     * Returns a copy of the polygon with vertices that have been transformed by the provided matrix.
     * @param {Mat3 | Mat4} m
     * @returns {this}
     * @constructor
     */
    GetTransformedBy(m:Mat3|Mat4){
        let rval = this.clone();
        rval.ApplyMatrix(m);
        return rval;
    }


    /**
     * Returns the position of the vertex corresponding to the provided index
     * @param index - the index of the vertex you want
     * @returns {Vec2}
     */
    vertexAt(index:number):Vec2{
        return this.getPoint2DAt(index);
    }

    //##############################################################################################
    //#########################Below here students should implement#################################
    //##############################################################################################

    /**
     * Returns the edge corresponding to the provided index. Edges are simply arrays with two entries,
     * which give the endpoints of the edge.
     * You can get the ith vertex in the polygon boundary with `this.vertexAt(i)`
     * @param index
     * @returns {[Vec2, Vec2]}
     */
    edgeAt(index:number):LineSegment{
        let vertex1 = this.vertexAt(index);
        let vertex2 = this.vertexAt((index +1) % this.nVerts);

        let returnLS = new LineSegment(vertex1, vertex2);
        return returnLS;
    }

    /**
     * Returns all intersections with the provided line segment.
     * Should return a list of all intersection locations, which will be empty if no intersections exist.
     * @param segment
     */
    getIntersectionsWithSegment(segment:LineSegment):Vec2[]{
        let result = [];
        let i = 0
        while (i < this.nVerts) {
            let intersectCheck = this.edgeAt(i).intersect(segment);
            if (intersectCheck != undefined) {
                result.push(intersectCheck);
            }
            i++;
        }
        return result;
    }

    /**
     * Should detect any intersections with the provided polygon.
     * Should return a list of all intersection locations, which will be empty if no intersections exist.
     * @param other
     * @returns {Vec2[]}
     */
    getIntersectionsWithPolygon(other:Polygon2D){
        let result = [];
        let i = 0;
        while (i < this.nVerts) {
            let intersectCheck = this.getIntersectionsWithSegment(other.edgeAt(i));
            result.push(...intersectCheck);
            i++
        }
        return result;
    }

    /** Checks if there is an intersection between a particle and the player (circle-to-rectangle collision) */
    hasIntersectionWithParticle(particle:Particle) : boolean {

        let xs : number[] = [];
        let ys : number[] = [];

        let i = 0;
        while (i < this.nVerts) {
            let v = this.vertexAt(i);
            if (!(xs.includes(v.x))) {
                xs.push(v.x);
            }
            if (!(ys.includes(v.y))) {
                ys.push(v.y);
            }

            i++;
        }

        // find the closest point on the player (rectangle) to the particle (circle)
        let x_n = Math.max(xs[0], Math.min(particle.position.x, xs[1]));
        let y_n = Math.max(ys[0], Math.min(particle.position.y, ys[1]));

        // distance between closest point and particle center
        let x_center = particle.position.x + (particle.radius / 2);
        let y_center = particle.position.y + (particle.radius / 2);
        let dx = x_n - x_center;
        let dy = y_n - y_center;


        let res = (dx * dx) + (dy * dy) <= (particle.radius / 2) * (particle.radius / 2);
        return res;
    }
}




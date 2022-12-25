import {
    ANodeModelClass, ASceneModel,
    Mat3, Mat4, V2, Vec2, VertexArray2D
} from "../../../../anigraph";
import {Particle} from "../ParticleScene/particles";
import {Polygon2D} from "./Polygon2D";

export class Polygon2DModel extends ANodeModelClass<Mat3, Polygon2D>{
    _zValue: number = 0;
    lastUpdateTime:number=0;
    set zValue(value) {
        this._zValue = value;
        this.signalGeometryUpdate();
    }

    get zValue() {
        return this._zValue;
    }

    /**
     * Adds the provided Polygon2DModel as a child, and sets the child's parent to be this.
     * @param newChild
     */
    adoptChild(newChild:Polygon2DModel){
        newChild.reparent(this, false);
    }

    // constructor(verts?: VertexArray2D, transform?: Mat3, ...args: any[]) {
    //     super(...args);
    //     this._transform = transform??new Mat3();
    //     this._setVerts(verts??VertexArray2D.SquareXYUV());
    // }

    constructor(verts?: Polygon2D, transform?: Mat3, ...args: any[]) {
        super(...args);
        this._transform = transform??new Mat3();
        this._setVerts(verts??Polygon2D.Square());
    }

    get transform(): Mat3 {
        return this._transform as Mat3;
    }

    setTransform(transform: Mat3) {
        super.setTransform(transform);
    }

    getTransform3D() {
        let m4 = Mat4.From2DMat3(this.transform);
        m4.m23 = this.zValue;
        return m4;
    }


    /**
     * Should get the transform from the polygon's object coordinates (the coordinate system where this.verts is
     * defined) to world coordinates
     * @returns {Mat3}
     */
    getWorldTransform():Mat3{
        let parentToWorld = Mat3.Identity();
        let parent = this.parent;
        while(parent && parent instanceof Polygon2DModel){
            let parentModelMatrix = parent.transform;
            parentToWorld = parentModelMatrix.times(parentToWorld);
            parent = parent.parent;
        }
        return parentToWorld.times(this.transform.getMatrix());
    }

    /** Checks if the player has collided with a particle */
    isPlayerParticleCollision(particle: Particle):boolean {
        var v = this.verts.clone();
        v.ApplyMatrix(this.getWorldTransform());
        return v.hasIntersectionWithParticle(particle);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * Update function. You do not need to change this.
     * @param t
     */
    update(t:number){
        this.lastUpdateTime = t;
    }
}



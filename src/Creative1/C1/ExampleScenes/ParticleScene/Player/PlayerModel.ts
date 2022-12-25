import {
    ASerializable,
    Mat3,
    Mat4,
    V2,
    Vec2,
    VertexArray2D,
} from "../../../../../anigraph";
import {TexturedPolygon2DModel} from "../textured/TexturedPolygon2DModel";
import {Polygon2D} from "../../Polygon2D";

const HEADWIDTH = 0.4;
const HEADHEIGHT = 0.8;
const TURNSPEED=0.1;
const MOVESPEED = 0.1;


@ASerializable("PlayerModel")
export class PlayerModel extends TexturedPolygon2DModel {
    _velocity:Vec2;
    _rotationVelocity:number;
    get velocity(){
        return this._velocity;
    }
    set velocity(value:Vec2){
        this._velocity = value;
    }
    get rotationVelocity(){
        return this._rotationVelocity;
    }
    set rotationVelocity(value:number){
        this._rotationVelocity = value;
    }


    constructor(transform?: Mat3, textureMatrix?: Mat3 | Mat4) {
        super(undefined, transform, textureMatrix);
        this._velocity=V2();
        this._rotationVelocity = 0;
        this._setVerts(
            Polygon2D.FromLists([
                V2(-HEADWIDTH, -HEADHEIGHT),
                V2(HEADWIDTH, -HEADHEIGHT),
                V2(HEADWIDTH, HEADHEIGHT),
                V2(-HEADWIDTH, HEADHEIGHT)
            ])
        )
        this.textureMatrix = this.textureMatrix.times(Mat3.Scale2D([1/HEADWIDTH, 1/HEADHEIGHT]).Mat4From2DH());
    }
    update(t:number) {
        super.update(t);
        this.setTransform(
            this.transform.times(
                Mat3.Rotation(
                    this.rotationVelocity)
                    .times(Mat3.Translation2D(this.velocity)
                    )
            )
        );
    }

    onRightTurn(){
        this.rotationVelocity=-TURNSPEED;
    }
    onLeftTurn(){
        this.rotationVelocity=TURNSPEED;
    }
    onMoveForward(){
        this.velocity = V2(0,MOVESPEED);
    }
    onMoveBackward(){
        this.velocity = V2(0,-MOVESPEED);
    }

    onHaltRight(){
        this.rotationVelocity = Math.max(0,this.rotationVelocity);
    }
    onHaltLeft(){
        this.rotationVelocity = Math.min(0,this.rotationVelocity);
    }

    onHaltForward(){
        this.velocity = V2(0,Math.min(0,this.velocity.y));
    }
    onHaltBackward(){
        this.velocity = V2(0,Math.max(0,this.velocity.y));
    }


}

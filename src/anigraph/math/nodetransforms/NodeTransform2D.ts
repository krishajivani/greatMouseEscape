import { ASerializable } from "../../base";
import { NodeTransform } from "./NodeTransform";
import { Vec2, Vec3, Mat3, Mat4, Quaternion } from "../linalg";
import { Precision } from "../Precision";
import { NodeTransform3D } from "./NodeTransform3D";
import {Matrix4} from "three";

@ASerializable("NodeTransform2D")
export class NodeTransform2D implements NodeTransform<Vec2, Mat3> {
  public position!: Vec2;
  public anchor!: Vec2;
  public _scale!: Vec2;
  public rotation!: number;

  get scale(): Vec2 {
    return this._scale;
  }
  set scale(value: Vec2 | number) {
    if (value instanceof Vec2) {
      this._scale = value;
    } else {
      this._scale = new Vec2(value, value);
    }
  }

  constructor(position?: Vec2, rotation?: number, scale?: Vec2, anchor?: Vec2);
  constructor(matrix: Mat3, position?: Vec2);
  constructor(...args: any[]) {
    if (args[0] instanceof Mat3) {
      let pos = args.length > 1 ? args[1] : undefined;
      this.setWithMatrix(args[0], pos);
      if (!this.position) {
        this.position = new Vec2(0, 0);
      }
    } else {
      this.position = (args.length > 0) ? args[0] : new Vec2(0, 0);
      this.rotation = (args.length > 1) ? args[1] : 0;
      this.scale = (args.length > 2) ? args[2] : new Vec2(1, 1);
      this.anchor = (args.length > 3) ? args[3] : new Vec2(0, 0);
    }
  }

  clone() {
    return new NodeTransform2D(this.position.clone(),  this.rotation, this.scale.clone(), this.anchor.clone());
  }

  /**
   * Returns the transformation matrix for this set of transform properties.
   *
   * @returns the transformation matrix
   */
  getMatrix() {
    const position = Mat3.Translation2D(this.position);
    const rotation = Mat3.Rotation(this.rotation);
    const scale = Mat3.Scale2D(this.scale);
    const anchor = Mat3.Translation2D(this.anchor.times(-1));
    return position.times(rotation).times(scale).times(anchor);
  }

  getMat4(): Mat4 {
    return this.getMatrix().Mat4From2DH();
  }

  static FromMatrix(m:Mat3, position?:Vec2, useOldRotation?:boolean){
    let newNT = new NodeTransform2D();
    newNT.setWithMatrix(m, position, useOldRotation);
    return newNT;
  }


  /**
   * Sets the transform properties based on the given affine transformation
   * matrix and optional position.
   *
   * This function should set the transform based on an input matrix and
   * (optionally) a starting position. Calling T.getMatrix() on the resulting
   * transform should produce the input matrix `m`. Position should
   * be the point where changes to rotation or scale will rotate and scale around.
   * Meanings of position, rotation, scale, and anchor match those used in Adobe
   * standards (e.g., After Effects). The corresponding matrix is calculated
   * as shown in getMatrix() above: (P)*(R)*(S)*(-A). Position is specified as
   * a constraint because the two translations in the above equation create a
   * redundancy.
   *
   * We recommend familiarizing yourself with the available methods in
   * `src/anigraph/amath/Mat3.ts`.
   *
   * Also familiarize yourself with the available functions in
   * `src/anigraph/amath/Precision.ts`. These are useful when dealing with
   * floating point inaccuracies and other small numbers.
   *
   * Note: do not let the scale factor be less than epsilon.
   *
   * @param m the affine transformation matrix
   * @param position the starting positon
   */
  setWithMatrix(m:Mat3, position?:Vec2, useOldRotation?:boolean){
    // throw new Error("setWithMatrix not implemented yet! Wait for assignment 2!")

    //TODO: Don't leave this in!
    const ex = new Vec3(1,0,0);
    const ey = new Vec3(0,1,0);

    if(position !== undefined){
      this.position = position;
    }

    if(!useOldRotation) {
      const Mex = m.times(ex);
      this.rotation = Math.atan2(Mex.y, Mex.x);
    }

    const noRo = Mat3.Rotation(-this.rotation).times(m);
    const scaleX = noRo.times(ex);
    const scaleY = noRo.times(ey);
    this.scale = new Vec2(Precision.ClampAbsAboveEpsilon(scaleX.x), Precision.ClampAbsAboveEpsilon(scaleY.y));

    var ORSinv = Mat3.Translation2D(this.position).times(
        Mat3.Rotation(this.rotation).times(
            Mat3.Scale2D(this.scale)
        )
    ).getInverse();

    if(ORSinv===null){
      throw new Error(`tried to set transform with matrix that has zero determinant: ${m}`);
      return;
    }
    this.anchor = ORSinv.times(m).times(Vec3.From2DHPoint(new Vec2(0,0))).Point2D.times(-1);
  }

  NodeTransform3D(){
    let rval = new NodeTransform3D(
        new Vec3(this.position.x, this.position.y, 0),
        Quaternion.FromAxisAngle(new Vec3(0,0,1),this.rotation),
        new Vec3(this.scale.x, this.scale.y, 1),
        new Vec3(this.anchor.x, this.anchor.y, 0)
    );
    return rval;
  }

  NodeTransform2D(){
    return this;
  }

  assignTo(threejsMat: THREE.Matrix4) {
    this.getMat4().assignTo(threejsMat);
  }
}

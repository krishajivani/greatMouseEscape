import * as THREE from "three";
import { ASerializable } from "../../base";
import { NodeTransform } from "./NodeTransform";
import { V3, Vec3, Mat4, V4, Quaternion } from "../linalg";
import { Precision } from "../Precision";
import { NodeTransform2D } from "./NodeTransform2D";

@ASerializable("NodeTransform3D")
export class NodeTransform3D implements NodeTransform<Vec3, Mat4> {
  public position!: Vec3;
  public anchor!: Vec3;
  public _scale!: Vec3;
  public rotation!: Quaternion;

  get scale(): Vec3 {
    return this._scale;
  }
  set scale(value: Vec3 | number) {
    if (value instanceof Vec3) {
      this._scale = value;
    } else {
      this._scale = new Vec3(value, value, value);
    }
  }

  constructor(
    position?: Vec3,
    rotation?: Quaternion,
    scale?: Vec3,
    anchor?: Vec3
  );
  constructor(matrix: Mat4, position?: Vec3, rotation?: Quaternion);
  constructor(...args: any[]) {
    if (args[0] instanceof Mat4) {
      let pos = args.length > 1 ? args[1] : undefined;
      let rotation = args.length > 2 ? args[2] : undefined;
      this.setWithMatrix(args[0], pos, rotation);
      if (!this.position) {
        this.position = new Vec3(0, 0, 0);
      }
    } else {
      this.position = args.length > 0 ? args[0] : new Vec3(0, 0, 0);
      this.rotation = args.length > 1 ? args[1] : new Quaternion();
      this.scale = args.length > 2 ? args[2] : new Vec3(1, 1, 1);
      this.anchor = args.length > 3 ? args[3] : new Vec3(0, 0, 0);
    }
  }

  clone() {
    return new NodeTransform3D(
      this.position.clone(),
      this.rotation.clone(),
      this.scale.clone(),
      this.anchor.clone()
    );
  }

  NodeTransform3D() {
    return this.clone();
  }

  static FromPoseMatrix(mat: Mat4) {
    let translation = mat.c3;
    let rotationM = mat.clone();
    rotationM.c3 = V4(0, 0, 0, 1);
    let rotationQ = Quaternion.FromMatrix(rotationM);
    return new NodeTransform3D(translation.Point3D, rotationQ);
  }

  /**
   * Returns the transformation matrix for this set of transform properties.
   *
   * @returns the transformation matrix
   */
  getMatrix() {
    // return Mat4.Translation3D(this.position)
    //     .times(this.rotation.Mat4())
    //     .times(Mat4.Scale3D(this.scale))
    //     .times(Mat4.Translation3D(this.anchor.times(-1)));

    let P = Mat4.Translation3D(this.position);
    let R = this.rotation.Mat4();
    let S = Mat4.Scale3D(this.scale);
    let A = Mat4.Translation3D(this.anchor.times(-1));
    return P.times(R).times(S).times(A);
    // let m = new Matrix4();
    // m.compose(this.position.asThreeJS(),this.rotation, this.scale.asThreeJS());
    // let mobj = Mat4.FromThreeJS(m).getTranspose();
    // const anchor = Mat4.Translation3D(this.anchor.times(-1));
    // return mobj.times(anchor);
  }

  assignTo(threejsMat: THREE.Matrix4) {
    this.getMat4().assignTo(threejsMat);
  }

  getMat4(): Mat4 {
    return this.getMatrix();
  }

  static PoseProduct(lhs: NodeTransform3D, rhs: NodeTransform3D) {
    let nt = lhs.rotation.appliedTo(rhs.position).plus(lhs.position);
    let nr = lhs.rotation.times(rhs.rotation);
    return new NodeTransform3D(nt, nr);
  }

  getInverse() {
    let inv = new NodeTransform3D();
    inv.scale = V3(1 / this.scale.x, 1 / this.scale.y, 1 / this.scale.z);
    inv.rotation = this.rotation.getInverse();
    inv.position = inv.rotation
      .appliedTo(this.position.times(-1))
      .timesElementWise(inv.scale);
    return inv;
  }

  getRightMultipliedByRotation(r: Quaternion) {
    return new NodeTransform3D(this.position.clone(), this.rotation.times(r));
  }

  getLeftMultipliedByRotation(r: Quaternion) {
    return new NodeTransform3D(
      r.appliedTo(this.position),
      r.times(this.rotation)
    );
  }

  NodeTransform2D(cameraMatrix?: Mat4) {
    let P = cameraMatrix ? cameraMatrix : Mat4.Identity();
    let thisxvec = P.times(this.rotation.Mat4().c0);
    let p3d = P.times(this.position.Point3DH).Point3D;
    // let thisM = this.getMat4();
    return new NodeTransform2D(
      p3d.XY,
      Math.atan2(thisxvec.y, thisxvec.x),
      this.scale.XY,
      this.anchor.XY
    );
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
  setWithMatrix(m: Mat4, position?: Vec3, rotation?: Quaternion) {
    // throw new Error("setWithMatrix not implemented yet! Wait for assignment 2!")

    if (position !== undefined) {
      this.position = position;
    }

    // if(!this.rotation){
    //     this.rotation = Quaternion.FromMatrix(m).normalize();
    // }
    if (rotation) {
      this.rotation = rotation;
      // this.rotation.
      // this.rotation = Quaternion.Identity();
    } else {
      this.rotation = Quaternion.FromMatrix(m);
    }

    let PRSA = m;
    let RSA = Mat4.Translation3D(this.position.times(-1)).times(PRSA);
    let rmat = this.rotation.Mat4();
    let rimat = rmat.getInverse();

    const SA = rimat.times(RSA);
    this.scale = new Vec3(
      Precision.ClampAbsAboveEpsilon(SA.m00),
      Precision.ClampAbsAboveEpsilon(SA.m11),
      Precision.ClampAbsAboveEpsilon(SA.m22)
    );

    let P = Mat4.Translation3D(this.position);
    let R = rmat.clone();
    let S = Mat4.Scale3D(this.scale);
    let PRS = P.times(R).times(S);
    let PRSinv = PRS.getInverse();

    if (PRSinv === null) {
      throw new Error(
        `tried to set transform with matrix that has zero determinant: ${m}`
      );
      return;
    }
    this.anchor = PRSinv.times(m).c3.Point3D.times(-1);
  }

  static LookAt(location: Vec3, target: Vec3, up: Vec3) {
    let position = location;
    let look = target.minus(location).getNormalized();
    return new NodeTransform3D(position, Quaternion.FromVectors(look, up));

    // Leaving the code below for reference -- students can ignore

    // let look = target.minus(location);
    // let zneg = look.getNormalized().times(-1);
    // let r = zneg.cross(up).getNormalized();
    // let upn = zneg.cross(r)
    // let M = Mat4.FromColumns(
    //     r.Vec3DH,
    //     upn.Vec3DH,
    //     zneg.Vec3DH,
    //     location.Point3DH
    // )
    // could extract scale here
    // let position = location;
    // let R = Mat4.FromColumns(M.r0, M.r1,M.r2,V4(0,0,0,1));
    // let rotation = Quaternion.FromMatrix(R);
    // return new NodeTransform3D(position, rotation);
  }

  static PointToward(location: Vec3, target: Vec3, up: Vec3) {
    let position = location;
    let look = location.minus(target).getNormalized();
    return new NodeTransform3D(position, Quaternion.FromVectors(look, up));
  }

  static RotationZ(radians: number) {
    return new NodeTransform3D(
      new Vec3(0, 0, 0),
      Quaternion.RotationZ(radians)
    );
  }

  static FromMatrix(mat: Mat4, position?: Vec3, rotation?: Quaternion) {
    let T = new NodeTransform3D();
    T.setWithMatrix(mat, position, rotation);
    return T;
  }

  static FromThreeJSObject(obj: THREE.Object3D) {
    return new NodeTransform3D(
      Vec3.FromThreeJS(obj.position),
      Quaternion.FromQuaternion(obj.quaternion),
      Vec3.FromThreeJS(obj.scale)
    );
  }

  assignToObject3DPose(obj: THREE.Object3D) {
    obj.position.set(this.position.x, this.position.y, this.position.z);
    obj.quaternion.set(
      this.rotation.x,
      this.rotation.y,
      this.rotation.z,
      this.rotation.w
    );
    obj.scale.set(this.scale.x, this.scale.y, this.scale.z);
    this.getMatrix().assignTo(obj.matrix);
  }

  getObjectSpaceOrigin() {
    return this.getMatrix().times(V4(0, 0, 0, 1)).getHomogenized().Point3D;
  }
}

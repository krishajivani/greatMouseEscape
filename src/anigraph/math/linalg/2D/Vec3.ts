import * as THREE from "three";
import { VectorBase } from "../VectorBase";
import { Random } from "../../Random";
import { ASerializable } from "../../../base";
import { Vec2 } from "./Vec2";
import { Vec4 } from "../3D/Vec4";
import { Quaternion } from "../3D";

@ASerializable("Vec3")
export class Vec3 extends VectorBase {
  static N_DIMENSIONS: number = 3;
  public constructor(x: number, y: number, z: number);
  public constructor(elements?: Array<number>);
  public constructor(...args: Array<any>) {
    // common logic constructor
    super(...args);
  }

  toString() {
    return `Vec3(${this.x},${this.y},${this.z})`;
  }

  get nDimensions() {
    return 3;
  }

  get xy() {
    return new Vec2(this.elements[0], this.elements[1]);
  }
  set xy(value: Vec2) {
    this.elements[0] = value.x;
    this.elements[1] = value.y;
  }

  get z() {
    return this.elements[2];
  }
  set z(val: number) {
    this.elements[2] = val;
  }
  get h() {
    return this.elements[2];
  }
  set h(val: number) {
    this.elements[2] = val;
  }

  // get i(){
  //     return this.elements[0];
  // }
  // get j(){
  //     return this.elements[1];
  // }
  // get k(){
  //     return this.elements[2];
  // }

  _setToDefault() {
    this.elements = [0, 0, 0];
  }

  /**
   * Cross product of this with other
   * @param other
   * @returns {Vec3}
   */
  cross(other: Vec3): Vec3 {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  homogenize() {
    if (this.h === 1 || this.h === 0) {
      return;
    }
    let ooh: number = 1.0 / this.h;
    this.elements[0] = this.elements[0] * ooh;
    this.elements[1] = this.elements[1] * ooh;
    this.h = 1;
  }

  getHomogenized() {
    const h = this.clone();
    h.homogenize();
    return h;
  }

  get XY() {
    return new Vec2(this.x, this.y);
  }

  get Point2D() {
    let h = this.getHomogenized();
    return new Vec2(h.x, h.y);
  }
  get Point3DH() {
    return new Vec4(this.x, this.y, this.z, 1);
  }

  get Vec3DH() {
    return new Vec4(this.x, this.y, this.z, 0);
  }

  static From2DHPoint(p: Vec2) {
    return new Vec3(p.x, p.y, 1.0);
  }
  static FromVec2(p: Vec2) {
    return new Vec3(p.x, p.y, 0.0);
  }

  static Random() {
    var r = new this(Random.floatArray(3));
    return r;
  }

  static FromThreeJS(vec: THREE.Vector3) {
    return new this(vec.x, vec.y, vec.z);
  }

  sstring() {
    return `[${this.x},${this.y},${this.z}]`;
  }

  asThreeJS() {
    return new THREE.Vector3(this.x, this.y, this.z);
  }

  getRotatedByQuaternion(q: Quaternion) {
    const x = this.x,
      y = this.y,
      z = this.z;
    const qx = q.x,
      qy = q.y,
      qz = q.z,
      qw = q.w;

    // calculate quat * vector
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    let rval = new Vec3();
    rval.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    rval.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    rval.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return rval;
  }
}

export function V3(...elements: any[]) {
  return new Vec3(...elements);
}

function _Vec2DH(x: number, y: number) {
  return new Vec3(x, y, 0);
}
function _Point2DH(x: number, y: number) {
  return new Vec3(x, y, 1);
}

export function Vec2DH(x: number, y: number): Vec3;
export function Vec2DH(vec2: Vec2): Vec3;
export function Vec2DH(xy: [number, number]): Vec3;
export function Vec2DH(...args: any[]) {
  if (args[0] instanceof VectorBase) {
    return _Vec2DH(args[0].x, args[0].y);
  } else if (Array.isArray(args[0])) {
    return _Vec2DH(args[0][0], args[0][1]);
  } else {
    return _Vec2DH(args[0], args[1]);
  }
}

export function Point2DH(x: number, y: number): Vec3;
export function Point2DH(vec2: Vec2): Vec3;
export function Point2DH(xy: [number, number]): Vec3;
export function Point2DH(...args: any[]) {
  if (args[0] instanceof VectorBase) {
    return _Point2DH(args[0].x, args[0].y);
  } else if (Array.isArray(args[0])) {
    return _Point2DH(args[0][0], args[0][1]);
  } else {
    return _Point2DH(args[0], args[1]);
  }
}


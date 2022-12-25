import { VectorBase } from "../VectorBase";
import { Random } from "../../Random";
import { ASerializable } from "../../../base";
import { Vec2} from "../2D/Vec2";
import {Vec3} from "../2D/Vec3";
import { Precision } from "../../Precision";

import * as THREE from "three";

@ASerializable("Vec4")
export class Vec4 extends VectorBase{
    static N_DIMENSIONS:number=4;
    public constructor(x: number, y: number, z: number, h:number);
    public constructor(elements?: Array<number>);
    public constructor(...args: Array<any>) { // common logic constructor

        super(...args);
    }

  toString() {
    return `Vec4(${this.x},${this.y},${this.z},${this.h})`;
  }

  get nDimensions() {
    return 4;
  }

  static i() {
    return new Vec4(1, 0, 0, 0);
  }
  static j() {
    return new Vec4(0, 1, 0, 0);
  }
  static k() {
    return new Vec4(0, 0, 1, 0);
  }
  static h() {
    return new Vec4(0, 0, 0, 1);
  }

  static FromPoint2DXY(v2: Vec2) {
    return new Vec4(v2.x, v2.y, 0.0, 1.0);
  }
  static FromVec2DXY(v2: Vec2) {
    return new Vec4(v2.x, v2.y, 0.0, 0.0);
  }

  get z() {
    return this.elements[2];
  }
  set z(val: number) {
    this.elements[2] = val;
  }
  get h() {
    return this.elements[3];
  }
  set h(val: number) {
    this.elements[3] = val;
  }

  homogenize() {
    if (this.h === 1 || Precision.isTiny(this.h)) {
      return;
    }
    let ooh: number = 1.0 / this.h;
    this.elements[0] = this.elements[0] * ooh;
    this.elements[1] = this.elements[1] * ooh;
    this.elements[2] = this.elements[2] * ooh;
    this.h = 1;
  }

  _setToDefault() {
    this.elements = [0, 0, 0, 0];
  }

  getHomogenized() {
    const h = this.clone();
    h.homogenize();
    return h;
  }

  get Point3D() {
    let h = this.getHomogenized();
    return new Vec3(h.x, h.y, h.z);
  }

  static Random() {
    var r = new this(Random.floatArray(4));
    return r;
  }

  sstring() {
    return `[${this.x},${this.y},${this.z}]`;
  }

  asThreeJS() {
    return new THREE.Vector4(this.x, this.y, this.z, this.h);
  }
}

export function V4(x:number, y:number, z:number, h:number){
    return new Vec4(x,y,z,h);
// export function V4(...elements:any[]){
//     return new Vec4(...elements);
}
export function V4A(...elements:any[]){
    return new Vec4(...elements);
}

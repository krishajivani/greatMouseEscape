import {
  VertexAttributeArray,
  VertexAttributeArray2D,
  VertexAttributeArray3D,
  VertexAttributeArray4D,
  VertexPositionArray2DH,
} from "./VertexAttributeArray";
import {VectorBase, Mat3, Mat4, Vec2} from "../linalg";
import { HasBounds} from "./HasBounds";
import { BoundingBox3D } from "./BoundingBox3D";
import { VertexIndexArray } from "./VertexIndexArray";

enum ATTRIBUTE_NAMES{
  COLOR="color",
  NORMAL="normal",
  POSITION="position",
  UV="uv",
  INDEX="index"
}

export abstract class VertexArray<VType extends VectorBase> implements HasBounds {
  static AttributeNames = ATTRIBUTE_NAMES;
  public attributes: { [name: string]: VertexAttributeArray<any> } = {};
  public indices!: VertexIndexArray;

  /** Get set position */
  set position(
    value:
      | VertexPositionArray2DH
      | VertexAttributeArray3D
      | VertexAttributeArray4D
  ) {
    this.attributes[VertexArray.AttributeNames.POSITION] = value;
  }
  get position() {
    return this.attributes[VertexArray.AttributeNames.POSITION] as
      | VertexPositionArray2DH
      | VertexAttributeArray3D
      | VertexAttributeArray4D;
  }

  /** Get set normal */
  set normal(value: VertexAttributeArray3D) {
    this.attributes[VertexArray.AttributeNames.NORMAL] = value;
  }
  get normal() {
    return this.attributes[VertexArray.AttributeNames.NORMAL] as VertexAttributeArray3D;
  }

  // /** Get set color */
  set color(value: VertexAttributeArray<any>) {
    this.attributes[VertexArray.AttributeNames.COLOR] = value;
  }
  get color() {
    return this.attributes[VertexArray.AttributeNames.COLOR];
  }

  /** Get set uv */
  set uv(value: VertexAttributeArray2D) {
    this.attributes[VertexArray.AttributeNames.UV] = value;
  }
  get uv() {
    return this.attributes[VertexArray.AttributeNames.UV];
  }

  abstract addVertex(v: VType | any): void;
  abstract getBounds(): BoundingBox3D;
  protected _uid: string = "";

  getAttributeArray(name: string) {
    return this.attributes[name];
  }

  ApplyMatrix(m: Mat3 | Mat4) {
    this.position.ApplyMatrix(m);
    if (this.normal) {
      let m4 = m instanceof Mat4 ? m : Mat4.From2DMat3(m);
      let mnorm = m4.getInverse()?.getTranspose();
      if (!mnorm) {
        throw new Error(`tried to apply singular matrix to normals...`);
      }
      this.normal.ApplyMatrix(mnorm);
    }
  }

  GetTransformedBy(m:Mat3|Mat4){
    let rval = this.clone();
    rval.ApplyMatrix(m);
    return rval;
  }

  get uid() {
    return this._uid;
  }

  /**
   * Returns the number of vertices
   * @returns {number}
   */
  get nVerts():number{
    return this.position.nVerts;
  }

  clone(): this {
    let cfunc: any = this.constructor as any;
    let clone = new cfunc();
    for (let atr in this.attributes) {
      clone.attributes[atr] = this.attributes[atr].clone();
    }
    if(this.indices) {
      clone.indices = this.indices.clone();
    }
    return clone;
  }

  toJSON() {
    var rval: { [name: string]: any } = {};
    for (let k in this) {
      // @ts-ignore
      rval[k] = this[k];
    }
    return rval;
  }
}

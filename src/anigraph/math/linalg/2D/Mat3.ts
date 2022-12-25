import { Matrix } from "../Matrix";
import {Vector, VectorBase} from "../VectorBase";
import { Vec3 } from "./Vec3";
import { Vec2 } from "./Vec2";
import { Mat4 } from "../3D";
import assert from "assert";
import { Random } from "../../Random";
import { ASerializable } from "../../../base";

@ASerializable("Mat3")
export class Mat3 extends Matrix {
  public constructor();
  public constructor(
    m00: number,
    m01: number,
    m02: number,
    m10: number,
    m11: number,
    m12: number,
    m20: number,
    m21: number,
    m22: number
  );
  public constructor(elements?: Array<number>);
  public constructor(...args: Array<any>) {
    // common logic constructor
    super(...args);
  }

  /***
   * Returns the element of the matrix in the position [row, col]
   */
  getElement(row: number, col: number): number {
    return this.elements[3 * row + col];
  }

  /***
   * Sets this matrix to be the identity matrix.
   */
  setToIdentity() {
    this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  /**
   * For function `mxy()`, gets or sets the element of the matrix at the
   * position [x, y]
   */
  set m00(value) {
    this.elements[0] = value;
  }
  get m00() {
    return this.elements[0];
  }
  set m01(value) {
    this.elements[1] = value;
  }
  get m01() {
    return this.elements[1];
  }
  set m02(value) {
    this.elements[2] = value;
  }
  get m02() {
    return this.elements[2];
  }
  set m10(value) {
    this.elements[3] = value;
  }
  get m10() {
    return this.elements[3];
  }
  set m11(value) {
    this.elements[4] = value;
  }
  get m11() {
    return this.elements[4];
  }
  set m12(value) {
    this.elements[5] = value;
  }
  get m12() {
    return this.elements[5];
  }
  set m20(value) {
    this.elements[6] = value;
  }
  get m20() {
    return this.elements[6];
  }
  set m21(value) {
    this.elements[7] = value;
  }
  get m21() {
    return this.elements[7];
  }
  set m22(value) {
    this.elements[8] = value;
  }
  get m22() {
    return this.elements[8];
  }

  /**
   * For function `cx()`, gets or sets the `x`th column of the matrix.
   */
  set c0(value: Vec3) {
    this.m00 = value.x;
    this.m10 = value.y;
    this.m20 = value.z;
  }
  get c0() {
    return new Vec3(this.m00, this.m10, this.m20);
  }
  set c1(value: Vec3) {
    this.m01 = value.x;
    this.m11 = value.y;
    this.m21 = value.z;
  }
  get c1() {
    return new Vec3(this.m01, this.m11, this.m21);
  }
  set c2(value: Vec3) {
    this.m02 = value.x;
    this.m12 = value.y;
    this.m22 = value.z;
  }
  get c2() {
    return new Vec3(this.m02, this.m12, this.m22);
  }

  /**
   * For function `ry()`, gets or sets the `y`th row of the matrix.
   */
  set r0(value: Vec3) {
    this.m00 = value.x;
    this.m01 = value.y;
    this.m02 = value.z;
  }
  get r0() {
    return new Vec3(this.m00, this.m01, this.m02);
  }
  set r1(value) {
    this.m10 = value.x;
    this.m11 = value.y;
    this.m12 = value.z;
  }
  get r1() {
    return new Vec3(this.m10, this.m11, this.m12);
  }

  set r2(value) {
    this.m20 = value.x;
    this.m21 = value.y;
    this.m22 = value.z;
  }
  get r2() {
    return new Vec3(this.m20, this.m21, this.m22);
  }

  /**
   * Returns this matrix made up of the columns `c0`, `c1`, `c2`.
   *
   * @param c0 The first column
   * @param c1 The second column
   * @param c2 The third column
   * @returns this matrix with the specified columns
   */
  static FromColumns(c0: Vec3, c1: Vec3, c2: Vec3) {
    var r = new this();
    r.c0 = c0;
    r.c1 = c1;
    r.c2 = c2;
    return r;
  }
  /**
   * Returns this matrix made up of the rows `r0`, `r1`, `r2`.
   *
   * @param c0 The first row
   * @param c1 The second row
   * @param c2 The third row
   * @returns this matrix with the specified rows
   */
  static FromRows(r0: Vec3, r1: Vec3, r2: Vec3) {
    var r = new this();
    r.r0 = r0;
    r.r1 = r1;
    r.r2 = r2;
    return r;
  }

  //##################//--TransformationMatrices--\\##################
  //<editor-fold desc="TransformationMatrices">

  /**
   * Returns a new identity matrix.
   *
   * @returns a new identity matrix
   */
  static Identity() {
    return new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  //##################//--fill matrices--\\##################
  //<editor-fold desc="fill matrices">

  /**
   * Returns a matrix with random floats for each element
   *
   * @returns a matrix with random elements
   */
  static Random() {
    var r = new this(Random.floatArray(9));
    return r;
  }

  /**
   * Returns a matrix with all zeros
   *
   * @returns a matrix with all zeros
   */
  static Zeros() {
    let z = new Array(9);
    for (let i = 0; i < 9; ++i) z[i] = 0;
    var r = new this(z);
    return r;
  }

  /**
   * Returns a matrix with all ones
   *
   * @returns a matrix with all ones
   */
  static Ones() {
    let z = new Array(9);
    for (let i = 0; i < 9; ++i) z[i] = 1;
    var r = new this(z);
    return r;
  }
  //</editor-fold>
  //##################\\--fill matrices--//##################

  getTranspose() {
    let transpose = new Mat3();
    transpose.c0 = this.r0;
    transpose.c1 = this.r1;
    transpose.c2 = this.r2;
    return transpose;
  }

  //##################//--Determinant and Inverse--\\##################
  //<editor-fold desc="Determinant and Inverse">

  /**
   * Calculate inverse... I just used Two.js's method here.
   * @returns {null|Matrix3x3}
   */
  getInverse():Mat3{
    var a = this.elements;
    var out = new Mat3();

    var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
    var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
    var a20 = a[6],
      a21 = a[7],
      a22 = a[8];

    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20;

    // Calculate the determinant
    var det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      // console.warn("Matrix had determinant 0!");
      throw new Error("Matrix had determinant 0! Inverse undefined!");
      // return null;
    }

    det = 1.0 / det;

    out.elements[0] = b01 * det;
    out.elements[1] = (-a22 * a01 + a02 * a21) * det;
    out.elements[2] = (a12 * a01 - a02 * a11) * det;
    out.elements[3] = b11 * det;
    out.elements[4] = (a22 * a00 - a02 * a20) * det;
    out.elements[5] = (-a12 * a00 + a02 * a10) * det;
    out.elements[6] = b21 * det;
    out.elements[7] = (-a21 * a00 + a01 * a20) * det;
    out.elements[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }

  /**
   * Returns the determinant for this matrix.
   *
   * @returns the determinant
   */
  determinant() {
    var b01 = this.m22 * this.m11 - this.m12 * this.m21;
    var b11 = -this.m22 * this.m10 + this.m12 * this.m20;
    var b21 = this.m21 * this.m10 - this.m11 * this.m20;
    return this.m00 * b01 + this.m01 * b11 + this.m02 * b21;
  }

  //</editor-fold>
  //##################\\--Determinant and Inverse--//##################

  times(other: Mat3): Mat3;
  times(other: number): Mat3;
  times(other: Vec3): Vec3;
  times(other: Vec2): Vec2;
  times(other: VectorBase | Mat3 | number): VectorBase | Mat3 {
    if (other instanceof Mat3) {
      return this._timesMatrix(other);
    } else if (other instanceof Vec2 || other instanceof Vec3) {
      return this._timesVector(other);
    } else if (typeof other === "number") {
      let cfunc: any = this.constructor as any;
      var m: this = new cfunc();
      for (let i = 0; i < m.elements.length; i++) {
        m.elements[i] = this.elements[i] * other;
      }
      return m;
    }
    throw new Error(
      "Tried to do Matrix.times(other) with other not a matrix, vector, or scalar..."
    );
  }

  /**
   * if it's a Vec3 we do regular matrix vector multiplication. If it's a Vec2, we treat it as a point and add a
   * homogeneous value of 1, then do the multiplication, then homogenize and drop the homogeneous coordinate to return
   * a new Vec2.
   * @param v
   * @returns {Vec3 | Vec2}
   * @private
   */
  protected _timesVector(v: Vec3 | Vec2): Vec3 | Vec2 {
    if (v instanceof Vec3) {
      return new Vec3(
        v.elements[0] * this.elements[0] +
          v.elements[1] * this.elements[1] +
          v.elements[2] * this.elements[2],
        v.elements[0] * this.elements[3] +
          v.elements[1] * this.elements[4] +
          v.elements[2] * this.elements[5],
        v.elements[0] * this.elements[6] +
          v.elements[1] * this.elements[7] +
          v.elements[2] * this.elements[8]
      );
    } else {
      let v3out = new Vec3(
        v.elements[0] * this.elements[0] +
          v.elements[1] * this.elements[1] +
          this.elements[2],
        v.elements[0] * this.elements[3] +
          v.elements[1] * this.elements[4] +
          this.elements[5],
        v.elements[0] * this.elements[6] +
          v.elements[1] * this.elements[7] +
          this.elements[8]
      );
      return v3out.Point2D;
    }
  }
  protected _timesMatrix(m: Mat3): Mat3 {
    let cfunc: any = this.constructor as any;
    return new cfunc([
      this.elements[0] * m.elements[0] +
        this.elements[1] * m.elements[3] +
        this.elements[2] * m.elements[6],
      this.elements[0] * m.elements[1] +
        this.elements[1] * m.elements[4] +
        this.elements[2] * m.elements[7],
      this.elements[0] * m.elements[2] +
        this.elements[1] * m.elements[5] +
        this.elements[2] * m.elements[8],
      this.elements[3] * m.elements[0] +
        this.elements[4] * m.elements[3] +
        this.elements[5] * m.elements[6],
      this.elements[3] * m.elements[1] +
        this.elements[4] * m.elements[4] +
        this.elements[5] * m.elements[7],
      this.elements[3] * m.elements[2] +
        this.elements[4] * m.elements[5] +
        this.elements[5] * m.elements[8],
      this.elements[6] * m.elements[0] +
        this.elements[7] * m.elements[3] +
        this.elements[8] * m.elements[6],
      this.elements[6] * m.elements[1] +
        this.elements[7] * m.elements[4] +
        this.elements[8] * m.elements[7],
      this.elements[6] * m.elements[2] +
        this.elements[7] * m.elements[5] +
        this.elements[8] * m.elements[8],
    ]);
  }
  toJSON() {
    var rval: { [name: string]: any } = {};
    for (let k in this) {
      // @ts-ignore
      rval[k] = this[k];
    }
    return rval;
  }

  asPrettyString(precision: number = 4): string {
    return `Mat3 in Row Major Form:\n
        ${this.elements[0].toPrecision(
          precision
        )}, ${this.elements[1].toPrecision(
      precision
    )}, ${this.elements[2].toPrecision(precision)}\n
        ${this.elements[3].toPrecision(
          precision
        )}, ${this.elements[4].toPrecision(
      precision
    )}, ${this.elements[5].toPrecision(precision)}\n
        ${this.elements[6].toPrecision(
          precision
        )}, ${this.elements[7].toPrecision(
      precision
    )}, ${this.elements[8].toPrecision(precision)}\n
        `;
  }

  Mat4From2DH() {
    return Mat4.From2DMat3(this);
  }

  assignTo(threejsMat: THREE.Matrix4){
    console.error("Should not be using Mat3.assignTo! Ambiguous whether linear or homogeneous!")
    this.Mat4Linear().assignTo(threejsMat);
  }

  Mat4Linear() {
    return Mat4.FromMat3Linear(this);
  }

  logTable(){
    console.table({
      'row0': this.r0,
      'row1': this.r1,
      'row2': this.r2
    })
  }


  /**
   * Returns the corresponding 3D scale transformation matrix given the scaling
   * factor.
   *
   * If factor is a number, then uses the factor for scaling in the x and y
   * direction.
   * If factor is an array of length three, then uses the factor[0] as the x
   * direction, factor[1] as the y direction, and factor[2] as the z-direction.
   * If factor is a `Vec3`, then uses the factor[0] as the x-direction,
   * factor[1] as the y-direction, and factor[2] as the z-direction.
   *
   * @param factor the scaling factor
   */
  public static Scale3D(factor:number):Mat3;
  public static Scale3D(factors:Array<number>):Mat3;
  public static Scale3D(factors:Vec3):Mat3;
  public static Scale3D(...args:any[]):Mat3 {
    function scalematfromarray(a:Array<number>) {
      let rmat = new Mat3();
      if (a.length > 0) {
        rmat.elements[0] = a[0];
        if (a.length > 1) {
          rmat.elements[4] = a[1];
          if (a.length > 2) {
            assert(a.length === 3, "Scale arguments too long");
            rmat.elements[8] = a[2];
          }
        }
      }
      return rmat;
    }

    assert(args.length>0, "Cannot call Mat3.Scale() with no arguments");
    if(typeof args[0] === "number") {
      let rmat = new Mat3();
      rmat.m00=args[0];
      rmat.m11=args[0];
      rmat.m22=args[0];
      return rmat;
    } else if(Array.isArray(args[0])) {
      return scalematfromarray(args[0]);
    }else if(args[0] instanceof Vec3){
      return scalematfromarray(args[0].elements);
    }else {
      return scalematfromarray(args);
    }
  }

  /**
   * Returns the corresponding 2D scale transformation matrix for the given
   * scaling factor.
   *
   * If `factor` is a `number`, then uses the factor for scaling in the x and
   * y directions.
   * If `factor` is an `array` of length two, then uses the factor[0] as the x
   * direction and factor[1] as the y-direction.
   * If `factor` is a `Vec2`, then uses the factor[0] as the x-direction and
   * factor[1] as the y-direction.
   *
   * @param factor the scaling factor
   */
  public static Scale2D(factors:Array<number>):Mat3;
  public static Scale2D(factor:number|Vector):Mat3;
  public static Scale2D(factors:Vec2):Mat3;
  public static Scale2D(...args:Array<any>):Mat3 {
    function scalematfromarray(a:Array<number>) {
      let rmat = new Mat3();
      if (a.length > 0) {
        rmat.elements[0] = a[0];
        if (a.length > 1) {
          assert(a.length === 2, "Scale2D arguments too long");
          rmat.elements[4] = a[1];
        }
      }
      return rmat;
    }
    assert(args.length>0, "Cannot call Mat3.Scale2D() with no arguments");
    if(typeof args[0] === "number") {
      let rmat = new Mat3();
      rmat.m00=args[0];
      rmat.m11=args[0];
      return rmat;
    } else if(Array.isArray(args[0])) {
      return scalematfromarray(args[0]);
    }else if(args[0] instanceof Vec2){
      return scalematfromarray(args[0].elements);
    }else {
      return scalematfromarray(args);
    }
  }

  /**
   * Returns the corresponding 2D translation transformation matrix for the
   * given translation `t` or `x` and `y`.
   *
   * If the argument is `x` and `y`, then it translates in the x-direction `x`
   * amount and in the y-direction `y` amount.
   * If `t` is an `array` of length two, then uses the t[0] as the x-direction
   * and t[1] as the y-direction.
   * If `t` is a `Vec2`, then uses the t[0] as the x-direction and t[1] as the
   * y-direction.
   *
   * @param t the translation factor
   */
  public static Translation2D(t:Array<number>):Mat3;
  public static Translation2D(t:Vec2):Mat3;
  public static Translation2D(x:number,y:number):Mat3
  public static Translation2D(...args:Array<any>):Mat3{
    function tmatfromarray(a:Array<number>) {
      let rmat = new Mat3();
      rmat.m02=a[0];
      rmat.m12=a[1];
      return rmat;
    }
    assert(args.length>0, "Cannot call Mat3.Translation2D() with no arguments");
    if(Array.isArray(args[0])) {
      return tmatfromarray(args[0]);
    }else if(args[0] instanceof Vec2){
      return tmatfromarray(args[0].elements);
    }else {
      assert(args.length===2, "wrong number of args for Mat3.Translation2D")
      return tmatfromarray(args);
    }
  }

  /**
   * Returns the corresponding rotation transformation matrix for the given
   * `radians`.
   *
   * @param radians the rotation amount in radians
   * @returns the rotation transformation matrix
   */
  public static Rotation(radians:number):Mat3{
    var c:number = Math.cos(radians);
    var s:number = Math.sin(radians);
    return new Mat3(c, -s, 0, s, c, 0, 0, 0, 1)
  }
  //</editor-fold>
  //##################\\--TransformationMatrices--//##################

}

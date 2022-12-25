import { VectorBase } from "./VectorBase";
import { Precision } from "../Precision";
import assert from "assert";
import { TransformationInterface} from "../TrasnformationInterface";

export abstract class Matrix implements TransformationInterface {
  public elements: number[] = [];

  abstract getElement(row: number, col: number): number;
  abstract setToIdentity(): void;

  abstract asPrettyString(): string;

  getMatrix() {
    return this;
  }


  protected abstract _timesVector(v: VectorBase): VectorBase;
  protected abstract _timesMatrix(m: Matrix): Matrix;

  public constructor(elements?: Array<number>);
  public constructor(...args: Array<any>) {
    // common logic constructor
    if (args.length === 0) {
      this.setToIdentity();
      return;
    } else {
      if (Array.isArray(args[0])) {
        this.elements = args[0].slice();
      } else {
        this.elements = args.slice();
      }
    }
  }

  /**
   * Clones the vector
   */
  clone(): this {
    let cfunc: any = this.constructor as any;
    var copy: this = new cfunc(this.elements);
    return copy;
  }

  /**
   * Return true if this.elements are within precision equal to other.elements
   * @param other
   */
  isEqualTo(other: this, tolerance?: number) {
    let epsilon: number =
      tolerance === undefined ? Precision.epsilon : tolerance;
    var n: number = this.elements.length;
    while (n--) {
      if (Math.abs(this.elements[n] - other.elements[n]) > epsilon) {
        return false;
      }
    }
    return true;
  }

  //##################//--Static methods--\\##################
  //<editor-fold desc="Static methods">

  /**
   * For taking the product of a series of matrices in order. You can feed in matrices as separate arguments or as a single list. E.g., Multiply(a, b, c, d) or Multiply([a,b,c,d]).
   * @param args
   * @constructor
   */
  static Product<T extends Matrix>(...args: Array<any>) {
    assert(args.length > 0, "did not provide arguments to Matrix Multiply");
    let mats: Array<T> = args;
    if (Array.isArray(args[0])) {
      mats = args[0];
      assert(
        args.length === 1,
        "first argument to Multiply is an array, so there should be no second argument"
      );
    }
    let M: Matrix = mats[0];
    for (let i = 1; i < mats.length; i++) {
      M = M.times(mats[i]) as Matrix;
    }
    return M;
  }

  //##################//--Arithmetic--\\##################
  //<editor-fold desc="Arithmetic">

  abstract times(other: VectorBase | number | Matrix): VectorBase | Matrix;

  /**
   * multiplies by another matrix, vector, or scalar
   * @param other
   * @returns {VectorBase | this | Matrix}
   */
  // times(other:Vector):Vector;
  // times(other:Vector|this|number):Vector|Matrix{
  //     if(other instanceof Matrix){
  //         return this._timesMatrix(other);
  //     }else if(other instanceof Vector){
  //         return this._timesVector(other);
  //     }else if(typeof(other) === 'number'){
  //         let cfunc:any=(this.constructor as any);
  //         var m:this = new cfunc();
  //         for(let i=0;i<m.elements.length;i++){
  //             m.elements[i]=this.elements[i]*other;
  //         }
  //         return m;
  //     }
  //     throw new Error("Tried to do Matrix.times(other) with other not a matrix, vector, or scalar...")
  // }

  plus(other: Matrix): this {
    let cfunc: any = this.constructor as any;
    var m: this = new cfunc();
    for (let i = 0; i < m.elements.length; i++) {
      m.elements[i] = this.elements[i] + other.elements[i];
    }
    return m;
  }

  minus(other: Matrix): this {
    let cfunc: any = this.constructor as any;
    var m: this = new cfunc();
    for (let i = 0; i < m.elements.length; i++) {
      m.elements[i] = this.elements[i] - other.elements[i];
    }
    return m;
  }
  //</editor-fold>
  //##################\\--Arithmetic--//##################

  /**
   * Apply the matrix to a list of points.
   * @param pointList
   * @returns {*}
   */
  applyToPoints(pointList: Array<VectorBase>) {
    const self: this = this;
    return pointList.map((v) => {
      return self.times(v);
    });
  }

  abstract assignTo(threejsMat: THREE.Matrix4): void;


}

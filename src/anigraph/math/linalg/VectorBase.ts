import { Precision } from "../Precision";
import assert from "assert";
import { Random } from "../Random";
import { ASerializable } from "../../base";

export interface VectorType {
  elements: number[];
}

interface ExtendsVector extends VectorBase {}

@ASerializable("Vector")
export class VectorBase implements VectorType {
  /*
   * Vector can be constructed with:
   * new Vector()
   * new Vector(x, y, ...)
   * new Vector([x,y, ...]])
   * */
  static N_DIMENSIONS: number = -1;
  public elements: number[] = [];
  public constructor(elements?: Array<number>);
  public constructor(...args: Array<any>) {
    // common logic constructor
    if (args.length === 0) {
      this._setToDefault();
      return;
    } else {
      if (Array.isArray(args[0])) {
        this.setElements(args[0]);
      } else {
        this.setElements(args);
      }
    }
  }

  get x() {
    return this.elements[0];
  }
  set x(val: number) {
    this.elements[0] = val;
  }
  get y() {
    return this.elements[1];
  }
  set y(val: number) {
    this.elements[1] = val;
  }


  get nDimensions() {
    return this.elements.length;
  }

  _setToDefault() {
    this.elements = [];
  }

  /**
   *
   * @returns {number}
   * @constructor
   */
  L2() {
    return Math.sqrt(this.dot(this));
  }

  /**
   * Return true if this.elements are within precision equal to other.elements
   * @param other
   */
  isEqualTo(other: VectorType, tolerance?: number) {
    if (this.nDimensions !== other.elements.length) {
      return false;
    }
    let epsilon: number =
      tolerance !== undefined ? tolerance : Precision.epsilon;
    var n: number = this.elements.length;
    while (n--) {
      if (Math.abs(this.elements[n] - other.elements[n]) > epsilon) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the dot product of two vectors. Vectors must have equal length.
   * @param other
   */
  dot(other: VectorType) {
    assert(this.elements.length === other.elements.length);
    let n: number = this.elements.length;
    var rval: number = 0;
    while (n--) {
      rval += this.elements[n] * other.elements[n];
    }
    return rval;
  }

  /**
   * Clones the vector
   */
  clone(): this {
    // var cfunc:any =this.constructor;
    let cfunc: any = this.constructor as any;
    var copy: this = new cfunc(this.elements);
    return copy;
  }


  /**
   * Clones the vector
   */
  deepCopy(): this {
    // var cfunc:any =this.constructor;
    let cfunc: any = this.constructor as any;
    var copy: this = new cfunc(this.elements.slice());
    return copy;
  }


  /**
   * Returns a VectorType with each of its elements replaced by fn(e) where e is the corresponding element of this vector
   * @param fn - function to be run on each element. e is the element value, and i is its index. Should return a new element.
   * @param context - the context for the function call. In other words, what is to be used as the 'this' variable when running the call.
   * @returns {VectorType} - Vectgor of the results from running fn on each element of this.elements
   */
  getMapped(fn: (e: number, i: number) => number, context?: any): this {
    var elements: number[] = [];
    this.forEach(function (x: number, i: number = 0) {
      elements.push(fn.call(context, x, i));
    }, context);

    let cfunc: any = this.constructor as any;
    return new cfunc(elements);
  }

  /**
   *
   * @param fn - function to be executed on each element
   * @param context context for execution
   */
  forEach(fn: (e: number, i: number) => any, context: any) {
    var n = this.elements.length;
    for (let i = 0; i < n; i++) {
      fn.call(context, this.elements[i], i);
    }
  }

  static RandomVector(n: number = 1, range?:[number,number]) {
    var r = new this(Random.floatArray(n));
    if(range !== undefined){
      r = r.minus(this.Ones(range[0]).times(range[0])).times(range[1]-range[0]);
    }
    return r;
  }

  static Zeros(n: number = 1) {
    let z = new Array(n);
    for (let i = 0; i < n; ++i) z[i] = 0;
    var r = new this(z);
    return r;
  }

  static Ones(n: number = 1) {
    let z = new Array(n);
    for (let i = 0; i < n; ++i) z[i] = 1;
    var r = new this(z);
    return r;
  }

  //##################//--Normalize--\\##################
  //<editor-fold desc="Normalize">
  /**
   * Normalizes the vector. If the vector already has length 0, then it does nothing.
   */
  normalize() {
    var r: number = this.L2();
    if (r === 0 || r === 1.0) {
      return;
    }
    var n: number = this.elements.length;
    var rinv: number = 1.0 / r;
    for (let i = 0; i < n; i++) {
      this.elements[i] = this.elements[i] * rinv;
    }
  }

  getNormalized() {
    var r = this.L2();
    if (r === 0 || r === 1) {
      return this.clone();
    }
    return this.getMapped(function (x, i) {
      return x / r;
    });
  }

  getSumOverElements() {
    let rval = 0;
    for (let i = 0; i < this.elements.length; i++) {
      rval = rval + this.elements[i];
    }
    return rval;
  }

  //</editor-fold>
  //##################\\--Normalize--//##################

  //##################//--Arithmetic--\\##################
  //<editor-fold desc="Arithmetic">

  /**
   * Return a new vector that is the sum of this vector and other
   * @param other
   * @return {this}
   */
  plus(other: VectorType): this {
    assert(this.elements.length === other.elements.length);
    return this.getMapped(function (x, i) {
      return x + other.elements[i];
    });
  }

  /**
   * Return a new vector that is the difference of this vector and other
   * @param other
   * @return {this}
   */
  minus(other: VectorType): this {
    assert(this.elements.length === other.elements.length);
    return this.getMapped(function (x, i) {
      return x - other.elements[i];
    });
  }

  timesElementWise(v: VectorBase) {
    assert(this.elements.length === v.elements.length, "VECTORS WRONG LENGTHS");
    return this.getMapped(function (x, i) {
      return x * v.elements[i];
    });
  }

  /**
   * Returns this vector multiplied by the scalar k
   * @param k
   * @returns {this}
   */
  times(k: number): this {
    return this.getMapped(function (x, i) {
      return x * k;
    });
  }

  /**
   * Adds the other vector's elements to this vector's elements
   * @param other
   */
  addVector(other: VectorType) {
    assert(this.elements.length === other.elements.length);
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] = this.elements[i] + other.elements[i];
    }
    return;
  }

  /**
   * Subtracts the other vector's elements from this vector's elements
   * @param other
   */
  subtractVector(other: VectorType) {
    assert(this.elements.length === other.elements.length);
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] = this.elements[i] - other.elements[i];
    }
    return;
  }



  getRounded(): this {
    return this.getMapped(function (x) {
      return Math.round(x);
    });
  }

  inspect() {
    return "[" + this.elements.join(", ") + "]";
  }

  setElements(els: number[]) {
    this.elements = els.slice();
    return this;
  }

  get serializationLabel() {
    // @ts-ignore
    return this.constructor._serializationLabel;
  }

  sstring() {
    var rstring = `${this.serializationLabel}:[`;
    if (this.elements.length === 0) {
      return rstring + `]`;
    }
    rstring = rstring + `${this.elements[0]}`;
    for (let e = 1; e < this.elements.length; e++) {
      rstring = rstring + `, ${this.elements[e]}`;
    }
    rstring = rstring + "]";
    return rstring;
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


@ASerializable("Vector")
export class Vector extends VectorBase{
  static LinSpace(start: number, stop: number, num = 10, endpoint = true) {
    if (num < 0) {
      throw new Error(`Number of samples, ${num}, must be non-negative.`);
    }
    let div = endpoint ? num - 1 : num;
    let delta = stop - start;
    let step = delta / div;
    let y: number[] = [];
    for (let i = 0; i < num; i++) {
      y.push(start+i * step);
    }
    return new VectorBase(y);
  }
  getRaisedToPower(exponent: number) {
    let cfunc: any = this.constructor as any;
    let elements: number[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      elements.push(Math.pow(this.elements[i], exponent));
    }
    return new cfunc(elements);
  }

  fabsmax() {
    var m: number = 0;
    var i: number = this.elements.length;
    while (i--) {
      if (Math.abs(this.elements[i]) > Math.abs(m)) {
        m = this.elements[i];
      }
    }
    return m;
  }

  // flatten(){
  //     return this.elements;
  // }
  // static flatten(vecs:Array<Vector|number>):Array<number>;
  static flatten(
      ...vecs: Array<ExtendsVector | number | any[]>
  ): Array<number> {
    let rval: number[] = [];
    function f(el: Array<ExtendsVector | number | any[]> | number) {
      if (el instanceof Number) {
        // @ts-ignore
        rval.push(el);
        return;
      } else {
        assert(Array.isArray(el), `input ${vecs} not flatten-able by Vector.flatten()`);
        for (let v of el) {
          if (Array.isArray(v)) {
            f(v);
          } else {
            if (typeof v === "number") {
              rval.push(v);
            } else if (v instanceof VectorBase) {
              f(v.elements);
            }
          }
        }
      }
    }
    f(vecs);
    return rval;
  }
}

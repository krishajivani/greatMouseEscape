import * as THREE from "three";
import tinycolor from "tinycolor2";
import { ASerializable } from "../base";
import { Random } from "./Random";
import { VectorBase} from "./linalg/VectorBase";
import {Vec4} from "./linalg/3D/Vec4";

interface TinyColor {
  toRgb(): tinycolor.ColorFormats.RGBA;
}

@ASerializable("Color")
export class Color extends VectorBase {
  static N_DIMENSIONS: number = 4;

  public constructor(r: number, g: number, b: number, a?: number);
  public constructor(rgb: Array<number>);
  public constructor(...args: Array<any>) {
    // common logic constructor
    super(...args);
  }

  toString() {
    return `Color(${this.r},${this.g},${this.b},${this.a})`;
  }

  get nDimensions() {
    return 4;
  }

  public asThreeJS() {
    return new THREE.Color(this.r, this.g, this.b);
  }

  get rgba() {
    if (this.elements.length === 4) {
      return this.elements;
    } else {
      return [this.elements[0], this.elements[1], this.elements[2], 1.0];
    }
  }
  get RGBuintAfloat() {
    return {
      r: this.elements[0] * 256,
      g: this.elements[1] * 256,
      b: this.elements[2] * 256,
      a: this.a,
    };
  }

  static FromRGBuintAfloat(
    r: number | { [name: string]: number },
    g?: number,
    b?: number,
    a?: number
  ) {
    let c = new Color(0, 0, 0);
    c.setRGBuintAfloat(r, g, b, a);
    return c;
  }

  setRGBuintAfloat(
    r: number | { [name: string]: number },
    g?: number,
    b?: number,
    a?: number
  ): void;
  setRGBuintAfloat(...args: any[]) {
    let rgba = [0, 0, 0, 0];
    if (typeof args[0] == "number") {
      rgba[0] = args[0];
      rgba[1] = args[1];
      rgba[2] = args[2];
      rgba[3] = args[3];
    } else {
      let r = args[0] as unknown as { [name: string]: number };
      rgba = [r.r, r.g, r.b, r.a];
    }
    this.elements[0] = rgba[0] / 256;
    this.elements[1] = rgba[1] / 256;
    this.elements[2] = rgba[2] / 256;
    if (this.elements.length < 4) {
      this.elements.push(rgba[3]);
    } else {
      this.elements[3] = rgba[3];
    }
  }

  /** Get set r */
  set r(value) {
    this.elements[0] = value;
  }

  get r() {
    return this.elements[0];
  }

  /** Get set g */
  set g(value) {
    this.elements[1] = value;
  }

  get g() {
    return this.elements[1];
  }

  /** Get set b */
  set b(value) {
    this.elements[2] = value;
  }

  get b() {
    return this.elements[2];
  }

  /** Get set a */
  set a(value) {
    if(this.elements.length===3){
      this.elements.push(value);
    }else {
      this.elements[3] = value;
    }
  }

  get a() {
    if (this.elements.length > 3) {
      return this.elements[3];
    } else {
      return 1.0;
    }
  }

  _setToDefault() {
    this.elements = [0.5, 0.5, 0.5];
  }

  static RandomRGBA() {
    return new Color(
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random()
    );
  }

  // static FromRGBA(r:number|number[],g?:number,b?:number,a:number=1){
  static FromRGBA(r: number, g: number, b: number, a?: number): Color;
  static FromRGBA(rbga: number[]): Color;
  static FromRGBA(...args: any[]) {
    let rgba = args;
    if (Array.isArray(args[0])) {
      rgba = rgba[0];
    }
    return new Color(rgba[0], rgba[1], rgba[2], rgba.length > 3 ? rgba[3] : 1);
  }

  static FromTHREEVector4(vector4: THREE.Vector4) {
    return new Color(vector4.x, vector4.y, vector4.z, vector4.w);
  }

  static Random() {
    var r = new this(Random.floatArray(3));
    return r;
  }

  static FromThreeJS(threecolor: THREE.Color) {
    return new this(threecolor.r, threecolor.g, threecolor.b);
  }

  static FromTinyColor(tc: TinyColor) {
    let rgba = tc.toRgb();
    if (rgba.a === 1) {
      return new Color(rgba.r / 255, rgba.g / 255, rgba.b / 255);
    } else {
      return new Color(rgba.r / 255, rgba.g / 255, rgba.b / 255, rgba.a);
    }
  }

  sstring() {
    return `[${this.r},${this.g},${this.b}]`;
  }

  toHexString() {
    return this._tinycolor().toHexString();
  }

  toHex() {
    return parseInt(this._tinycolor().toHex(), 16);
  }

  get Vec4() {
    return new Vec4(this.r, this.g, this.b, this.a);
  }

  /**
   * Get new color with spun hue
   * @param degrees
   * @returns {Color}
   * @constructor
   */
  Spun(angle: number): Color {
    let spuntc = this._tinycolor().spin((angle * 180) / Math.PI);
    let rval = Color.FromTinyColor(spuntc);
    return rval;
  }

  Desaturate(percent: number): Color {
    let dst = this._tinycolor().desaturate(percent);
    let rval = Color.FromTinyColor(dst);
    return rval;
  }

  Darken(percent: number): Color {
    let dst = this._tinycolor().darken(percent);
    let rval = Color.FromTinyColor(dst);
    return rval;
  }

  static FromHSVA(h: number, s: number, v: number, a?: number) {
    var rgbob = tinycolor(
      `hsv(${parseInt(String(h * 100))}%, ${parseInt(
        String(s * 100)
      )}%, ${parseInt(String(v * 100))}%)`
    ).toRgb();
    if (a !== undefined) {
      return new Color(rgbob.r / 255, rgbob.g / 255, rgbob.b / 255, a);
    } else {
      return new Color(rgbob.r / 255, rgbob.g / 255, rgbob.b / 255);
    }
  }

  static FromString(colorString: string, alpha?: number) {
    var tcolor = tinycolor(colorString).toRgb();
    return new Color(
      tcolor.r / 256,
      tcolor.g / 256,
      tcolor.b / 256,
      alpha ?? tcolor.a
    );
  }

  static ThreeJS(hexstring: string): THREE.Color;
  static ThreeJS(hex: number): THREE.Color;
  static ThreeJS(r: number | string, g?: number, b?: number): THREE.Color {
    if (typeof r === "string") {
      let c = Color.FromString(r);
      return new THREE.Color(c.r, c.b, c.g);
    }
    if (g === undefined || b === undefined) {
      return new THREE.Color(r);
    } else {
      return new THREE.Color(r, g, b);
    }
  }

  _tinycolor() {
    return tinycolor({
      r: parseInt(String(this.r * 255)),
      g: parseInt(String(this.g * 255)),
      b: parseInt(String(this.b * 255)),
      a: this.a,
    });
  }

  toRGBAString() {
    return this._tinycolor().toRgbString();
  }
}

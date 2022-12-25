import { BoundingBox } from "./BoundingBox";
import { NodeTransform2D } from "../nodetransforms/NodeTransform2D";
import {Mat3, V2, Vec2, Vec3} from "../linalg";
import { VertexArray2D } from "./VertexArray2D";
import { VertexAttributeArray } from "./VertexAttributeArray";

export class BoundingBox2D extends BoundingBox<Vec2, Mat3> {
  clone(): this {
    let cfunc: any = this.constructor as any;
    let clone = new cfunc();
    clone.minPoint = this.minPoint?.clone();
    clone.maxPoint = this.maxPoint?.clone();
    clone.transform = this.transform.clone();
    return clone;
  }

  static FromVec2s(verts: Vec2[]) {
    let va = VertexArray2D.FromLists(verts);
    return BoundingBox2D.FromVertexArray2D(va);
  }

  static FromVertexArray2D(verts: VertexArray2D) {
    let rval = new BoundingBox2D();
    rval.boundVertexPositionArrray(verts.position);
    return rval;
  }

  boundVertexPositionArrray(va: VertexAttributeArray<any>) {
    let nverts = va.nVerts;
    for (let vi = 0; vi < nverts; vi++) {
      this.boundPoint(va.getAt(vi));
    }
  }

  constructor() {
    super();
    this.transform = new Mat3();
  }

  randomPointObjectSpace() {
    let rand1 = Math.random();
    let rand2 = Math.random();
    if (!this.minPoint || !this.maxPoint) {
      return V2();
    }
    return V2(
      this.minPoint.x * rand1 + this.maxPoint.x * (1 - rand1),
      this.minPoint.y * rand2 + this.maxPoint.y * (1 - rand2)
    );
  }

  randomTransformedPoint() {
    return this.transform.getMatrix().times(this.randomPointObjectSpace());
  }

  get center() {
    if (!this.minPoint || !this.maxPoint) {
      return;
    }
    return this.transform
      .getMatrix()
      .times(this.minPoint.plus(this.maxPoint).times(0.5));
  }

  get localWidth() {
    // @ts-ignore
    return this.maxPoint.x - this.minPoint.x;
  }
  get localHeight() {
    // @ts-ignore
    return this.maxPoint.y - this.minPoint.y;
  }

  public boundPoint(p: Vec2 | Vec3): void {
    let p2d:Vec2;
    if (p instanceof Vec3) {
      p2d = p.Point2D;
    }else{
      p2d = p;
    }
    if (!this.minPoint || !this.maxPoint) {
      this.minPoint = p2d.clone();
      this.maxPoint = p2d.clone();
      return;
    }
    let ndim: number = this.minPoint.nDimensions;
    for (let c = 0; c < ndim; c++) {
      if (p2d.elements[c] < this.minPoint.elements[c]) {
        this.minPoint.elements[c] = p2d.elements[c];
      }
      if (p2d.elements[c] > this.maxPoint.elements[c]) {
        this.maxPoint.elements[c] = p2d.elements[c];
      }
    }
  }

  get corners(): Vec2[] {
    let tmat = this.transform.getMatrix();
    if (!this.minPoint || !this.maxPoint) {
      return [];
    }
    return [
      tmat.times(this.minPoint),
      tmat.times(V2(this.maxPoint.x, this.minPoint.y)),
      tmat.times(this.maxPoint),
      tmat.times(V2(this.minPoint.x, this.maxPoint.y)),
    ];
  }

  GetBoundaryLinesVertexArray() {
    let va = new VertexArray2D();
    let corners = this.corners;
    if (!corners.length) {
      return va;
    }
    // va.addVertex(corners[0]);
    // va.addVertex(corners[1]);
    // va.addVertex(corners[1]);
    // va.addVertex(corners[2]);
    // va.addVertex(corners[2]);
    // va.addVertex(corners[3]);
    // va.addVertex(corners[3]);
    // va.addVertex(corners[0]);

    va.addVertex(corners[0]);
    va.addVertex(corners[1]);
    // va.addVertex(corners[1]);
    va.addVertex(corners[2]);
    // va.addVertex(corners[2]);
    va.addVertex(corners[3]);
    // va.addVertex(corners[3]);
    va.addVertex(corners[0]);
    return va;
  }

  boundBounds(b: BoundingBox<any, any>) {
    let corners = b.corners;
    for (let c of corners) {
      this.boundPoint(c);
    }
  }
}

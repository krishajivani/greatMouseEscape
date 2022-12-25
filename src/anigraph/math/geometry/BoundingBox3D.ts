/***
 * The BoundingBox3D class
 * This class represents a 3D bounding box using
 * - minPoint (Vec3): the point defined by the minimum x, y, and z coordinates being bound.
 * - maxPoint (Vec3): the point defined by the maximum x, y, and z coordinates being bound.
 * - transform (NodeTransform3D): a transformation associated with the bounding box. This allows for
 *   oriented bounding boxes.
 */

import * as THREE from "three";
import {V3, Vec3, Vec4, Vec2, V2, Mat4} from "../linalg";
import { BoundingBox } from "./BoundingBox";
import { BoundingBox2D } from "./BoundingBox2D";
import { VertexArray3D } from "./VertexArray3D";
import { VertexAttributeArray } from "./VertexAttributeArray";
import { VertexArray2D } from "./VertexArray2D";
import { VertexIndexArray } from "./VertexIndexArray";
import { NodeTransform3D } from "../nodetransforms";

// export class BoundingBox3D extends BoundingBox<Vec3, Mat4>
export class BoundingBox3D extends BoundingBox<Vec3, Mat4> {
  constructor() {
    super();
    // this.transform = new Mat4();
    this.transform = new Mat4();
  }

  clone(): this {
    let cfunc: any = this.constructor as any;
    let clone = new cfunc();
    clone.minPoint = this.minPoint?.clone();
    clone.maxPoint = this.maxPoint?.clone();
    clone.transform = this.transform.clone();
    return clone;
  }

  static FromVec3s(verts: Vec3[]) {
    let va = VertexArray3D.FromVec3List(verts);
    return BoundingBox3D.FromVertexArray3D(va);
  }

  /**
   * Get a bounding box at a specified location with a specified side length
   * @param location
   * @param size
   * @returns {BoundingBox3D}
   * @constructor
   */
  static BoxAtLocationWithSize(location: Vec3, size: number = 100) {
    let box = new BoundingBox3D();
    let hsize = size * 0.5;
    box.boundPoint(V3(hsize, hsize, hsize));
    box.boundPoint(V3(-hsize, -hsize, -hsize));
    box.transform = Mat4.Translation3D(location);
    // box.transform = new Mat4();
    // box.transform.c3 = new Vec4(location.x, location.y, location.z, 1.0);

    return box;
  }

  /**
   * Get a bounding box 3D that bounds points from the given VertexArray3D
   * @param verts
   * @returns {BoundingBox3D}
   * @constructor
   */
  static FromVertexArray3D(verts: VertexArray3D) {
    let rval = new BoundingBox3D();
    rval.boundVertexPositionArrray(verts.position);
    return rval;
  }

  /**
   * Adjusts the current bounding box to bound all of the points specified in va.
   * @param va
   */
  boundVertexPositionArrray(va: VertexAttributeArray<any>) {
    let nverts = va.nVerts;
    for (let vi = 0; vi < nverts; vi++) {
      this.boundPoint(va.getAt(vi));
    }
  }

  /**
   * Gets the ThreeJS bounds and converts them to a BoundingBox3D object.
   * @param obj
   * @returns {BoundingBox3D}
   * @constructor
   */
  static FromTHREEJSObject(obj: THREE.Object3D) {
    let threebox = new THREE.Box3().setFromObject(obj);
    let bounds = new BoundingBox3D();
    bounds.minPoint = V3(threebox.min.x, threebox.min.y, threebox.min.z);
    bounds.maxPoint = V3(threebox.max.x, threebox.max.y, threebox.max.z);
    return bounds;
  }

  /**
   * Get a random point in the object space (not transformed by this.transform) of the bounding box
   * @returns {Vec3}
   */
  randomPointObjectSpace() {
    let rand1 = Math.random();
    let rand2 = Math.random();
    let rand3 = Math.random();
    if (!this.minPoint || !this.maxPoint) {
      return V3();
    }
    return V3(
      this.minPoint.x * rand1 + this.maxPoint.x * (1 - rand1),
      this.minPoint.y * rand2 + this.maxPoint.y * (1 - rand2),
      this.minPoint.z * rand3 + this.maxPoint.z * (1 - rand3)
    );
  }

  /**
   * Get a random point from the region bounded by the oriented bounding box
   * (i.e., the box after transforming by this.transform)
   * @returns {Vec3}
   */
  randomTransformedPoint() {
    return this.transform
      .getMatrix()
      .times(this.randomPointObjectSpace().Point3DH).Point3D;
  }

  /**
   * Center of box
   * @returns {Vec3}
   */
  get center() {
    if (!this.minPoint || !this.maxPoint) {
      return;
    }
    return this.transform
      .getMatrix()
      .times(this.minPoint.plus(this.maxPoint).times(0.5).Point3DH).Point3D;
  }

  /**
   * The width in object space
   * @returns {number}
   */
  get localWidth() {
    // @ts-ignore
    return this.maxPoint.x - this.minPoint.x;
  }

  /**
   * The height in object space
   * @returns {number}
   */
  get localHeight() {
    // @ts-ignore
    return this.maxPoint.y - this.minPoint.y;
  }

  /**
   * The depth in object space
   * @returns {number}
   */
  get localDepth() {
    // @ts-ignore
    return this.maxPoint.z - this.minPoint.z;
  }

  /**
   * Adjust the bounds to contrain the given point (if adjustment is necessary).
   * @param p
   */
  public boundPoint(p: Vec2 | Vec3 | Vec4): void {
    if (!this.minPoint || !this.maxPoint) {
      let pcl =
        p instanceof Vec3
          ? p
          : p instanceof Vec4
          ? p.Point3D
          : Vec3.From2DHPoint(p);
      this.minPoint = pcl.clone();
      this.maxPoint = pcl.clone();
      return;
    }
    let ndim: number = Math.min(this.minPoint.nDimensions, p.elements.length);
    for (let c = 0; c < ndim; c++) {
      if (p.elements[c] < this.minPoint.elements[c]) {
        this.minPoint.elements[c] = p.elements[c];
      }
      if (p.elements[c] > this.maxPoint.elements[c]) {
        this.maxPoint.elements[c] = p.elements[c];
      }
    }
  }

  /**
   * [-1, -1, -1]
   * [1,  -1, -1]
   * [1,   1, -1]
   * [-1,  1, -1]
   * [-1, -1,  1]
   * [1,  -1,  1]
   * [1,   1,  1]
   * [-1,  1,  1]
   *
   * near face far face order
   * @returns {any[] | Vec3[]}
   */
  get corners() {
    let tmat = this.transform.getMatrix();
    if (!this.minPoint || !this.maxPoint) {
      return [];
    }
    return [
      tmat.times(this.minPoint.Point3DH).Point3D,
      tmat.times(V3(this.maxPoint.x, this.minPoint.y, this.minPoint.z).Point3DH)
        .Point3D,
      tmat.times(V3(this.maxPoint.x, this.maxPoint.y, this.minPoint.z).Point3DH)
        .Point3D,
      tmat.times(V3(this.minPoint.x, this.maxPoint.y, this.minPoint.z).Point3DH)
        .Point3D,
      tmat.times(V3(this.minPoint.x, this.minPoint.y, this.maxPoint.z).Point3DH)
        .Point3D,
      tmat.times(V3(this.maxPoint.x, this.minPoint.y, this.maxPoint.z).Point3DH)
        .Point3D,
      tmat.times(this.maxPoint.Point3DH).Point3D,
      tmat.times(V3(this.minPoint.x, this.maxPoint.y, this.maxPoint.z).Point3DH)
        .Point3D,
    ];
  }

  /**
   * gets minpoint, far bottom right, maxpoint, near top left, minpoint
   * @returns {VertexArray2D}
   * @constructor
   */
  GetBoundaryLinesVertexArray2D() {
    let va = new VertexArray2D();
    let corners = this.corners;
    if (!corners.length) {
      return va;
    }

    va.addVertex(corners[0].XY);
    va.addVertex(corners[1].XY);
    va.addVertex(corners[2].XY);
    va.addVertex(corners[3].XY);
    va.addVertex(corners[0].XY);
    return va;
  }

  GetBoundaryLinesVertexArray() {
    let va = new VertexArray2D();
    let corners = this.corners;
    if (!corners.length) {
      return va;
    }

    va.addVertex(corners[0].Point2D);
    va.addVertex(corners[1].Point2D);
    va.addVertex(corners[2].Point2D);
    va.addVertex(corners[3].Point2D);
    va.addVertex(corners[4].Point2D);
    va.addVertex(corners[5].Point2D);
    va.addVertex(corners[6].Point2D);
    va.addVertex(corners[7].Point2D);
    console.warn("have not specified indices for 3d boundary lines array");
    // indices should be defined.
    return va;
  }

  GetBoxTriangleMeshVerts() {
    let va = new VertexArray3D();
    let corners = this.corners;
    if (!corners.length) {
      return va;
    }

    va.addVertex(corners[0]);
    va.addVertex(corners[1]);
    va.addVertex(corners[2]);
    va.addVertex(corners[3]);
    va.addVertex(corners[4]);
    va.addVertex(corners[5]);
    va.addVertex(corners[6]);
    va.addVertex(corners[7]);

    va.indices = new VertexIndexArray(3);

    va.indices.push([2, 1, 0]);
    va.indices.push([3, 2, 0]);

    //back
    va.indices.push([5, 6, 4]);
    va.indices.push([6, 7, 4]);

    // left
    va.indices.push([3, 0, 4]);
    va.indices.push([7, 3, 4]);

    //right
    va.indices.push([1, 2, 5]);
    va.indices.push([2, 6, 5]);

    // top
    va.indices.push([6, 2, 3]);
    va.indices.push([7, 6, 3]);

    //bottom
    va.indices.push([1, 5, 0]);
    va.indices.push([5, 4, 0]);

    return va;
  }

  boundBounds(b: BoundingBox<any, any>) {
    let corners = b.corners;
    for (let c of corners) {
      this.boundPoint(c);
    }
  }

  static FromBoundingBox2D(bounds2D: BoundingBox2D) {
    let b = new BoundingBox3D();
    let corners = bounds2D.corners;
    for (let c of corners) {
      b.boundPoint(Vec3.FromVec2(c));
    }
    return b;
  }

  getBoundsXY():BoundingBox2D{
    let b = new BoundingBox2D();
    let corners = this.corners;
    for (let c of corners) {
      b.boundPoint(V2(c.x, c.y));
    }
    return b;
  }
}

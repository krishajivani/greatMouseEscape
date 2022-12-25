import {V2, Vec2, V3, Vec3, V4, Vec4, Mat4, V4A} from "../linalg";
import {
  VertexAttributeArray,
  VertexAttributeArray2D,
  VertexAttributeArray3D,
  VertexAttributeArray4D,
  VertexAttributeArrayFromThreeJS, VertexAttributeColorArray,
} from "./VertexAttributeArray";
import { ASerializable } from "../../base";
import { VertexArray } from "./VertexArray";
import { VertexIndexArray } from "./VertexIndexArray";
import { BoundingBox3D } from "./BoundingBox3D";
import { Color } from "../Color";
// import { ATexture } from "../arender/ATexture";

@ASerializable("VertexArray3D")
export class VertexArray3D extends VertexArray<Vec3> {
  constructor() {
    super();
    this.position = new VertexAttributeArray3D();
  }

  getBounds(): BoundingBox3D {
    let b = new BoundingBox3D();
    b.boundVertexPositionArrray(this.position);
    return b;
  }

  /** Get set position */
  set position(value: VertexAttributeArray3D) {
    this.attributes["position"] = value;
  }
  get position() {
    return this.attributes["position"] as VertexAttributeArray3D;
  }

  setAttributeArray(name: string, attributeArray: VertexAttributeArray<any>) {
    this.attributes[name] = attributeArray;
  }

  static FromThreeJS(buffergeo: THREE.BufferGeometry) {
    let varray = new VertexArray3D();
    varray.indices = VertexIndexArray.FromThreeJS(buffergeo.index);
    for (let atrname in buffergeo.attributes) {
      varray.attributes[atrname] = VertexAttributeArrayFromThreeJS(
        buffergeo.attributes[atrname]
      );
    }
    return varray;
  }

  // static FromVertexArray2D(v2:VertexArray2D, transform:Mat4){
  //     let v3=new VertexArray3D();
  // }

  addTriangleCCW(A: Vec3, B: Vec3, C: Vec3, uv?: Vec2[], color?: Vec4[]) {
    let i = this.nVerts;
    let AB = B.minus(A);
    let AC = C.minus(A);
    let N = AB.getNormalized().cross(AC.getNormalized());
    this.addVertex(A, N, uv ? uv[0] : undefined, color ? color[0] : undefined);
    this.addVertex(B, N, uv ? uv[1] : undefined, color ? color[1] : undefined);
    this.addVertex(C, N, uv ? uv[2] : undefined, color ? color[2] : undefined);

    this.indices.push([i, i + 1, i + 2]);
  }

  static Axis(scale = 1) {
    let o = V3(0, 0, 0);
    let x = V3(scale, 0, 0);
    let y = V3(0, scale, 0);
    let nz = V3(0, 0, -scale);
    let verts = VertexArray3D.CreateForRendering(false, false, true);
    verts.addVertex(o, undefined, undefined, Color.FromString("#ff0000"));
    verts.addVertex(x, undefined, undefined, Color.FromString("#ff0000"));
    verts.addVertex(o, undefined, undefined, Color.FromString("#00ff00"));
    verts.addVertex(y, undefined, undefined, Color.FromString("#00ff00"));
    verts.addVertex(o, undefined, undefined, Color.FromString("#0000ff"));
    verts.addVertex(nz, undefined, undefined, Color.FromString("#0000ff"));
    verts.indices = new VertexIndexArray(2);
    verts.indices.push([0, 1, 2, 3, 4, 5]);
    return verts;
  }

  static FrustumFromProjectionMatrix(P: Mat4, imagePlaneDepth = 100) {
    let imagePlaneNDC = 0.0;
    let baseNDC = [
      V4(-1, -1, imagePlaneNDC, 1),
      V4(1, -1, imagePlaneNDC, 1),
      V4(1, 1, imagePlaneNDC, 1),
      V4(-1, 1, imagePlaneNDC, 1),
    ];

    let PInv = P.getInverse();
    let baseV = baseNDC.map((v: Vec4) => {
      return PInv.times(v);
    });

    let verts = new VertexArray3D();
    verts.normal = new VertexAttributeArray3D();
    verts.indices = new VertexIndexArray(3);

    for (let i = 0; i < 3; i++) {
      verts.addTriangleCCW(
        V3(0, 0, 0),
        baseV[i].Point3D.getHomogenized().times(-imagePlaneDepth),
        baseV[i + 1].Point3D.getHomogenized().times(-imagePlaneDepth)
      );
    }
    verts.addTriangleCCW(
      V3(0, 0, 0),
      baseV[3].Point3D.getHomogenized().times(-imagePlaneDepth),
      baseV[0].Point3D.getHomogenized().times(-imagePlaneDepth)
    );
    return verts;
  }

  static CreateForRendering(
    hasNormals: boolean = true,
    hasTextureCoords: boolean = true,
    hasColors: boolean = false
  ) {
    let v = new this();
    v.indices = new VertexIndexArray(3);
    if (hasNormals) {
      v.normal = new VertexAttributeArray3D();
    }
    if (hasTextureCoords) {
      v.uv = new VertexAttributeArray2D();
    }
    if (hasColors) {
      v.color = new VertexAttributeColorArray();
    }
    return v;
  }

  static SquareXYUV(scale: number = 1, wraps: number = 1) {
    let verts = new VertexArray3D();
    verts.position = new VertexAttributeArray3D();
    verts.position.push(V3(-0.5, -0.5, 0.0).times(scale));
    verts.position.push(V3(0.5, -0.5, 0.0).times(scale));
    verts.position.push(V3(0.5, 0.5, 0.0).times(scale));
    verts.position.push(V3(-0.5, 0.5, 0.0).times(scale));
    verts.uv = new VertexAttributeArray2D();
    verts.uv.push(V2(0, 0).times(wraps));
    verts.uv.push(V2(1, 0).times(wraps));
    verts.uv.push(V2(1, 1).times(wraps));
    verts.uv.push(V2(0, 1).times(wraps));

    verts.normal = new VertexAttributeArray3D();
    verts.normal.push(V3(0.0, 0.0, 1.0).times(scale));
    verts.normal.push(V3(0.0, 0.0, 1.0).times(scale));
    verts.normal.push(V3(0.0, 0.0, 1.0).times(scale));
    verts.normal.push(V3(0.0, 0.0, 1.0).times(scale));

    verts.indices = new VertexIndexArray(3);
    verts.indices.push([0, 1, 2]);
    verts.indices.push([0, 2, 3]);
    return verts;
  }

  static IndexedGrid(
    width: number = 1,
    height: number = 1,
    widthSegments: number = 1,
    heightSegments: number = 1,
    color?: Color
  ) {
    // let width:number=1, height:number=1, widthSegments:number=1,heightSegments:number=1;

    color = color ?? Color.FromString("#ffffff");

    let halfW = width * 0.5;
    let halfH = height * 0.5;
    // let's use normals, texture coords, and colors...
    let v = VertexArray3D.CreateForRendering(true, true, true);
    for (let y = 0; y < heightSegments + 1; y++) {
      for (let x = 0; x < widthSegments + 1; x++) {
        v.addVertex(
          V3(
            -halfW + (x / widthSegments) * width,
            -halfH + (y / heightSegments) * height,
            0
          ),
          V3(0, 0, 1),
          V2(x / widthSegments, y / heightSegments),
          color
        );
      }
    }

    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        v.indices.push([
          x + y * (widthSegments + 1),
          x + 1 + y * (widthSegments + 1),
          x + 1 + (y + 1) * (widthSegments + 1),
        ]);
        v.indices.push([
          x + 1 + (y + 1) * (widthSegments + 1),
          x + (y + 1) * (widthSegments + 1),
          x + y * (widthSegments + 1),
        ]);
      }
    }
    return v;
  }

  // static VertsForBounds2D(bound:BoundingBox3D){
  //     let verts = new VertexArray3D();
  //     verts.position= new VertexAttributeArray3D();
  //     verts.position.push(V3(-0.5*aspect,-0.5,0.0).times(scale))
  //     verts.position.push(V3(0.5*aspect,-0.5,0.0).times(scale))
  //     verts.position.push(V3(0.5*aspect,0.5,0.0).times(scale))
  //     verts.position.push(V3(-0.5*aspect,0.5,0.0).times(scale))
  //     verts.uv = new VertexAttributeArray2D()
  //     verts.uv.push(V2(0,0));
  //     verts.uv.push(V2(1,0));
  //     verts.uv.push(V2(1,1));
  //     verts.uv.push(V2(0,1));
  //
  //     verts.normal = new VertexAttributeArray3D();
  //     verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
  //     verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
  //     verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
  //     verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
  //
  //     verts.indices = new VertexIndexArray(3);
  //     verts.indices.push([0,1,2]);
  //     verts.indices.push([0,2,3]);
  //     return verts;
  // }

  static MeshVertsForBoundingBox3D(bounds: BoundingBox3D) {
    return bounds.GetBoxTriangleMeshVerts();
  }

  static BoundingBoxMeshVertsForObject3D(obj: THREE.Object3D) {
    return BoundingBox3D.FromTHREEJSObject(obj).GetBoxTriangleMeshVerts();
  }

  /**
   * Slightly modified from ThreeJS
   * @param radius
   * @param widthSegments
   * @param heightSegments
   * @param phiStart
   * @param phiLength
   * @param thetaStart
   * @param thetaLength
   * @constructor
   */
  static Sphere(
    radius = 1,
    widthSegments = 32,
    heightSegments = 16,
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI
  ) {
    let sphere = VertexArray3D.CreateForRendering(true, true);
    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));
    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);
    let index = 0;
    const grid = [];
    const vertex = new Vec3();
    // const normal = new Vec3();
    // generate vertices, normals and uvs

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = [];
      const v = iy / heightSegments;
      // special case for the poles
      let uOffset = 0;
      if (iy === 0 && thetaStart === 0) {
        uOffset = 0.5 / widthSegments;
      } else if (iy === heightSegments && thetaEnd === Math.PI) {
        uOffset = -0.5 / widthSegments;
      }
      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;
        // vertex
        vertex.x =
          -radius *
          Math.cos(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);
        vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
        vertex.z =
          radius *
          Math.sin(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);

        // uv
        let uv = V2(u + uOffset, 1 - v);

        verticesRow.push(index++);
        sphere.addVertex(vertex, vertex.getNormalized(), uv);
      }
      grid.push(verticesRow);
    }

    // indices

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];
        if (iy !== 0 || thetaStart > 0) {
          sphere.indices.push([a, b, d]);
        }
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI) {
          sphere.indices.push([b, c, d]);
        }
      }
    }
    return sphere;
  }


  /**
   * Slightly modified from ThreeJS
   * @param radius
   * @param widthSegments
   * @param heightSegments
   * @param phiStart
   * @param phiLength
   * @param thetaStart
   * @param thetaLength
   * @constructor
   */
  static ColoredSphere(
      radius = 1,
      widthSegments = 32,
      heightSegments = 16,
      color?:Color
  ) {
    // color = color??Color.RandomRGBA();
    let phiStart = 0;
    let phiLength = Math.PI * 2;
    let thetaStart = 0;
    let thetaLength = Math.PI
    let sphere = VertexArray3D.CreateForRendering(true, true, true);
    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));
    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);
    let index = 0;
    const grid = [];
    const vertex = new Vec3();
    // const normal = new Vec3();
    // generate vertices, normals and uvs

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = [];
      const v = iy / heightSegments;
      // special case for the poles
      let uOffset = 0;
      if (iy === 0 && thetaStart === 0) {
        uOffset = 0.5 / widthSegments;
      } else if (iy === heightSegments && thetaEnd === Math.PI) {
        uOffset = -0.5 / widthSegments;
      }
      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;
        // vertex
        vertex.x =
            -radius *
            Math.cos(phiStart + u * phiLength) *
            Math.sin(thetaStart + v * thetaLength);
        vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
        vertex.z =
            radius *
            Math.sin(phiStart + u * phiLength) *
            Math.sin(thetaStart + v * thetaLength);

        // uv
        let uv = V2(u + uOffset, 1 - v);

        verticesRow.push(index++);
        sphere.addVertex(vertex, vertex.getNormalized(), uv,Color.RandomRGBA());
      }
      grid.push(verticesRow);
    }

    // indices

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];
        if (iy !== 0 || thetaStart > 0) {
          sphere.indices.push([a, b, d]);
        }
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI) {
          sphere.indices.push([b, c, d]);
        }
      }
    }
    return sphere;
  }


  // static SpriteGeometry(texture: ATexture, scale: number = 100) {
  //   let verts = new VertexArray3D();
  //   let aspect = texture.width / texture.height;
  //   verts.position = new VertexAttributeArray3D();
  //   verts.position.push(V3(-0.5 * aspect, -0.5, 0.0).times(scale));
  //   verts.position.push(V3(0.5 * aspect, -0.5, 0.0).times(scale));
  //   verts.position.push(V3(0.5 * aspect, 0.5, 0.0).times(scale));
  //   verts.position.push(V3(-0.5 * aspect, 0.5, 0.0).times(scale));
  //   verts.uv = new VertexAttributeArray2D();
  //   verts.uv.push(V2(0, 0));
  //   verts.uv.push(V2(1, 0));
  //   verts.uv.push(V2(1, 1));
  //   verts.uv.push(V2(0, 1));
  //
  //   verts.normal = new VertexAttributeArray3D();
  //   verts.normal.push(V3(0.0, 0.0, -1.0).times(scale));
  //   verts.normal.push(V3(0.0, 0.0, -1.0).times(scale));
  //   verts.normal.push(V3(0.0, 0.0, -1.0).times(scale));
  //   verts.normal.push(V3(0.0, 0.0, -1.0).times(scale));
  //
  //   verts.indices = new VertexIndexArray(3);
  //   verts.indices.push([0, 1, 2]);
  //   verts.indices.push([0, 2, 3]);
  //   return verts;
  // }

  addVertex(v: Vec3, normal?: Vec3, uv?: Vec2, color?: Color | Vec4) {
    this.position.push(v);
    if (color) {
      this.color?.push(V4A(...color.elements));
    }
    if (normal) {
      this.normal?.push(V3(...normal.elements));
    }
    if (uv) {
      this.uv?.push(V2(...uv.elements));
    }
  }

  static FromVec3List(verts: Vec3[]) {
    let va = new VertexArray3D();
    for (let v of verts) {
      va.addVertex(v);
    }
    return va;
  }
}

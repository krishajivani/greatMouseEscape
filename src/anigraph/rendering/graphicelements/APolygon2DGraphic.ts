import * as THREE from "three";
import { AGraphicElement } from "../graphicobject";
import {Color, Mat4, V4, Vec2, Vec4, VertexArray2D, VertexArray3D} from "../../math";
import {ASerializable} from "../../base";
import {AMaterial} from "../material";
import {Float32BufferAttribute} from "three";



@ASerializable("APolygon2DGraphic")
export class APolygon2DGraphic extends AGraphicElement {
  protected verts!: VertexArray2D;
  get mesh():THREE.Mesh{
    return this._element as THREE.Mesh;
  }

  constructor(verts?:VertexArray2D|number[], color?:Color|THREE.Color){
    super();
    if(verts){
      this.init(
          (verts instanceof VertexArray2D)?verts:new VertexArray2D(verts),
          color?color:Color.RandomRGBA());
    }
  }

  init(geometry?:THREE.BufferGeometry|VertexArray2D, material?:Color|THREE.Color|THREE.Material|THREE.Material[]|AMaterial) {
    super._initIfNotAlready(geometry, material);
  }

  setTextureMatrix(mat:Mat4){
    let posattr = this.geometry.getAttribute('position');
    let vpositions = posattr.array;
    let uvs:number[] = [];
    let ndim = posattr.itemSize;
    for (let vi = 0; vi < posattr.count; vi++) {
      let p4:Vec4;
      if(ndim===3) {
        p4 = V4(vpositions[vi * ndim], vpositions[vi * ndim + 1], vpositions[vi * ndim + 2], 1);
      }else if(ndim=4){
        p4 = V4(vpositions[vi * ndim], vpositions[vi * ndim + 1], vpositions[vi * ndim + 2], vpositions[vi * ndim + 2]);
      }else{
        p4 = V4(vpositions[vi * ndim], vpositions[vi * ndim + 1], 0, 1);
      }
      let p4t = mat.times(p4).getHomogenized();
      uvs.push(p4t.x);
      uvs.push(p4t.y);
    }
    this.geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))

  }

  setVerts2D(verts:VertexArray2D|number[]){
    let geometry:VertexArray2D;
    if(Array.isArray(verts)){
      geometry = new VertexArray2D(verts);
    }else if (verts instanceof VertexArray2D){
      geometry = verts;
    }else{
      throw new Error(`cannot set verts to unsupported type: ${verts}`);
    }
    if(this._geometry){
      this._geometry.dispose();
    }
    let shape = new THREE.Shape();
    if(geometry.length){
      shape.moveTo(geometry.position.elements[0], geometry.position.elements[1]);
      for (let v=1;v<geometry.length;v++){
        let vert =geometry.position.getAt(v);
        shape.lineTo(vert.x, vert.y);
      }
    }
    this._geometry = new THREE.ShapeGeometry(shape);
    if(this._element){
      this.mesh.geometry = this._geometry;
    }
  }
}

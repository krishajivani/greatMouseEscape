import { VectorBase } from "../linalg/VectorBase";

export class VertexIndexArray extends VectorBase {
  public VertsPerElement: number;
  constructor(vertsPerElement: number = 3) {
    super();
    this.VertsPerElement = vertsPerElement;
  }
  getAt(i: number) {
    let rval = [];
    for (let j = 0; j < this.VertsPerElement; j++) {
      rval.push(i * this.VertsPerElement + j);
    }
    return rval;
  }

  setAt(i: number, inds: number[]) {
    let startIndex = i * this.VertsPerElement;
    for (let j = 0; j < this.VertsPerElement; j++) {
      this.elements[startIndex + j] = inds[j];
    }
  }

  get nVerts() {
    return this.elements.length / this.VertsPerElement;
  }

  push(inds: number[]) {
    let newinds = inds.slice();
    this.elements = this.elements.concat(newinds);
  }

  clone() {
    let rval = super.clone();
    rval.VertsPerElement = this.VertsPerElement;
    return rval;
  }

  static FromThreeJS(index: THREE.BufferAttribute | null) {
    let iar = new VertexIndexArray();
    if (index) {
      iar.elements = Array.from(index.array);
    }
    return iar;
  }
}

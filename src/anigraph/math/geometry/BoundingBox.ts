import { Precision } from "../";
import { VectorBase } from "../linalg";
import { TransformationInterface} from "../TrasnformationInterface";

export abstract class BoundingBox<
  VertexType extends VectorBase,
  TransformType extends TransformationInterface
> {
  public minPoint!: VertexType | undefined;
  public maxPoint!: VertexType | undefined;
  public transform!: TransformType;
  abstract get center(): VertexType | undefined;
  abstract get corners(): VertexType[];
  abstract clone(): this;

  abstract randomTransformedPoint(): VertexType;

  constructor(...points: Array<VertexType>) {
    if (points !== undefined) {
      for (let p of points) {
        this.boundPoint(p);
      }
    }
  }

  reset() {
    this.minPoint = undefined;
    this.maxPoint = undefined;
  }

  pointInBounds(p: VertexType, epsilon?: number): boolean {
    if (!this.minPoint || !this.maxPoint) {
      return false;
    }
    if (epsilon === undefined) {
      epsilon = Precision.epsilon;
    }

    let ndim: number = p.nDimensions;
    for (let c = 0; c < ndim; c++) {
      if (
        p.elements[c] < this.minPoint.elements[c] ||
        p.elements[c] > this.maxPoint.elements[c]
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * BoundPoint should adapt our bounds to include a new point should that point be outside of the current bounds.
   * @param p
   */
  public boundPoint(p: VertexType): void {
    if (!this.minPoint || !this.maxPoint) {
      this.minPoint = p.clone();
      this.maxPoint = p.clone();
      return;
    }
    let ndim: number = this.minPoint.nDimensions;
    for (let c = 0; c < ndim; c++) {
      if (p.elements[c] < this.minPoint.elements[c]) {
        this.minPoint.elements[c] = p.elements[c];
      }
      if (p.elements[c] > this.maxPoint.elements[c]) {
        this.maxPoint.elements[c] = p.elements[c];
      }
    }
  }
}

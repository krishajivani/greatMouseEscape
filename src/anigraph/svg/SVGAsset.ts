import {
  AObject3DModelWrapper,
  BoundingBox2D,
  BoundingBox3D,
  Mat3,
  Mat4,
  NodeTransform3D,
  Quaternion,
  V2,
  V3,
} from "../math";
import { SVGLoader, SVGParsedData } from "./SVGLoader";
import { ThreeJSObjectFromParsedSVG } from "./SvgToThreeJsObject";

export class SVGAsset extends AObject3DModelWrapper {
  protected svgText: string;
  protected parsedSVG: SVGParsedData;
  originalBounds!: BoundingBox3D;

  constructor(svgText: string) {
    let parsedSVG = SVGAsset.ParseSVGText(svgText);
    let refObject3D = ThreeJSObjectFromParsedSVG(parsedSVG);
    // Mat4.Scale2D(V2(1.0,-1.0)).assignTo(refObject3D.matrix);
    // Mat4.RotationZ(10).assignTo(refObject3D.matrix);
    // Mat4.Identity().assignTo(refObject3D.matrix);
    // Mat4.Scale2D(V2(1.0,-1.0)).assignTo(refObject3D.matrixWorld);
    super(refObject3D);
    this.svgText = svgText;
    this.parsedSVG = parsedSVG;
    this.originalBounds = this.getBounds();
  }

  static async Load(svgURL: string, normalize: boolean = true) {
    const loader = new SVGLoader();
    let svgtext: string = await loader.loadSVGText(svgURL);
    let newSVGAsset = new SVGAsset(svgtext);
    if (normalize) {
      let scaleFactor = 1.0 / newSVGAsset.originalBounds.localWidth;
      newSVGAsset.sourceTransform = new NodeTransform3D(
        V3(),
        Quaternion.Identity(),
        V3(1.0, -1.0, 1.0).times(scaleFactor)
      );
      // newSVGAsset.setSourceScale(1.0/(bounds.localWidth))
    }
    return newSVGAsset;
  }

  // get scale() {
  //   return this.sourceScale;
  // }

  // setScale(scale: number) {
  //   // this.setSourceScale(scale);
  //   this.setSourceTrans
  //   this._setMatrix(Mat4.Scale2D(scale));
  // }

  protected _setMatrix(mat: Mat3 | Mat4) {
    if (mat instanceof Mat3) {
      Mat4.From2DMat3(mat).assignTo(this.object.matrix);
    } else {
      mat.assignTo(this.object.matrix);
    }
  }

  static ParseSVGText(svgText: string) {
    const loader = new SVGLoader();
    const svgParsedData: SVGParsedData = loader.parse(svgText);
    return svgParsedData;
  }
}

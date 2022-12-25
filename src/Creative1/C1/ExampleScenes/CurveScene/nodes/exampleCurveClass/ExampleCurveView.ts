import {
    ALineGraphic,
    ANodeView, ANodeView2D, Color,
    Handle2DGraphic,
    NodeTransform3D, V2,
    V3,
    Vec2,
    Vector,
    VertexArray2D
} from "../../../../../../anigraph";
import {ExampleCurveModel} from "./ExampleCurveModel";

export class ExampleCurveView extends ANodeView2D{
    stroke!:ALineGraphic;
    strokeVerts!:VertexArray2D;
    controlShape!:ALineGraphic;
    handles:Handle2DGraphic[]=[];
    nSamplesPerSegment:number=25;
    get model():ExampleCurveModel{
        return this._model as ExampleCurveModel;
    }

    init(): void {
        this.stroke = new ALineGraphic();
        this.stroke.init(this.getCurveVertices(), this.model.getStrokeMaterial());
        this.stroke.setLineWidth(this.model.lineWidth);
        this.addGraphic(this.stroke);
        // this.addGraphicToRoot(this.stroke);
    }

    update(): void {
        this.stroke.setVerts2D(this.getCurveVertices());
        this.stroke.setLineWidth(this.model.lineWidth);
        this.setTransform(this.model.getWorldTransform())
    }

    getCurveVertices(){
        // let curveVerts = VertexArray2D.CreateForCurve();
        return this.model.verts;
    }

}

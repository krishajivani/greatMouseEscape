// import {ANodeView, ALineSegmentsGraphic, VertexArray3D, VertexArray2D, Color} from "../../../../index";
import {ANodeView} from "../../../ANodeView";
import {ALineSegmentsGraphic} from "../../../../rendering";

import {LineSegmentsModel2D} from "./LineSegmentsModel2D";
// import {VertexArray3D, VertexArray2D, Color} from "../../../../math";

export class LineSegmentsView2D extends ANodeView{
    lineSegments!:ALineSegmentsGraphic;
    get model():LineSegmentsModel2D{
        return this._model as LineSegmentsModel2D;
    }
    static Create(model:LineSegmentsModel2D){
        let view = new LineSegmentsView2D();
        view.setModel(model);
        return view;
    }

    init(){
        // this.lines = new ALineSegmentsGraphic(VertexArray3D.CreateForRendering(false, false, true))
        this.lineSegments = ALineSegmentsGraphic.Create(this.model.verts, this.model.material.threejs, this.model.lineWidth)
        // this.lines.setLineWidth(0.01);
        this.addGraphic(this.lineSegments);
    }

    update(): void {
        this.lineSegments.setVerts(this.model.verts);
        this.lineSegments.setLineWidth(this.model.lineWidth);
    }
}

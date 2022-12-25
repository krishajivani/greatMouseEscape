import {ANodeView} from "../../../ANodeView";
import {ALineGraphic} from "../../../../rendering";
import {LineModel2D} from "./LineModel2D";


export class LineView2D extends ANodeView{
    line!:ALineGraphic;
    get model():LineModel2D{
        return this._model as LineModel2D;
    }
    static Create(model:LineModel2D){
        let view = new LineView2D();
        view.setModel(model);
        return view;
    }

    init(){
        // this.lines = new ALineSegmentsGraphic(VertexArray3D.CreateForRendering(false, false, true))

        // this.line = ALineGraphic.Create(this.model.verts, this.model.material.threejs, this.model.lineWidth)
        this.line = new ALineGraphic();
        this.line.init(this.model.verts, this.model.material);
        // this.line.setLineWidth();
        this.addGraphic(this.line);
        // this.addGraphicToRoot(this.line);
    }

    update(): void {
        this.line.setVerts(this.model.verts);
        this.line.setLineWidth(this.model.lineWidth);
    }
}

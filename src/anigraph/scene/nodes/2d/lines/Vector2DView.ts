// import {ALineGraphic, ALineSegmentsGraphic, ANodeView, Mat3, V2, V3, VertexArray2D} from "../../../../index";
import {ALineGraphic, ALineSegmentsGraphic} from "../../../../rendering";
import {ANodeView} from "../../../ANodeView";
import {Mat3, V2, V3, VertexArray2D} from "../../../../math";
import {LineModel2D, LineSegmentsModel2D, LineSegmentsView2D} from "./index";
import {Vector2DModel} from "./Vector2DModel";

export class Vector2DView extends ANodeView {
    line!: ALineGraphic;
    arrowHead!: ALineSegmentsGraphic;
    arrowHeadVerts!:VertexArray2D;

    // arrowhead!:ALineSegmentsGraphic;
    get model(): Vector2DModel {
        return this._model as Vector2DModel;
    }

    static Create(model: LineModel2D) {
        let view = new Vector2DView();
        view.setModel(model);
        return view;
    }

    get headColor() {
        return this.model.verts.color.getAt(this.model.verts.nVerts - 1);
    }



    init() {
        this.line = new ALineGraphic();
        // this.line = new ALineSegmentsGraphic();
        this.line.init(this.model.verts, this.model.material);
        this.line.setLineWidth(this.model.lineWidth);
        this.addGraphic(this.line);

        this.arrowHeadVerts = new VertexArray2D();
        this.arrowHeadVerts.initColorAttribute();

        let headColor = this.headColor;
        this.arrowHeadVerts.addVertices([
                V2(),
                V2(-1, -1),
                V2(),
                V2(1, -1)
            ],
            [
                headColor,
                headColor,
                headColor,
                headColor
            ]
        )

        this.arrowHead = new ALineSegmentsGraphic();
        this.arrowHead.init(this.arrowHeadVerts, this.model.material);
        this.arrowHead.setLineWidth(this.model.lineWidth);
        this._setArrowheadTransform();
        this.addGraphic(this.arrowHead);


    }

    _setArrowheadTransform(){
        let ep =this.model.getEndPoint();
        let tvec = ep.getNormalized();
        let ahs = this.model.arrowheadSize;
        let tvrot = V2(-tvec.y, tvec.x);
        let aht = Mat3.FromColumns(V3(tvrot.x, tvrot.y, 0).times(ahs), V3(tvec.x, tvec.y, 0).times(ahs), V3(ep.x, ep.y, 1));
        this.arrowHead.setTransform(aht);
    }

    update(): void {
        this.line.setVerts(this.model.verts);
        this.line.setLineWidth(this.model.lineWidth);
        this._setArrowheadTransform();
    }
}


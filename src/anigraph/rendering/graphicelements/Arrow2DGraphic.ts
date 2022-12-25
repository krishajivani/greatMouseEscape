import {AGraphicGroup} from "../graphicobject";
import {ALineGraphic} from "./ALineGraphic";
import {ALineSegmentsGraphic} from "./ALineSegmentsGraphic";
import {Color, Mat3, V2, V3, VertexArray, VertexArray2D} from "../../math";
import * as THREE from "three";
import {AMaterial} from "../material";
import {LineSegmentsGeometry} from "three/examples/jsm/lines/LineSegmentsGeometry";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";

export class Arrow2DGraphic extends AGraphicGroup{
    line!:ALineGraphic;
    arrowHead!:ALineSegmentsGraphic;
    lineVerts!:VertexArray2D;
    arrowHeadSize:number=2;
    _arrowHeadVerts!:VertexArray2D;

    getLineWidth(){
        return this.line.material.linewidth;
    }
    setLineWidth(lineWidth:number){
        this.line.material.linewidth= lineWidth;
    }

    constructor() {
        super();
    }

    static Create(verts:VertexArray2D, material?:Color | THREE.Color | THREE.Material | THREE.Material[] | AMaterial, lineWidth?: number){
        let newArrowElement = new Arrow2DGraphic();
        newArrowElement.init(verts, material);
        if(lineWidth!==undefined) {
            newArrowElement.setLineWidth(lineWidth);
        }
        return newArrowElement;
    }

    init(verts: VertexArray2D, material?: Color | THREE.Color | THREE.Material | THREE.Material[] | AMaterial) {
        this.line = new ALineGraphic();
        this.lineVerts=verts;
        this.line.init(this.lineVerts, material);
        this.add(this.line);

        this._arrowHeadVerts = new VertexArray2D();
        this._arrowHeadVerts.initColorAttribute();
        let headColor = verts.color.getAt(verts.nVerts - 1);
        this._arrowHeadVerts.addVertices([
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
        this.arrowHead.init(this._arrowHeadVerts, material);
        this._setArrowheadTransform();
        this.add(this.arrowHead);
    }

    getEndPoint(){
        return this.lineVerts.getPoint2DAt(this.lineVerts.nVerts-1);
    }

    _setArrowheadTransform(){
        let ep =this.getEndPoint();
        let tvec = ep.getNormalized();
        let ahs = this.arrowHeadSize;
        let tvrot = V2(-tvec.y, tvec.x);
        let aht = Mat3.FromColumns(V3(tvrot.x, tvrot.y, 0).times(ahs), V3(tvec.x, tvec.y, 0).times(ahs), V3(ep.x, ep.y, 1));
        this.arrowHead.setTransform(aht);
    }

    setVerts(verts:VertexArray2D){
        this.lineVerts = verts;
        this.line.setVerts2D(this.lineVerts);
        let headColor = this.lineVerts.color.getAt(this.lineVerts.nVerts - 1);
        for(let i=0;i<4;i++){
            this._arrowHeadVerts.color.setAt(i,headColor);
        }
        this.arrowHead.setVerts2D(this._arrowHeadVerts);
        this._setArrowheadTransform();
    }

}


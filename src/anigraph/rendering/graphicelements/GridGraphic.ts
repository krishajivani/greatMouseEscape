import {ALineSegmentsGraphic} from "./ALineSegmentsGraphic";
import {Color, Mat4, V2, Vector, VertexArray, VertexArray2D} from "../../math";
import * as THREE from "three";
import {AMaterial} from "../material";
import {LineSegmentsGeometry} from "three/examples/jsm/lines/LineSegmentsGeometry";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";

export class GridGraphic extends ALineSegmentsGraphic{
    gridUnit:number=1;
    nVertical:number=20;
    nHorizontal:number=20;
    gridVerts!:VertexArray2D;
    gridTransform!:Mat4;
    color!:Color;

    constructor(nVertical?:number, nHorizontal?:number, material?: Color | THREE.Color | THREE.Material | THREE.Material[] | AMaterial, color?:Color,
                lineWidth?:number) {
        super()
        this.color = color??Color.FromRGBA(0.5,0.5,0.5,1.0);
        this.nVertical = nVertical??20;
        this.nHorizontal = nHorizontal??20;
        this.gridVerts = new VertexArray2D();
        this.gridVerts.initColorAttribute();
        let vertical = Math.floor(this.nVertical*0.5);
        let horizontal = Math.floor(this.nHorizontal*0.5);
        let xvals = Vector.LinSpace(-vertical, vertical, 2*vertical+1, true );
        let yvals = Vector.LinSpace(-horizontal, horizontal,2*horizontal+1, true );
        for(let xval of xvals.elements){
            this.gridVerts.addVertices([
                V2(xval, -horizontal),
                V2(xval, horizontal)
            ],
                [
                    this.color,
                    this.color
                ])
        }

        for(let yval of yvals.elements){
            this.gridVerts.addVertices([
                    V2(-vertical, yval),
                    V2(vertical, yval)
                ],
                [
                    this.color,
                    this.color
                ])
        }
        this._initIfNotAlready(this.gridVerts, material);
        if(lineWidth!==undefined){
            this.setLineWidth(lineWidth);
        }
        // this.axesTranformNode = this._element;
        // this._element = element;
        // this._element.add(this.axesTranformNode);
    }

    // setSourceTransform(mat:Mat4){
    //     mat.assignTo(this.axesTranformNode.element);
    // }

}

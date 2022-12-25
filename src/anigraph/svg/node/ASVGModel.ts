import {AObjectState, ASerializable} from "../../base";
import {ANodeModel, ANodeModel3D} from "../../scene";
import {SVGLoader, SVGParsedData} from "../SVGLoader";
import {SvgToThreeJsObject, ThreeJSObjectFromParsedSVG} from "../SvgToThreeJsObject";
import * as THREE from "three";
import {BoundingBox3D, Mat3, Mat4, V3} from "../../math";
import {FileLoader} from "three";
import {SVGAsset} from "../SVGAsset";

export enum SVGModelEnums{
    SelfSVGScaleListener = 'SelfSVGScaleListener'
}

@ASerializable("ASVGModel")
export class ASVGModel extends ANodeModel3D {
    svgAsset!:SVGAsset;
    // refObject3D!:THREE.Object3D;

    constructor(svgAsset?:SVGAsset) {
        super();
        if(svgAsset !== undefined){
            this._setAsset(svgAsset);
        }
    }

    _setAsset(svgAsset:SVGAsset){
        this.svgAsset=svgAsset;
        this.geometry.addMember(this.svgAsset);
    }

    static FromAsset(svgAsset:SVGAsset){
        return new this(svgAsset);
    }

    static async LoadFromSVG(svgURL:string){
        let svgAsset:SVGAsset = await SVGAsset.Load(svgURL);
        return new this(svgAsset);
    }

    getBounds():BoundingBox3D{
        // let b = this._svgBounds.clone();
        // let threebox = new THREE.Box3().setFromObject(this.refObject3D);
        return this.geometry.getBounds();
        // let bounds = new BoundingBox3D()
        // bounds.minPoint=V3(threebox.min.x, threebox.min.y, threebox.min.z);
        // bounds.maxPoint=V3(threebox.max.x, threebox.max.y, threebox.max.z);
        // bounds.transform = this.transform;
        //     // this.getWorldTransform();
        // return bounds;
    }
}

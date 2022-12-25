import {ANodeModel, ANodeView} from "../../scene";
import {ThreeJSObjectFromParsedSVG} from "../SvgToThreeJsObject";
import {ATriangleMeshGraphic} from "../../rendering";
import {ASVGModel} from "./ASVGModel";
import {ASVGGraphic} from "./ASVGGraphic";
import {Object3D} from "three";
import * as THREE from "three";

export class ASVGView extends ANodeView{
    protected _model!:ASVGModel;
    svgGraphic!:ASVGGraphic;
    get model():ASVGModel{
        return this._model;
    }


    static Create(model:ASVGModel){
        let view = new this();
        view.setModel(model);
        return view;
    }

    init(){
        this.svgGraphic = ASVGGraphic.Create(this.model.svgAsset);
        this.addGraphic(this.svgGraphic);
    }

    update(): void {
        this.svgGraphic.setTransform(this.model.transform);
    }
}

import * as THREE from "three";
import {AModelInterface, AView, HasModelViewMap, MVMViewMap} from "../base";
import {ASceneController} from "./ASceneController";
import {ANodeView} from "./ANodeView";
import {ASceneModel} from "./ASceneModel";


export class ASceneView extends AView implements HasModelViewMap {
    protected _viewMap: MVMViewMap = {};
    protected _controller!:ASceneController;
    get controller(){return this._controller;}
    get model(){return this.controller.model;}
    get modelID(){return this.model.uid;}
    get viewMap(){return this._viewMap;}
    _threejs!:THREE.Object3D;
    get threejs():THREE.Scene{
        return this._threejs as THREE.Scene;
    }

    constructor(controller:ASceneController) {
        super();
        this._controller = controller;
        this._threejs = new THREE.Scene();
    }

    hasModel(model:AModelInterface){return this.controller.hasModel(model);};
    hasView(view:AView){
        return (view.uid in this.viewMap[view.modelID]);
    }
    addView(view:ANodeView){
        if(this.viewMap[view.modelID]===undefined){
            this.viewMap[view.modelID]={};
        }
        this.viewMap[view.modelID][view.uid]=view;
        this.threejs.add(view._threejs);
    }
    removeView(view:AView){
        this.threejs.remove(view._threejs);
        delete this.viewMap[view.modelID][view.uid];
    }
    getViewListForModel(model:AModelInterface):ANodeView[]{
        if(this.hasModel(model)) {
            return Object.values(this.viewMap[model.uid]);
        }
        else{
            return [];
        }
    }
}


/**
 * Base class for views in the Anigraph MVC scheme.
 * The primary responsibility for each view subclass is to specify how a model translates into Three.js rendering calls. The view itself should hold Three.js objects and make them available to controllers for specifying interactions.
 * Views should always be initialize
 */
import * as THREE from "three";
import {ANodeModel} from "./ANodeModel";
import {AView} from "../base/amvc/AView";
import {AGraphicObject} from "../rendering/graphicobject";
import {Mat3, Mat4, TransformationInterface} from "../math";
import {AObject} from "../base";
import {AMaterial} from "../rendering/material";

export enum BASIC_VIEW_SUBSCRIPTIONS{
    MODEL_STATE_LISTENER='VIEW_MODEL_STATE_LISTENER',
    MODEL_RELEASE_LISTENER='VIEW_MODEL_RELEASE_LISTENER',
    MODEL_GEOMETRY_LISTENER='VIEW_MODEL_GEOMETRY_LISTENER'
}

export type NodeViewCallback = (view:ANodeView, ...args: any[]) => any;

// export interface AViewInterface extends AObject {
//     threejs: THREE.Object3D;
//     model:AModelInterface;
//     controller:AControllerInterface;
// }




enum ANODEVIEW_MATERIAL_EVENTS{
    UPDATE="AVIEW_MATERIAL_UPDATE",
    CHANGE="AVIEW_MATERIAL_CHANGE",
    COLOR="AVIEW_MATERIAL_COLOR"

}

/**
 * Base View Class
 */
export abstract class _ANodeView extends AView{
    abstract init():void;
    abstract update(...args:any[]):void;
    protected abstract _initializeThreeJSObject():void;

    protected _model!:ANodeModel;
    get model(){
        return this._model;
    }

    //##################//--Graphic Objects--\\##################
    //<editor-fold desc="Graphic Objects">

    /*
    ToDo: should write docs for this
     */
    protected graphics:{[uid:string]:AGraphicObject}={};
    addGraphic(graphic:AGraphicObject){
        this.registerGraphic(graphic);
        this.threejs.add(graphic.threejs);
    }

    registerGraphic(graphic:AGraphicObject){
        this.graphics[graphic.uid]=graphic;
    }

    // addGraphicToRoot(graphic:AGraphicObject){
    //     this.threejs.add(graphic.threejs);
    // }

    _removeGraphic(graphic:AGraphicObject){
        this.threejs.remove(graphic.threejs);
        delete this.graphics[graphic.uid];
    }

    moveGraphicToBack(graphic:AGraphicObject){
        this._removeGraphic(graphic);
        this.addGraphic(graphic);
        // addGraphicToRoot(graphic);
    }

    getGraphicList(){
        return Object.values(this.graphics);
    }
    mapOverGraphics(fn:(graphic:AGraphicObject)=>any[]|void){
        return this.getGraphicList().map(fn);
    }

    //</editor-fold>
    //##################\\--Graphic Objects--//##################

    setModelListeners(){
        const self=this;
        this.unsubscribe(BASIC_VIEW_SUBSCRIPTIONS.MODEL_STATE_LISTENER, false);
        this.subscribe(this.model.addStateListener(()=>{self.update()}));
        this.unsubscribe(BASIC_VIEW_SUBSCRIPTIONS.MODEL_RELEASE_LISTENER, false);
        this.subscribe(this.model.addEventListener(ANodeModel.AModelEvents.RELEASE, ()=>{self.dispose()}));
        this.unsubscribe(BASIC_VIEW_SUBSCRIPTIONS.MODEL_GEOMETRY_LISTENER, false);
        this.subscribe(this.model.addGeometryListener(()=>{self.update()}));
    }

    /**
     * The three.js object for this view. Should be a subclass of THREE.Object3D
     * @type {THREE.Object3D}
     */
    _threejs!:THREE.Object3D;
    get threejs():THREE.Object3D{
        return this._threejs;
    }

    setModel(model:ANodeModel){
        this._model = model;
        this._initializeThreeJSObject();
        this._threejs.matrixAutoUpdate=false;
        this.init();
        this.setModelListeners()
    }

    get modelID():string{
        return this.model.uid;
    }

    disposeGraphics(){
        let graphicKeys = Object.keys(this.graphics);
        for(let e of graphicKeys){
            let graphic = this.graphics[e];
            this._removeGraphic(graphic);
            graphic.dispose();
        }
    }

    dispose(){
        this.disposeGraphics();
    }

    release() {
        this.dispose();
        super.release();
    }
}

export abstract class ANodeView extends _ANodeView{
    protected _initializeThreeJSObject(){
        this._threejs = new THREE.Group();
    }

    static MaterialUpdates = ANODEVIEW_MATERIAL_EVENTS;

    get threejs():THREE.Group{
        return this._threejs as THREE.Group;
    }

    setTransform(transform:TransformationInterface){
        (transform.getMatrix() as Mat4).assignTo(this.threejs.matrix);
    }

    setModelListeners(){
        super.setModelListeners();
        this._initMaterialListener();
    }

    _initMaterialListener(){
        const self=this;
        this.addMaterialUpdateCallback((...args:any[])=>{
                self.onMaterialUpdate(...args);
            },
            AMaterial.Events.UPDATE)
        this.addMaterialChangeCallback(()=>{
                self.onMaterialChange();
            },
            AMaterial.Events.CHANGE)

        this.addModelColorCallback((...args:any[])=>{
                self.onModelColorChange();
            },
            "Material Color Change")
    }

    onMaterialUpdate(...args:any[]){
        const self = this;
        this.mapOverGraphics((element:AGraphicObject)=>{
            element.onMaterialUpdate(self.model.material, ...args);
        })
    }

    onMaterialChange(){
        const self = this;
        this.mapOverGraphics((element:AGraphicObject)=>{
            element.onMaterialChange(self.model.material);
        })
    }

    onModelColorChange(){
        const self = this;
        this.mapOverGraphics((element:AGraphicObject)=>{
            if('setColor' in element){
                element.setColor(self.model.color);
            }
        })
    }

    addMaterialUpdateCallback(callback:(self?:AObject)=>void, handle?:string){
        const self = this;
        this.subscribe(
            self.model.addMaterialUpdateListener( ()=>{
                callback();
            }),
            handle
        );
    }

    addMaterialChangeCallback(callback:(self?:AObject)=>void, handle?:string){
        const self = this;
        this.subscribe(
            self.model.addMaterialChangeListener( ()=>{
                callback();
            }),
            handle
        );
    }

    addModelColorCallback(callback:(self?:AObject)=>void, handle?:string){
        const self = this;
        this.subscribe(
            self.model.addColorListener( ()=>{
                callback();
            }),
            handle
        );
    }
}


export abstract class ANodeView2D extends ANodeView{
    setTransform(transform:TransformationInterface){
        if(transform instanceof Mat3){
            transform.Mat4From2DH().assignTo(this.threejs.matrix);
        }else{
            (transform.getMatrix() as Mat4).assignTo(this.threejs.matrix);
        }
    }
}

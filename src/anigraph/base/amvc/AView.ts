/**
 * Base class for views in the Anigraph MVC scheme.
 * The primary responsibility for each view subclass is to specify how a model translates into Three.js rendering calls. The view itself should hold Three.js objects and make them available to controllers for specifying interactions.
 * Views should always be initialize
 */
import * as THREE from "three";
import {AObject} from "../aobject";
import {AController} from "./AController";


// export interface AViewInterface extends AObject {
//     threejs: THREE.Object3D;
//     model:AModelInterface;
//     controller:AControllerInterface;
// }

export type ViewCallback = (view:AView, ...args: any[]) => any;

/**
 * Base View Class
 */
export abstract class AView extends AObject{
    /**
     * The three.js object for this view. Should be a subclass of THREE.Object3D
     * @type {THREE.Object3D}
     */
    abstract _threejs: THREE.Object3D;
    protected _controller!:AController;
    get controller(){return this._controller;}

    abstract get modelID():string;



    // //##################//--viewRef--\\##################
    // // viewRefs is a place to hold references that aren't class members.
    // //<editor-fold desc="viewRef">
    // public viewRefs:{[name:string]:any}={};
    // setViewRef(name:string, value:any){
    //     this.viewRefs[name]=value;
    // }
    // getViewRef(name:string){
    //     return this.viewRefs[name];
    // }
    // clearViewRefs(){
    //     this.viewRefs={};
    // }
    // //</editor-fold>
    // //##################\\--viewRef--//##################

}

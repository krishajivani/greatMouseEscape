import {AObject} from "../aobject";
import {AView} from "./AView";
import {AModelInterface} from "./AModel";
import {ANodeView} from "../../scene";


export type MVMModelMap = {[modelID: string]:AModelInterface};
export type MVMViewMap = {[modelID: string]: {[viewID: string]:ANodeView}};



export interface HasModelMap extends AObject{
    get modelMap():MVMModelMap;
    // _addModel(model:AModelInterface):void;
    // _removeModel(model:AModelInterface):void;
    hasModel(model:AModelInterface):boolean;
    hasModelID(modelID:string):boolean;
}

export interface HasModelViewMap{
    get viewMap():MVMViewMap;
    addView(view:AView):void;
    removeView(view:AView):void;
    getViewListForModel(model:AModelInterface):AView[];
    hasView(view:AView):boolean;
}

// export class AModelViewMap extends AObject implements HasModelViewMap{
//     protected _modelMap:MVMModelMap = {};
//     protected _viewMap: MVMViewMap = {};
//
//     /** Get set map */
//     get modelMap(){return this._modelMap;}
//     get viewMap(){return this._viewMap;}
//
//     hasModel(model:AModelInterface){
//         return (model.uid in this.modelMap);
//     }
//
//     _hasModelID(modelID:string){
//         return (modelID in this.modelMap);
//     }
//
//     addModel(model:AModelInterface){
//         if(this.hasModel(model)){
//             throw new Error(`Model ${model} with uid ${model.uid} already in AModelViewMap`)
//         }
//         this.modelMap[model.uid]=model;
//         this.viewMap[model.uid]={};
//     }
//
//     removeModel(model:AModelInterface){
//         delete this._modelMap[model.uid];
//         delete this._viewMap[model.uid];
//     }
//
//     hasView(view:AView){
//         return (this._hasModelID(view.modelID) && view.uid in this.modelMap);
//     }
//
//     addView(view:AView){
//         let modelViews = this.viewMap[view.modelID][view.uid]=view;
//     }
//
//     removeView(view:AView){
//         delete this.viewMap[view.modelID][view.uid];
//     }
//
//     getViewListForModel(model:AModelInterface){
//         if(this.hasModel(model)) {
//             return Object.values(this.viewMap[model.uid]);
//         }
//         else{
//             return [];
//         }
//     }
// }


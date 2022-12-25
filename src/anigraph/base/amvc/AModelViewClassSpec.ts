
// export interface AMVCMapEntry<NodeModelType extends ASceneNodeModel>{
//     modelClass:AModelClassInterface<AModelInterface>;
//     viewClass:AViewClassInterface;
//     controllerClass:ClassInterface<AControllerInterface<NodeModelType>>,
//     details:GenericDict
// }

// export const enum AMVCMapEntryDetail{
//     CAN_SELECT_IN_GUI='CAN_SELECT_IN_GUI',
//     CAN_CLICK_TO_CREATE='CAN_CLICK_TO_CREATE',
// }




// export type AMVCNodeClassSpec<NodeModelType extends ASceneNodeModel> = [AModelClassInterface<AModelInterface>, AViewClassInterface, AControllerClassInterface<ASceneNodeController<ASceneNodeModel>>, AMVCMapDetailDict];

// export function NewAMVCNodeClassSpec(
//     modelClass:AModelClassInterface<ASceneNodeModel>,
//     viewClass:AViewClassInterface,
//     controllerClass:AControllerClassInterface<ASceneNodeController<ASceneNodeModel>>,
//     details?:AMVCMapDetailDict
// ):AMVCNodeClassSpec<ASceneNodeModel>{
//     details = (details!==undefined)?details:{};
//     // if(details){
//     return [modelClass, viewClass, controllerClass, details];
//     // }else{
//     //     return [modelClass, viewClass, controllerClass, {}];
//     // }
//
// }


import {ClassInterface} from "../basictypes";
import {ANodeModel, ANodeView} from "../../scene";


export interface AMVClassSpecDetails {
    isGUIOption?:boolean;
    canDrawVerts?:boolean;
    canCreateDefault?:boolean;
}
function AMVClassSpecDetailWithDefaults(d:AMVClassSpecDetails){
    let defaultValues:AMVClassSpecDetails = {
        isGUIOption:true,
        canDrawVerts:true,
        canCreateDefault:true,
    }
    return {...defaultValues, ...d};
}

export class AMVClassSpec {
    modelClass:ClassInterface<ANodeModel>;
    viewClass:ClassInterface<ANodeView>;
    details:AMVClassSpecDetails;
    constructor(modelClass:ClassInterface<ANodeModel>,
                viewClass:ClassInterface<ANodeView>,
                details?:AMVClassSpecDetails) {
        this.modelClass=modelClass;
        this.viewClass=viewClass;
        this.details = AMVClassSpecDetailWithDefaults(details?details:{});
    }
}

export class AModelViewClassMap {
    protected _classMap:{[modelClassName:string]:AMVClassSpec};
    constructor(specs?:AMVClassSpec[]) {
        this._classMap = {};
        if(specs){
            this.addSpecs(specs);
        }
    }

    get modelClassNames(){return Object.keys(this._classMap);}
    get specs(){return Object.values(this._classMap);}


    getGUIModelOptions(){
        let rval:{[name:string]:string}={}
        // let rval = [];
        for(let m in this._classMap){
            if(this._classMap[m].details.isGUIOption){
                rval[m]=m;
            }
        }
        return rval;
    }
    getGUIModelOptionsList(){
        let rval = [];
        for(let m in this._classMap){
            if(this._classMap[m].details.isGUIOption){
                rval.push(m);
            }
        }
        return rval;
    }

    getSpecForModel(model:string|ClassInterface<ANodeModel>|ANodeModel){
        if(model instanceof ANodeModel){
            return this._classMap[model.serializationLabel];
        }else if (typeof model ==='string'||model instanceof String) {
            return this._classMap[model as string];
        }else{
            return this._classMap[(model as ClassInterface<ANodeModel>).name];
        }
    }

    _viewClassForModel(model:string|ClassInterface<ANodeModel>|ANodeModel){
        return this.getSpecForModel(model).viewClass;
    }

    _classDetailsForModel(model:string|ClassInterface<ANodeModel>|ANodeModel){
        return this.getSpecForModel(model).details;
    }

    addSpecs(specs:AMVClassSpec|AMVClassSpec[]){
        if(Array.isArray(specs)){
            for(let spec of specs){
                this.addSpec(spec);
            }
        }else{
            this.addSpec(specs);
        }
    }
    addSpec(spec:AMVClassSpec){
        // if(spec.modelClass.hasOwnProperty('SerializationLabel')){
        // let serializationLabel = spec.modelClass.SerializationLabel();
        if('SerializationLabel' in spec.modelClass){
            // @ts-ignore
            let label:string = spec.modelClass.SerializationLabel();
            this._classMap[label]=spec;

        }else{
            this._classMap[spec.modelClass.name]=spec;
            // if(label!==spec.modelClass.name){
            //     console.warn(`Serialization label ${label} is different from class name ${spec.modelClass.name}`)
            // }
            console.warn(`Class ${spec.modelClass.name} not given serialization label`)
        }


    }
}

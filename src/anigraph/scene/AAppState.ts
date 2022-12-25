import {AObject, AObjectState, ASerializable, CallbackType} from "../base";
import {Color} from "../math/Color";
import {AHandlesEvents} from "../base/aobject/AHandlesEvents";
import {v4 as uuidv4} from "uuid";
import {proxy} from "valtio/vanilla";




type _GUIControlSpec={[name:string]:any};

export type AppStateValueChangeCallback =(v:any)=>void;

export interface GUIControlSpec extends _GUIControlSpec{
    value:any;
    onChange:AppStateValueChangeCallback;
}
var _appState:AAppState;

export enum AppStateEvents{
    TRIGGER_CONTROL_PANEL_UPDATE='TRIGGER_CONTROL_PANEL_UPDATE'
}

export function SetAppState(appState:AAppState):AAppState{
    if(_appState !== undefined){
        throw new Error(`Already set the app state to ${_appState}`);
    }
    _appState = appState;
    _appState.init();
    return _appState;
}

enum AppStateKeys{
    InteractionMode="InteractionMode",
    GUI_KEY="GUI_KEY"
}


@ASerializable("AAppState")
export class AAppState extends AHandlesEvents{
    stateValues:{[name:string]:any};
    GUIControlSpecs:{[name:string]:GUIControlSpec}={};
    static AppStateEvents=AppStateEvents
    static AppStateDefaultKeys=AppStateKeys;

    init(){}

    /** Get set guiKey */
    set _guiKey(value){this.stateValues[AAppState.AppStateDefaultKeys.GUI_KEY]=value;}
    get _guiKey(){return this.stateValues[AAppState.AppStateDefaultKeys.GUI_KEY];}

    getAppStateValue(key:string){
        return this.stateValues[key];
    }

    constructor() {
        super();
        this.stateValues=proxy({});
        this.stateValues[AAppState.AppStateDefaultKeys.GUI_KEY]=uuidv4();
    }

    updateControlPanel(){
        this.signalEvent(AAppState.AppStateEvents.TRIGGER_CONTROL_PANEL_UPDATE);
    }

    addControlPanelListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        return this.addEventListener(AAppState.AppStateEvents.TRIGGER_CONTROL_PANEL_UPDATE, callback, handle);
    }


    _GetOnChangeForName(parameterName:string):AppStateValueChangeCallback{
        const self = this;
        return (v:any)=>{
            self.signalEvent(AAppState.GetEventKeyForName(parameterName), v);
        }

    }

    _MakeSliderSpec(name:string, initialValue:any, min?:number, max?:number, step?:number, otherSpecs?:{[name:string]:any}):GUIControlSpec{
        const self = this;
        let specs:GUIControlSpec = {
            value: initialValue,
            onChange: self._GetOnChangeForName(name),
            ...otherSpecs
        }
        if(min!==undefined){
            specs['min']=min;
        }
        if(max!==undefined){
            specs['max']=max;
        }
        if(step!==undefined){
            specs['step']=step;
        }
        return specs;
    }

    _MakeColorPickerSpec(name:string, initialValue:Color, otherSpecs?:{[name:string]:any}):GUIControlSpec{
        const self = this;
        let specs:GUIControlSpec = {
            value: initialValue.toHexString(),
            onChange: (v:string)=>{return self._GetOnChangeForName(name)(Color.FromString(v));},
            ...otherSpecs
        }
        return specs;
    }

    _MakeSelectionSpec(name:string, initialValue:any, options:any[], otherSpecs?:{[name:string]:any}):GUIControlSpec{
        const self = this;
        let specs:GUIControlSpec={
                value: initialValue,
                options: options,
                onChange: self._GetOnChangeForName(name),
            ...otherSpecs
        }
        return specs;
    }


    static GetEventKeyForName(name:string):string{
        return `Parameter_${name}_update_event`;
    }

    setGUIControlSpecKey(name:string, spec:GUIControlSpec){
        this.GUIControlSpecs[name]= spec;
        this.updateControlPanel();
    }

    addSliderControl(name:string, initialValue:any, min?:number, max?:number, step?:number){
        this.setGUIControlSpecKey("Difficulty Level", this._MakeSliderSpec(name, initialValue, min, max, step))
    }

    addColorControl(name:string, initialValue:Color){
        this.setGUIControlSpecKey(name,this._MakeColorPickerSpec(name, initialValue));
    }

    addSelectionControl(name:string, initialValue:any, options:any[], otherSpecs?:{[name:string]:any}){
        this.setGUIControlSpecKey(name,this._MakeSelectionSpec(name, initialValue, options, otherSpecs));
    }


    addStateValueListener(
        stateName: string,
        callback: AppStateValueChangeCallback,
        handle?: string
    ) {
        return this.addEventListener(
            AAppState.GetEventKeyForName(stateName),
            callback,
            handle,
            );
    }

    addControlSpec(controlSpec:{[name:string]:GUIControlSpec}){
        this.GUIControlSpecs = {
            ...this.GUIControlSpecs,
            ...controlSpec
        };
    }

}


export function GetAAppStateBase():AAppState{
    if(_appState===undefined){
        throw new Error("Must set app state!");
        // _appState = new AAppState();
    }
    return _appState;
}

import {AInteractionMode, BasicInteractionModes} from "./AInteractionMode";
import {HasInteractions} from "../amvc/HasInteractions";

// export enum BasicInteractionModes{
//     default='default'
// }

export class AInteractionModeMap{
    public modes:{[name:string]:AInteractionMode}={};
    private _activeModeNames:string[]=[];
    public owner:HasInteractions;


    getGUISelectableModesOptions(){
        let rval:{[name:string]:string}={}
        // let rval = [];
        for(let m in this.modes){
            if(this.modes[m].isGUISelectable){
                rval[m]=m;
            }
        }
        return rval;
    }
    getGUISelectableModesList(){
        let rval = [];
        for(let m in this.modes){
            if(this.modes[m].isGUISelectable){
                rval.push(m);
            }
        }
        return rval;
    }
    // get _activeModeName(){
    //     if(this._activeModeNames.length===1) {
    //         return this._activeModeNames[0]
    //     }else{
    //         throw new Error("Multiple interaction modes are active");
    //     }
    // }

    // get activeMode(){
    //     return this.modes[this._activeModeName];
    // }

    constructor(owner:HasInteractions){
        this.owner = owner;
        this.defineMode(BasicInteractionModes.Default);
        this.setActiveMode(BasicInteractionModes.Default);
    }

    defineMode(name:string, mode?:AInteractionMode){
        if(name in this.modes){
            console.warn(`you are redefining interaction mode ${name}`);
            this.modes[name].deactivate();
        }
        if(mode ===undefined){
            this.modes[name]=new AInteractionMode(name, this.owner);
        }else{
            this.modes[name]=mode;
        }

    }

    modeIsDefined(name:string){
        return name in this.modes;
    }

    undefineMode(name:string){
        if(name in this.modes){
            this.modes[name].deactivate();
            delete this.modes[name];
        }else{
            console.warn(`you are trying to undefine interaction mode ${name} that doesn't exist`);
        }
    }
    _getActiveModes(){
        const activeModes = [];
        for(const mode in this.modes){
            if(this.modes[mode].active){
                activeModes.push(this.modes[mode]);
            }
        }
        return activeModes;
    }
    _setActiveInteractionModes(modeNames:string[]){
        const oldActiveModes = this._getActiveModes();
        for(const oldmode of oldActiveModes){
            if(!modeNames.includes(oldmode.name)){
                oldmode.deactivate();
            }
        }
        for(let modeName of modeNames){

            // if(!this.modes[modeName]){
            //     console.log(modeName);
            // }
            if(!this.modes[modeName].active){
                this.modes[modeName].activate();
            }
        }
        this._activeModeNames=modeNames;
    }
    setActiveMode(modeName:string){
        this._setActiveInteractionModes([modeName]);
    }
    _activateAllModes(){
        this._setActiveInteractionModes(Object.keys(this.modes));
    }
    deactivateAll(){
        this._setActiveInteractionModes([]);
    }

    dispose(){
        this.deactivateAll();
    }

}



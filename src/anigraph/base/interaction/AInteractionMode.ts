import {AInteraction} from "./AInteraction";
import {HasInteractions} from "../amvc/HasInteractions";

export interface AInteractionModeInterface{
    interactions:AInteraction;
}

export enum BasicInteractionModes{
    Default='Default'
}


export class AInteractionMode{
    public name!:string;
    public owner!:HasInteractions;
    protected interactions:AInteraction[]=[];
    protected _afterActivate!:(...args:any[])=>any;
    protected _afterDeactivate!:(...args:any[])=>any
    protected _beforeActivate!:(...args:any[])=>any;
    protected _beforeDeactivate!:(...args:any[])=>any

    public modeState:{[name:string]:any}={};
    setModeState(name:string, value:any){this.modeState[name]=value;}
    getModeState(name:string){return this.modeState[name];}
    clearModeState(){this.modeState={};}



    afterActivate(...args:any[]){if(this._afterActivate) {this._afterActivate(...args);}}
    afterDeactivate(...args:any[]){if(this._afterDeactivate) {this._afterDeactivate(...args);}}
    beforeActivate(...args:any[]){if(this._beforeActivate) {this._beforeActivate(...args);}}
    beforeDeactivate(...args:any[]){if(this._beforeDeactivate) {this._beforeDeactivate(...args);}}

    bindMethods(){
        this.afterActivate = this.afterActivate.bind(this);
        this.afterDeactivate = this.afterDeactivate.bind(this);
        this.beforeActivate = this.beforeActivate.bind(this);
        this.beforeDeactivate = this.beforeDeactivate.bind(this);
    }

    public active:boolean=false;
    public isGUISelectable:boolean=true;

    constructor(name?:string, owner?:HasInteractions, ...args:any[]){
        if(name) this.name = name;
        if(owner) this.owner = owner;
        this.bindMethods();
    }

    /**
     * adds interaction, and sets its owner to be this owner
     * @param interaction
     */
    addInteraction(interaction:AInteraction){
        // if(this.active){
        //     throw new Error("Cannot add interactions to an active interaction mode!");
        // }
        this.interactions.push(interaction);
        if(this.active && !interaction.active){
            interaction.activate();
        }
        if(!this.active && interaction.active){
            interaction.deactivate();
        }
        if(interaction.owner){
            throw new Error('interaction already has owner!');
        }
        interaction.owner = this.owner;
    }

    deactivate(){
        this.beforeDeactivate();
        for (let interaction of this.interactions) {
            interaction.deactivate();
        }
        this.clearModeState();
        this.afterDeactivate();
        this.active=false;
    }

    activate(){
        this.beforeActivate();
        for (let interaction of this.interactions) {
            interaction.activate();
        }
        this.afterActivate();
        this.active=true;
    }


    setAfterActivateCallback(callback:(...args:any[])=>any){
        this._afterActivate = callback;
    }
    setBeforeActivateCallback(callback:(...args:any[])=>any){
        this._beforeActivate = callback;
    }
    setAfterDeactivateCallback(callback:(...args:any[])=>any){
        this._afterDeactivate = callback;
    }
    setBeforeDeactivateCallback(callback:(...args:any[])=>any){
        this._beforeDeactivate = callback;
    }
}



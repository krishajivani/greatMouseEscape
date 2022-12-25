import {
    AInteraction,
    AInteractionEvent,
    AReceivesInteractionsInterface, DOMPointerEvents,
} from "../AInteraction";
import {CallbackType} from "../../basictypes";


export type ADOMPointerMoveInteractionCallback = (event:AInteractionEvent, interaction?:ADOMPointerMoveInteraction)=>any;

export class ADOMPointerMoveInteraction extends AInteraction{
    public pointerState:{[name:string]:any}={};
    clearPointerState(){
        this.pointerState={};
    }
    setPointerState(name:string, value:any){
        this.pointerState[name]=value;
    }
    getPointerState(name:string){
        return this.pointerState[name];
    }



    static Create(element:any, moveCallback:ADOMPointerMoveInteractionCallback, handle?:string, ...args:any[]){
        const interaction = new this(element, moveCallback, handle);
        interaction.bindMethods();
        return interaction;
    }

    constructor(element:AReceivesInteractionsInterface, callback:CallbackType, handle?:string){
        super(element, undefined, handle);
        const self = this;
        this.moveCallback = callback??this.moveCallback;

        this.addDOMEventListener(DOMPointerEvents.POINTER_MOVE, (event:AInteractionEvent)=>{
            self.moveCallback(event, self);
        });
    }

    moveCallback(event:AInteractionEvent, interaction?:ADOMPointerMoveInteraction){
        console.warn(`No click callback specified for event ${event}`);
    }

    bindMethods() {
        super.bindMethods();
        // this.moveCallback = this.moveCallback.bind(this);
    }
}

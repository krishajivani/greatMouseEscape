import {
    AInteraction,
    AInteractionEvent,
    AReceivesInteractionsInterface,
    PointerEvents
} from "./AInteraction";
import {CallbackType} from "../basictypes";


export type AWheelInteractionCallback = (interaction:AWheelInteraction, event?:AInteractionEvent)=>any;

export class AWheelInteraction extends AInteraction{
    static Create(element:any, moveCallback:AWheelInteractionCallback, handle?:string, ...args:any[]){
        const interaction = new this(element, moveCallback, handle);
        interaction.bindMethods();
        return interaction;
    }
    constructor(element:AReceivesInteractionsInterface, callback:CallbackType, handle?:string){
        super(element, undefined, handle);
        const self = this;
        this.wheelCallback = callback??this.wheelCallback;
        this.addDOMEventListener(PointerEvents.POINTER_WHEEL, (event:AInteractionEvent)=>{
            event.preventDefault();
            self.wheelCallback(self, event);
        });
    }

    wheelCallback(interaction:AWheelInteraction, event:AInteractionEvent){
        console.log(event);
    }

    bindMethods() {
        super.bindMethods();
    }
}

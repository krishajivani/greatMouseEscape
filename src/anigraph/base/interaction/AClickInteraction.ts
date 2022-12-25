import {
    AInteraction,
    AInteractionEvent,
    AInteractionEventListener,
    AReceivesInteractionsInterface,
    PointerEvents
} from "./AInteraction";
import {CallbackType} from "../basictypes";

export class AClickInteraction extends AInteraction{
    static Create(element:any, clickCallback?:CallbackType, handle?:string, ...args:any[]){
        const interaction = new this(element, clickCallback, handle);
        interaction.bindMethods();
        // if(clickCallback!==undefined){
        //     interaction.addEventListener("click", clickCallback);
        // }else {
        //     interaction.addEventListener("click", interaction.clickCallback);
        // }
        return interaction;
    }

    constructor(element:AReceivesInteractionsInterface, eventListeners?:AInteractionEventListener[], handle?:string);
    constructor(element:AReceivesInteractionsInterface, callback?:CallbackType, handle?:string);
    constructor(element:AReceivesInteractionsInterface, ...args:any[]){
        let eventListeners = undefined;
        let callback = undefined;
        let handle = (args.length>1 && typeof args[1] === 'string')?args[1]:undefined;
        if(args.length>0){
            if(Array.isArray(args[0])){
                eventListeners=args[0];
            }else{
                callback=args[0];
            }
        }

        super(element, eventListeners, handle);
        if(callback){
            this.clickCallback = callback;
            this.addEventListener(PointerEvents.POINTER_CLICK, callback);
        }
    }

    clickCallback(event:AInteractionEvent){
        console.warn(`No click callback specified for event ${event}`);
    }

    bindMethods() {
        super.bindMethods();
        this.clickCallback = this.clickCallback.bind(this);
    }
}

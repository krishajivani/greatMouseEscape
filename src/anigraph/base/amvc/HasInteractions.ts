import {AInteraction, AInteractionMode, AInteractionModeMap} from "../interaction";

export interface HasInteractions{
    get interactionMode():AInteractionMode;
    addInteraction(interaction: AInteraction):void;
    activateInteractions():void;
    setCurrentInteractionMode(name?: string):void;
    defineInteractionMode(name: string, mode?: AInteractionMode):void;
    clearInteractionMode(name: string):void;
    isInteractionModeDefined(name: string):boolean;
    get eventTarget():EventTarget;
}




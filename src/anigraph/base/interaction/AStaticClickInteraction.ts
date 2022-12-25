import {ADragInteractionBase} from "./ADragInteraction";
import {CallbackType} from "../basictypes";
import {AInteractionEvent} from "./AInteraction";


export class AStaticClickInteraction extends ADragInteractionBase{
    public dragAllowance=10;//allowance in pixels
    static Create(element:any,
                  clickCallback:CallbackType,
                  handle?:string){
        const interaction = new this(element, undefined, handle);
        interaction.setDragStartCallback((interaction:AStaticClickInteraction, event:AInteractionEvent)=>{
            interaction.setInteractionState('noDrag', true);
            interaction.setInteractionState('dragStartCursor', event.cursorPosition);
        });
        interaction.setDragMoveCallback((interaction:AStaticClickInteraction, event:any)=>{
            if(event.cursorPosition.minus(interaction.getInteractionState('dragStartCursor')).L2()>interaction.dragAllowance) {
                interaction.setInteractionState('noDrag', false);
            }
        });
        interaction.setDragEndCallback((interaction:AStaticClickInteraction, event:any)=>{
            if(interaction.getInteractionState('noDrag')){
                clickCallback(event);
            }
        });
        interaction.bindMethods();
        return interaction;
    }

}

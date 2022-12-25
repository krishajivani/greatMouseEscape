import {
    AClickInteraction,
    ADragInteraction, ADragInteractionCallback,
    AGLContext,
    AInteractionEvent, AKeyboardInteraction, AKeyboardInteractionCallback,
    ANodeModel,
    Basic2DSceneController, CallbackType,
    Vec2
} from "../../anigraph";
import {CreativeSceneModelBase} from "./CreativeSceneModelBase";

export abstract class CreativeSceneControllerBase extends Basic2DSceneController {
    get model(): CreativeSceneModelBase {
        return this._model as CreativeSceneModelBase;
    }

    async initScene(): Promise<void> {
        super.initScene();
    }

    abstract initModelViewSpecs():void;

    //###############################################//--Defining Interaction Modes--\\###############################################
    //<editor-fold desc="Defining Interaction Modes">


    onAnimationFrameCallback(context: AGLContext) {
        this.model.timeUpdate(this.model.clock.time);
        super.onAnimationFrameCallback(context);
    }

    createViewForNodeModel(nodeModel: ANodeModel) {
        return super.createViewForNodeModel(nodeModel)
    }

    initInteractions() {
        const self = this;
        super.initInteractions();
    }

    //###############################################//--Custom additional interaction mode--\\###############################################
    //<editor-fold desc="Custom additional interaction mode">
    DefineCustomInteractionMode(interactionModeName:string) {

        /**
         * Always use a variable set to the this pointer outside function definitions like this if you want to refer to
         * the current scene controller inside of custom callbacks.
         */
        const self = this;

        function dragStartCallback(
            event: AInteractionEvent,
            interaction: ADragInteraction
        ): any {

            /**
             * Get the world coordinates of the cursor
             */
            let cursorWorldCoordinates:Vec2 = self.model.get2DWorldCoordinatesForCursorEvent(event);
        }

        function dragMoveCallback(
            event: AInteractionEvent,
            interaction: ADragInteraction
        ): any {
            let cursorWorldCoordinates:Vec2 = self.model.get2DWorldCoordinatesForCursorEvent(event);
            let dragStartWorldCoordinates:Vec2 = self.model.get2DWorldCoordinatesForCursorEvent(interaction.dragStartEvent);
        }

        function dragEndCallback(
            event: AInteractionEvent,
            interaction: ADragInteraction
        ): any {
            let cursorWorldCoordinates:Vec2 = self.model.get2DWorldCoordinatesForCursorEvent(event);
            let dragStartWorldCoordinates:Vec2 = self.model.get2DWorldCoordinatesForCursorEvent(interaction.dragStartEvent);
        }

        function onClick(event: AInteractionEvent): void {
            let cursorWorldCoordinates:Vec2 = self.model.get2DWorldCoordinatesForCursorEvent(event);
        }

        function onKeyDown(
            event: AInteractionEvent,
            interaction: AKeyboardInteraction
        ): void {
            if (event.key === "ArrowRight") {
            }
            if (event.key === "ArrowLeft") {
            }
            if (event.key === "ArrowUp") {
            }
            if (event.key === "ArrowDown") {
            }
            console.log(`Pressed "${event.key}"`);

            // you can check if other keys are currently pressed using:
            if(interaction.keysDownState['a']){
                console.log(`The 'a' button is currently down`);
            }

        }

        function onKeyUp(event: AInteractionEvent, interaction: AKeyboardInteraction): void {
            if (event.key === "ArrowRight") {
            }
            if (event.key === "ArrowLeft") {
            }
            if (event.key === "ArrowUp") {
            }
            if (event.key === "ArrowDown") {
            }
            console.log(`Released "${event.key}"`);
        }
        this.createNewInteractionMode(interactionModeName,
            onClick,
            onKeyDown,
            onKeyUp,
            dragStartCallback,
            dragMoveCallback,
            dragEndCallback);
    }


    createNewInteractionMode(
        name:string,
        onClick?:CallbackType,
        onKeyDown?:AKeyboardInteractionCallback,
        onKeyUp?:AKeyboardInteractionCallback,
        dragStart?:ADragInteractionCallback,
        dragMove?:ADragInteractionCallback,
        dragEnd?:ADragInteractionCallback
    ){
        if(this._interactions.modes[name]){
            throw new Error(`Tried to create interaction mode "${name}", but mode with this name is already defined!`)
        }
        const self = this;
        let currentInteractionMode = this._currentInteractionModeName;
        this.defineInteractionMode(name);
        this.setCurrentInteractionMode(name);

        if(onKeyUp || onKeyDown) {
            this.addInteraction(
                AKeyboardInteraction.Create(
                    self.eventTarget.ownerDocument,
                    onKeyDown,
                    onKeyUp,
                )
            );
        }

        if(onClick) {
            this.addInteraction(
                AClickInteraction.Create(
                    self.eventTarget,
                    onClick
                )
            )
        }

        if(dragStart && dragMove) {
            this.addInteraction(
                ADragInteraction.Create(
                    self.eventTarget,
                    dragStart,
                    dragMove,
                    dragEnd
                )
            )
        }

        this.setCurrentInteractionMode(currentInteractionMode);
    }



    dragEndCallback(event: AInteractionEvent, interaction?: ADragInteraction): void {
    }

    dragMoveCallback(event: AInteractionEvent, interaction?: ADragInteraction): void {
    }

    dragStartCallback(event: AInteractionEvent, interaction?: ADragInteraction): void {
    }

    onClick(event: AInteractionEvent): void {
    }

    onKeyDown(event: AInteractionEvent, interaction: AKeyboardInteraction): void {
    }

    onKeyUp(event: AInteractionEvent, interaction: AKeyboardInteraction): void {
    }
    //</editor-fold>
    //###############################################\\--Custom additional interaction mode--//###############################################

}

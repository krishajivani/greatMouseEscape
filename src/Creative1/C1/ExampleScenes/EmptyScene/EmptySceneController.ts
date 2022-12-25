import {
    AClickInteraction,
    ADragInteraction,
    AGLContext,
    AInteractionEvent,
    AKeyboardInteraction, ANodeModel,
    Basic2DSceneController, V2, Vec2,
} from "../../../../anigraph";
import {EmptySceneModel} from "./EmptySceneModel";


export class EmptySceneController extends Basic2DSceneController {
    get model(): EmptySceneModel {
        return this._model as EmptySceneModel;
    }

    async initScene(): Promise<void> {
        super.initScene();
    }

    initModelViewSpecs(): void {

    }

    //###############################################//--Defining Interaction Modes--\\###############################################
    //<editor-fold desc="Defining Interaction Modes">


    //</editor-fold>
    //###############################################\\--Defining Interaction Modes--//###############################################

    dragStartCallback(
        event: AInteractionEvent,
        interaction?: ADragInteraction
    ): any {
    }

    dragMoveCallback(
        event: AInteractionEvent,
        interaction?: ADragInteraction
    ): any {
    }

    dragEndCallback(
        event: AInteractionEvent,
        interaction?: ADragInteraction
    ): any {
    }

    onClick(event: AInteractionEvent): void {
    }

    onKeyDown(
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
        console.log(event.key);
    }

    onKeyUp(event: AInteractionEvent, interaction: AKeyboardInteraction): void {
        if (event.key === "ArrowRight") {
        }
        if (event.key === "ArrowLeft") {
        }
        if (event.key === "ArrowUp") {
        }
        if (event.key === "ArrowDown") {
        }
    }

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
        this.DefineCustomInteractionMode("CustomInteractionMode");
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


        let currentInteractionMode = this._currentInteractionModeName;
        this.defineInteractionMode(interactionModeName);
        this.setCurrentInteractionMode(interactionModeName);

        this.addInteraction(
            AKeyboardInteraction.Create(
                self.eventTarget.ownerDocument,
                onKeyDown,
                onKeyUp,
            )
        );

        this.addInteraction(
            AClickInteraction.Create(
                self.eventTarget,
                onClick
            )
        )

        this.addInteraction(
            ADragInteraction.Create(
                self.eventTarget,
                dragStartCallback,
                dragMoveCallback,
                dragEndCallback
            )
        )

        this.setCurrentInteractionMode(currentInteractionMode);

    }
    //</editor-fold>
    //###############################################\\--Custom additional interaction mode--//###############################################

}

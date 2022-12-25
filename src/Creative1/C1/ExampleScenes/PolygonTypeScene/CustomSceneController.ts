import {
    AClickInteraction,
    ADragInteraction,
    AGLContext,
    AInteractionEvent,
    AKeyboardInteraction, ANodeModel,
    Basic2DSceneController, BezierTween, Mat3, V2, Vec2,
} from "../../../../anigraph";
import {CustomSceneModel} from "./CustomSceneModel";
import {CreativeSceneControllerBase} from "../../CreativeSceneControllerBase";
import {GetAppState} from "../../../Creative1AppState";
import {CustomPolygonModel} from "./modelview/CustomPolygonModel";
import {CustomPolygonView} from "./modelview/CustomPolygonView";

let appState = GetAppState();


export class CustomSceneController extends CreativeSceneControllerBase {
    get model(): CustomSceneModel {
        return this._model as CustomSceneModel;
    }

    async initScene(): Promise<void> {
        super.initScene();
    }


    initInteractions() {
        super.initInteractions();
    }

    /**
     * gets called when a key is pressed down
     * @param event
     * @param interaction
     */
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

    /**
     * Gets called when a key is released
     * @param event
     * @param interaction
     */
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

    /**
     * Gets called at the start of a drag interaction (one where the mouse button is pressed and the mouse is moved)
     * @param event
     * @param interaction
     */
    dragStartCallback(
        event: AInteractionEvent,
        interaction?: ADragInteraction
    ): any {
        /**
         * coordinates of the cursor in screen world space
         * @type {Vec2}
         */
        let cursorWorldCoordinates:Vec2 = this.model.get2DWorldCoordinatesForCursorEvent(event);
    }

    /**
     * Gets executed when the mouse is moved while holding down the left mouse button
     * @param event
     * @param interaction
     */
    dragMoveCallback(event: AInteractionEvent, interaction: ADragInteraction) {
        /**
         * coordinates of the cursor in screen world space
         * @type {Vec2}
         */
        let cursorWorldCoordinates:Vec2 = this.model.get2DWorldCoordinatesForCursorEvent(event);

        /**
         * coordinates where the cursor was when the mouse was first pressed
         * @type {Vec2}
         */
        let dragStartWorldCoordinates:Vec2 = this.model.get2DWorldCoordinatesForCursorEvent(interaction.dragStartEvent);
        ///
    }

    /**
     * called at the end of a adrag interaction
     * @param event
     * @param interaction
     */
    dragEndCallback(
        event: AInteractionEvent,
        interaction?: ADragInteraction
    ): any {
        let cursorWorldCoordinates:Vec2 = this.model.get2DWorldCoordinatesForCursorEvent(event);
    }

    /**
     * Called when mouse button is clicked
     * @param event
     */
    onClick(event: AInteractionEvent): void {
        let cursorWorldCoordinates:Vec2 = this.model.get2DWorldCoordinatesForCursorEvent(event);
    }

    initModelViewSpecs(): void {
        this.addModelViewSpec(CustomPolygonModel, CustomPolygonView);
    }

}

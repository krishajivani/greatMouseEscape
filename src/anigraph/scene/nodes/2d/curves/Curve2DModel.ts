import {ANodeModel2D} from "../../../ANodeModel";
import {ALineMaterialModel} from "../../../../rendering";
import {Color, Vec2} from "../../../../math";
import {Curve} from "three";
import {ASceneController} from "../../../ASceneController";
import {AClickInteraction, ADragInteraction, AInteractionEvent, AKeyboardInteraction} from "../../../../base";

enum CurveInterpolationModes{
    Linear="Linear",
}

enum CurveCreationInteractionModeStateKeys{
    CurrentCurve="CurrentCurve"
}

export class Curve2DModel extends ANodeModel2D {
    /**
     * Width/thickness of the spline
     * @type {number}
     */
    lineWidth: number = 0.05;

    /**
     * We will have two interpolation modes: Linear, and CubicBezier.
     * These are set to the enum declared at the top of this file.
     * @type {SplineInterpolationModes}
     */
    static InterpolationModes=CurveInterpolationModes;

    /**
     * Getter and setter for `interpolationMode`, which wraps the protected variable _interpolationMode holding the
     * current interpolation mode for the spline.
     * */
    protected _interpolationMode:CurveInterpolationModes=CurveInterpolationModes.Linear;
    /**
     * When the interpolation mode changes, we need to signal an update of the geometry.
     * @param value
     */
    set interpolationMode(value){
        this._interpolationMode = value;
        this.signalGeometryUpdate();
    }
    get interpolationMode(){return this._interpolationMode;}

    getStrokeMaterial() {
        return ALineMaterialModel.GlobalInstance.CreateMaterial();
    }

    getFrameMaterial() {
        return ALineMaterialModel.GlobalInstance.CreateMaterial();
    }

    constructor() {
        super();
        this.verts.initColorAttribute()
    }

    static DefineCustomInteractionMode(controller:ASceneController, interactionModeName:string) {
        function onKeyDown(
            event: AInteractionEvent,
            interaction: AKeyboardInteraction
        ): void {
        }

        const self = this;

        function onKeyUp(event: AInteractionEvent, interaction: AKeyboardInteraction): void {
            if (event.key === "N") {
                let newCurve = new self()
                controller.model.addChild(newCurve);
                controller.interactionMode.setModeState(CurveCreationInteractionModeStateKeys.CurrentCurve, newCurve);
            }
        }


        function dragStartCallback(
            event: AInteractionEvent,
            interaction: ADragInteraction
        ): any {
            /**
             * Get the world coordinates of the cursor
             */
            let cursorWorldCoordinates:Vec2 = controller.get2DWorldCoordinatesForCursorEvent(event);
            let currentCurve = controller.interactionMode.getModeState(CurveCreationInteractionModeStateKeys.CurrentCurve) as Curve2DModel;
            if(!currentCurve){
                return;
            }

            let newvert = currentCurve.getWorldTransform().getInverse().times(cursorWorldCoordinates);
            currentCurve.verts.addVertex(newvert, Color.Random());
        }

        function dragMoveCallback(
            event: AInteractionEvent,
            interaction: ADragInteraction
        ): any {
            let cursorWorldCoordinates:Vec2 = controller.get2DWorldCoordinatesForCursorEvent(event);
            let dragStartWorldCoordinates:Vec2 = controller.get2DWorldCoordinatesForCursorEvent(interaction.dragStartEvent);
            let currentCurve = controller.interactionMode.getModeState(CurveCreationInteractionModeStateKeys.CurrentCurve) as Curve2DModel;
            if(!currentCurve){
                return;
            }
            let newVert = currentCurve.getWorldTransform().getInverse().times(cursorWorldCoordinates);
            if(currentCurve.verts.nVerts>0){

                currentCurve.verts.position.setAt(currentCurve.verts.nVerts-1, newVert);
            }
        }

        function dragEndCallback(
            event: AInteractionEvent,
            interaction: ADragInteraction
        ): any {
            let cursorWorldCoordinates:Vec2 = controller.get2DWorldCoordinatesForCursorEvent(event);
            let dragStartWorldCoordinates:Vec2 = controller.get2DWorldCoordinatesForCursorEvent(interaction.dragStartEvent);
        }

        function onClick(event: AInteractionEvent): void {
            let cursorWorldCoordinates:Vec2 = controller.get2DWorldCoordinatesForCursorEvent(event);
        }

        let currentInteractionMode = controller.interactionMode.name;
        controller.defineInteractionMode(interactionModeName);
        controller.setCurrentInteractionMode(interactionModeName);

        controller.addInteraction(
            AKeyboardInteraction.Create(
                controller.eventTarget.ownerDocument,
                onKeyDown,
                onKeyUp,
            )
        );

        controller.addInteraction(
            AClickInteraction.Create(
                controller.eventTarget,
                onClick
            )
        )

        controller.addInteraction(
            ADragInteraction.Create(
                controller.eventTarget,
                dragStartCallback,
                dragMoveCallback,
                dragEndCallback
            )
        )

        controller.setCurrentInteractionMode(currentInteractionMode);

    }



    // abstract getPointForProgress(progress: number): Vec2;
    //
    // abstract getDerivativeForProgress(progress: number): Vec2;
    //
    // abstract getColorForProgress(progress: number): Color;

}

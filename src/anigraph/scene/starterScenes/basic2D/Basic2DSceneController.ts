import {AGLRenderWindow} from "../../../rendering/context/AGLRenderWindow";
import * as THREE from "three";
import {AGLContext} from "../../../rendering/context/AGLContext";
import {
    AOrthoCamera,
    APerspectiveCamera,
    ASceneController
} from "../../index";
import {
    AClickInteraction, ADOMPointerMoveInteraction, ADragInteraction,
    AInteractionEvent, AKeyboardInteraction,
    V3
} from "../../../index";
import {Basic2DSceneModel} from "./Basic2DSceneModel";
import {GetAppState} from "../../../../Creative1/Creative1AppState";

/**
 * Mostly students will just write the scene controller subclass.
 * The main things for them to write are
 * - initRendering(renderWindow:AGLRenderWindow) | sets things up
 * - onAnimationFrameCallback(context:AGLContext) | renders the current frame
 * - createViewForNodeModel(nodeModel: ANodeModel): ANodeView | creates a view for a newly added model
 *
 */
export abstract class Basic2DSceneController extends ASceneController{
    keyboardInteraction!:AKeyboardInteraction;
    textElem!:HTMLDivElement;
    createLineShaderMaterial(){
        return this.model.materials.createLineShaderMaterial();
    }

    get camera(){return this._cameraView.model as AOrthoCamera;}


    abstract onClick(event:AInteractionEvent):void;
    abstract onKeyDown(event:AInteractionEvent, interaction:AKeyboardInteraction):void;
    abstract onKeyUp(event:AInteractionEvent, interaction:AKeyboardInteraction):void;
    // abstract onMouseMove(event?:AInteractionEvent, interaction?: ADOMPointerMoveInteraction):void;

    abstract dragStartCallback(event:AInteractionEvent, interaction?:ADragInteraction):void;
    abstract dragMoveCallback(event:AInteractionEvent, interaction?:ADragInteraction):void;
    abstract dragEndCallback(event:AInteractionEvent, interaction?:ADragInteraction):void;


    updateTextElement(){
        this.textElem.textContent =
            `Matrix: 
            `;
    }

    initCamera(){
        this.onResize(this.renderWindow);
        // this.camera.setPerspectiveFOV(75, this.renderWindow.aspect)
        this.camera.setPosition(V3(0,0,10));
    }


    defineDefaultInteractionMode(){
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onClick = this.onClick.bind(this);
        this.dragStartCallback = this.dragStartCallback.bind(this);
        this.dragMoveCallback = this.dragMoveCallback.bind(this);
        this.dragEndCallback = this.dragEndCallback.bind(this);
        // this.onMouseMove = this.onMouseMove.bind(this);
        // this.setCurrentInteractionMode()

        this.keyboardInteraction = AKeyboardInteraction.Create(
            this.eventTarget.ownerDocument,
            this.onKeyDown,
            this.onKeyUp,
        );

        this.addInteraction(this.keyboardInteraction);
        this.addInteraction(AClickInteraction.Create(this.eventTarget, this.onClick))

        this.addInteraction(ADragInteraction.Create(
            this.eventTarget,
            this.dragStartCallback,
            this.dragMoveCallback,
            this.dragEndCallback
        ))
    }

    initInteractions(){
        this.defineDefaultInteractionMode();
        let appState = GetAppState();
        appState.addSelectionControl(
            "InteractionMode",
            this._currentInteractionModeName,
            this._interactions.getGUISelectableModesList()
        )
    }

    onAnimationFrameCallback(context:AGLContext) {
        // let's update the model
        // let time = this.clock.time;
        // (this.model as Vis2DSceneModel).timeUpdate(time);

        // clear the rendering context
        context.renderer.clear();
        // this.renderer.clear(false, true);

        // render the scene view
        context.renderer.render(this.view.threejs, this._threeCamera);
    }




}

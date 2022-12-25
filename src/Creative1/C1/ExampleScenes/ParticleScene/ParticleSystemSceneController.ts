import {
    AClickInteraction,
    ADragInteraction,
    AGLContext,
    AInteractionEvent,
    AKeyboardInteraction, ANodeModel,
    Basic2DSceneController, BezierTween, Mat3, V2, Vec2,
} from "../../../../anigraph";
import {CreativeSceneControllerBase} from "../../CreativeSceneControllerBase";
import {GetAppState} from "../../../Creative1AppState";
import {ParticleSystemSceneModel} from "./ParticleSystemSceneModel";
import {ParticleSystem2DView} from "./particles/ParticleSystem2DView";
import {ParticleSystem2DModel} from "./particles/ParticleSystem2DModel";
import {PlayerModel, PlayerView} from "./Player";

let appState = GetAppState();



export class ParticleSystemSceneController extends CreativeSceneControllerBase {
    get model(): ParticleSystemSceneModel {
        return this._model as ParticleSystemSceneModel;
    }

    async initScene(): Promise<void> {
        super.initScene();
        const self = this;
    }

    initModelViewSpecs(): void {
        this.addModelViewSpec(ParticleSystem2DModel, ParticleSystem2DView);
        this.addModelViewSpec(PlayerModel, PlayerView);
    }

    dragStartCallback(
        event: AInteractionEvent,
        interaction: ADragInteraction
    ): void {}

    dragMoveCallback(
        event: AInteractionEvent,
        interaction: ADragInteraction
    ): void {}

    dragEndCallback(
        event: AInteractionEvent,
        interaction?: ADragInteraction
    ): void {}

    onClick(event: AInteractionEvent): void {}

    onKeyDown(
        event: AInteractionEvent,
        interaction: AKeyboardInteraction
    ): void {
        if (event.key === "ArrowRight") {
            this.model.player.onRightTurn();
        }
        if (event.key === "ArrowLeft") {
            this.model.player.onLeftTurn();
        }
        if (event.key === "ArrowUp") {
            this.model.player.onMoveForward()
        }
        if (event.key === "ArrowDown") {
            this.model.player.onMoveBackward()
        }
    }

    onKeyUp(event: AInteractionEvent, interaction: AKeyboardInteraction): void {
        if (event.key === "ArrowRight") {
            this.model.player.onHaltRight();
        }
        if (event.key === "ArrowLeft") {
            this.model.player.onHaltLeft();
        }
        if (event.key === "ArrowUp") {
            this.model.player.onHaltForward();
        }
        if (event.key === "ArrowDown") {
            this.model.player.onHaltBackward();
        }
    }

    onAnimationFrameCallback(context: AGLContext) {
        this.model.timeUpdate(this.model.clock.time);
        super.onAnimationFrameCallback(context);
    }


    createViewForNodeModel(nodeModel: ANodeModel){
        return super.createViewForNodeModel(nodeModel)
    }

}

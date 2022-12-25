import {
    AClickInteraction,
    ADragInteraction,
    AGLContext,
    AInteractionEvent,
    AKeyboardInteraction, ANodeModel,
    Basic2DSceneController, V2, Vec2,
} from "../../../../anigraph";
import {CurveSceneModel} from "./CurveSceneModel";
import {ExampleCurveModel} from "./nodes/exampleCurveClass/ExampleCurveModel";
import {ExampleCurveView} from "./nodes/exampleCurveClass/ExampleCurveView";
import {ExampleCurveModel2} from "./nodes/exampleCurveClass2/ExampleCurveModel2";
import {ExampleCurveView2} from "./nodes/exampleCurveClass2/ExampleCurveView2";
import {CreativeSceneControllerBase} from "../../CreativeSceneControllerBase";

export class CurveSceneController extends CreativeSceneControllerBase {
    get model(): CurveSceneModel {
        return this._model as CurveSceneModel;
    }

    async initScene(): Promise<void> {
        super.initScene();
    }

    initModelViewSpecs(): void {
        this.addModelViewSpec(ExampleCurveModel, ExampleCurveView);
        this.addModelViewSpec(ExampleCurveModel2, ExampleCurveView2);
    }
}

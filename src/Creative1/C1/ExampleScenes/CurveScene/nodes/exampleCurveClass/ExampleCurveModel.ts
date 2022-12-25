import {
    AClickInteraction, AController,
    ADragInteraction,
    AInteractionEvent, AKeyboardInteraction, ANodeModelClass, ASceneController,
    ASerializable,
    Curve2DModel, Vec2,
} from "../../../../../../anigraph";
import {Curve} from "three";




@ASerializable("ExampleCurveModel")
export class ExampleCurveModel extends Curve2DModel{
}

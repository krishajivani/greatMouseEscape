import {
    AInteractionEvent, ANodeModel2D, Color, Mat3, Random,
    V2, Vec2, VertexArray2D,
} from "../../../../anigraph";
import {GetAppState} from "../../../Creative1AppState";
import {ExampleCurveModel} from "./nodes/exampleCurveClass/ExampleCurveModel";
import {ExampleCurveModel2} from "./nodes/exampleCurveClass2/ExampleCurveModel2";
import {CreativeSceneModelBase} from "../../CreativeSceneModelBase";

let appState = GetAppState();
export class CurveSceneModel extends CreativeSceneModelBase {
    curveSpeed:number=1;
    initScene() {

        /**
         * Here we see how to add controllable state to the control panel.
         * For a slider, you should give it a name, initial value, min, max and step size.
         */
        const example_state_name = "CurveMovementSpeed"
        appState.addSliderControl(example_state_name, this.curveSpeed, 0, 10, 0.01);

        /**
         * You can subscribe to changes in the state you added to the control panel.
         * Here we set a callback to run whenever the state we added is changed.
         */
        const self = this;
        this.subscribeToAppState(example_state_name, (v:any)=>{
            self.curveSpeed = v;
        })


        /**
         * Here we will create two different types of models. The types are defined in the ./nodes directory
         */
        let curve1 = new ExampleCurveModel();
        let curve2 = new ExampleCurveModel2();

        /**
         * Let's add some vertices to these curves
         */
        for(let i=0;i<5;i++){
            curve1.verts.addVertex(Vec2.Random([-0.5,0.5]).times(this.sceneScale), Color.Random());
            curve2.verts.addVertex(Vec2.Random([-0.5,0.5]).times(this.sceneScale), Color.Random());
        }

        /**
         * And let's add the curves to the scene
         */
        this.addChild(curve1);
        this.addChild(curve2);

    }

    timeUpdate(t: number) {

        /**
         * On every time update, we will rotate a bit. The speed of rotation will be controlled by the slider we added to the control panel
         */
        let direction = 1;
        for(let c of this.children){
            (c as ANodeModel2D).setTransform(Mat3.Rotation(t*direction*this.curveSpeed));
            direction = direction*-1;
        }
    }
}

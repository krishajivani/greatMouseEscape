import {
    AInteractionEvent,
    Basic2DSceneModel, Color, Mat3, Random,
    V2, Vec2, VertexArray2D,
} from "../../../../anigraph";
import {ATexture} from "../../../../anigraph/rendering/ATexture";
import {Polygon2DModel} from "../Polygon2D";
import {GetAppState} from "../../../Creative1AppState";

let appState = GetAppState();
export class EmptySceneModel extends Basic2DSceneModel {
    exampleTexture!:ATexture;

    get children():Polygon2DModel[]{
        return this._children as Polygon2DModel[];
    }

    async PreloadAssets() {
        await super.PreloadAssets();
        this.initCamera();
        this.exampleTexture = await ATexture.LoadAsync(`./images/MouseFriend.png`);
        await this.loadShader('basicTexture');
    }

    initCamera() {
        this.initOrthographicCamera(this.sceneScale);
    }

    initScene() {
        const example_state_name = "ExampleAppState"
        appState.addSliderControl(example_state_name, 1, 0, 10, 0.01);
        this.subscribeToAppState(example_state_name, (v:any)=>{
            console.log(`${example_state_name}: ${v}`);
        })
    }

    timeUpdate(t: number) {

    }
}

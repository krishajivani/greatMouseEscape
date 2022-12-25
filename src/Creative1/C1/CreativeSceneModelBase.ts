import {GetAppState} from "../Creative1AppState";
import {ANodeModel2D, Basic2DSceneModel, Color, DefaultMaterials, Vec2} from "../../anigraph";


let appState = GetAppState();
export abstract class CreativeSceneModelBase extends Basic2DSceneModel {

    get children():ANodeModel2D[]{
        return this._children as ANodeModel2D[];
    }

    async PreloadAssets() {
        await super.PreloadAssets();
        await this.materials.loadShaderModel(DefaultMaterials.RGBA_SHADER)
        this.initCamera();
    }

    initCamera() {
        this.initOrthographicCamera(this.sceneScale);
    }

    abstract initScene(): void;

    abstract timeUpdate(t: number): void;

}


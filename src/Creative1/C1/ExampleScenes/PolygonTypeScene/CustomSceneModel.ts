import {
    AInteractionEvent,
    Basic2DSceneModel, Color, DefaultMaterials, Mat3, Random,
    V2, Vec2, VertexArray2D,
} from "../../../../anigraph";
import {GetAppState} from "../../../Creative1AppState";
import {CustomPolygonModel} from "./modelview/CustomPolygonModel";
import {CreativeSceneModelBase} from "../../CreativeSceneModelBase";

let appState = GetAppState();
export class CustomSceneModel extends CreativeSceneModelBase {


    async PreloadAssets() {
        await super.PreloadAssets();
        await this.materials.loadShaderModel(DefaultMaterials.RGBA_SHADER)
        this.initCamera();
    }

    initScene() {
        appState.addSliderControl(CustomPolygonModel.AppStateKeys.PyramidScale, 0.9, 0.5, 1.2, 0.01);
        appState.addSliderControl(CustomPolygonModel.AppStateKeys.PyramidRotation, 0, -Math.PI, Math.PI, 0.01);
        appState.addColorControl(CustomPolygonModel.AppStateKeys.PyramidBaseColor, Color.RandomRGBA());
        const self = this;
        let pyramid = new CustomPolygonModel();
        pyramid.setMaterial(this.materials.createRGBAShaderMaterial());
        // pyramid.verts.addVertex(Vec2.Random([-0.5,0.5]).times(this.sceneScale), Color.Random());

        pyramid.setVerts(VertexArray2D.SquareXYUV(2))
        this.addChild(pyramid);
    }



    timeUpdate(t: number) {

        // let direction = 1;
        for(let c of this.children){
            let p = (c as CustomPolygonModel);

            // You could do something here to create an animated effect!

            p.signalPyramidUpdate();
        }
    }
}

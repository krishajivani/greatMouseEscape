import {ASceneModel} from "../../index";
import {GameConfigs} from "../../../../Creative1/GameConfigs";
import {AInteractionEvent} from "../../../base";
import {V2, Vec2} from "../../../math";

export abstract class Basic2DSceneModel extends ASceneModel {
    sceneScale: number = GameConfigs.GameWorldScale;
    createLineShaderMaterial() {
        return this.materials.createLineShaderMaterial();
    }

    abstract timeUpdate(t: number): void;


    worldPoint2DFromNormalizedCursorCoordinates(ndcCursor:Vec2){
        return ndcCursor.times(this.sceneScale);
    }
    get2DWorldCoordinatesForCursorEvent(event?:AInteractionEvent):Vec2{
        if(event!==undefined) {
            let normalizedCursorCoordinates = event.ndcCursor;
            if (normalizedCursorCoordinates) {
                return this.worldPoint2DFromNormalizedCursorCoordinates(normalizedCursorCoordinates);
            } else {
                return V2();
            }
        }else{return V2();}
    }
}

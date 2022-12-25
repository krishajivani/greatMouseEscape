import {APolygon2DGraphic} from "./APolygon2DGraphic";
import {Color} from "../../math";

export class BasicParticleGraphic extends APolygon2DGraphic{
    setColor(v:Color){
        (this._material as THREE.MeshBasicMaterial).setValues({color:v.asThreeJS()})
    }
}




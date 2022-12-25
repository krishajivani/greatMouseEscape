import {APolygon2DGraphic, BasicParticleGraphic, Color} from "../../../../../anigraph";

export class ParticleGraphic extends BasicParticleGraphic{
    setColor(v:Color){
        (this._material as THREE.MeshBasicMaterial).setValues({color:v.asThreeJS(), opacity:1})
    }
}




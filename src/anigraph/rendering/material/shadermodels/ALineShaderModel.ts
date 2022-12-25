import {AShaderModelBase, ShaderUniformDict} from "../AShaderModel";
import * as THREE from "three";
import {ClassInterface} from "../../../base";
import {AShaderMaterial} from "../AShaderMaterial";
import {AThreeJSLineMaterial} from "../threeMaterials";
import {ShaderMaterialParameters} from "three/src/materials/ShaderMaterial";

export class ALineShaderModel extends AShaderModelBase<{ [name: string]: any }>{
    // materialClass:ClassInterface<AThreeJSLineMaterial>=AThreeJSLineMaterial;
    constructor(
        shaderName?:string,
        shaderSettings?:ShaderMaterialParameters,
        uniforms?:ShaderUniformDict,
        sharedUniforms?:ShaderUniformDict,
        ...args:any[]
    ) {
        super(shaderName, AThreeJSLineMaterial, ...args);
        this._shaderSettings = shaderSettings??{
            lights:false,
            transparent: true,
            side: THREE.DoubleSide,
            opacity:1.0
        };
        this.uniforms=uniforms??{};
        this.sharedUniforms=sharedUniforms??{};
        if(shaderName) {
            this.setShader(shaderName);
        }
    }
}





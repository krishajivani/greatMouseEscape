import {BasicTextureShaderModel} from "./BasicTextureShaderModel";
import type {ShaderMaterialParameters} from "three/src/materials/ShaderMaterial";
import {ASerializable, ClassInterface} from "../../../base";
import {V2, V4} from "../../../math";
import {AShaderModel} from "../AShaderModel";
import {AShaderMaterial} from "../AShaderMaterial";
import {ATexture} from "../../ATexture";
import {ShaderManager} from "../ShaderManager";
import * as THREE from "three";

const SHADER_NAME = 'multitex';
ShaderManager.LoadShader(SHADER_NAME, `basictexture/multitex/${SHADER_NAME}.vert.glsl`, `basictexture/multitex/${SHADER_NAME}.frag.glsl`);

export const MAX_TEX_PER_CALL=16;
enum Uniforms{
    Weights="weights",
    NTextures="nTextures"
}
const PaddingWeight = 0;

@ASerializable("MixTexturesShaderMaterial")
export class MixTexturesShaderMaterial extends AShaderMaterial{
    setTextureAtIndex(index:number, texture:ATexture){
        this.setTexture(`tex${index}`, texture);
    }

    setTextures(textures?:ATexture[],
                textureWeights?:number[]){
        let mat = this;
        if(!textures || !textureWeights){
            return;
        }
        for(let ri=0;ri<textures.length;ri++){
            mat.setTexture(`tex${ri}`, textures[ri]);
        }

        if(textureWeights.length>MAX_TEX_PER_CALL){throw new Error(`Can't have more than ${MAX_TEX_PER_CALL}`);}
        if(textureWeights.length<MAX_TEX_PER_CALL){
            let packed_weights=[...textureWeights];
            while(packed_weights.length<MAX_TEX_PER_CALL){
                packed_weights.push(PaddingWeight);
            }
            mat.setUniform(Uniforms.Weights, packed_weights, 'fv1');
        }else{
            mat.setUniform(Uniforms.Weights, textureWeights, 'fv1');
        }

        mat.setUniform(Uniforms.NTextures, textures.length, 'int');
        // mat.setHomogenize(false);
        // mat.threejs.needsUpdate=true;
        // mat.setUniform(Uniforms.referenceValueStep, 1.0/(referenceTextures.length-1));
    }

}

@ASerializable("MixTexturesShaderModel")
export class MixTexturesShaderModel extends AShaderModel{
    ShaderMaterialClass:ClassInterface<MixTexturesShaderMaterial>=MixTexturesShaderMaterial;
    constructor(shader_name?:string, shaderSettings?:ShaderMaterialParameters){
        super(
            shader_name??SHADER_NAME,
            {
                lights:false,
                blending:THREE.AdditiveBlending,
                transparent: true,
                opacity:1.0,
                depthTest:false,
                depthWrite:false,
                ...shaderSettings
            }
        );
    }



    CreateMaterial(...args:any[])
    {
        let mat = super.CreateMaterial(...args) as MixTexturesShaderMaterial;
        mat.threejs.blending=THREE.CustomBlending;
        mat.threejs.blendEquation=THREE.AddEquation;
        mat.threejs.blendSrc=THREE.OneFactor;
        mat.threejs.blendDst=THREE.OneFactor;
        mat.threejs.depthTest=false;
        mat.threejs.depthWrite=false;
        mat.threejs.needsUpdate = true;
        // mat.setHomogenize(false);
        return mat;
    }

    getMaterialGUIParams(material:AShaderMaterial){
        const self = this;
        return {
            ...self.getTextureGUIParams(material),
            // ...AShaderModelBase.ShaderUniformGUIControl(material, 'exposure', 1, {
            //     min:0,
            //     max:20,
            //     step:0.01
            // })
        }
    }

    _CreateTHREEJS(){
        return new this.materialClass({
            vertexShader: this.vertexSource,
            fragmentShader: this.fragSource,
            vertexColors: true,
            ...this.settingArgs,
            ...this.defaults,
            ...this.sharedParameters,
        });
    }

}


import * as THREE from "three";
import type {ShaderMaterialParameters} from "three/src/materials/ShaderMaterial";
import {ASerializable} from "../../../base";
import {V2, V4} from "../../../math";
import {AShaderModel} from "../AShaderModel";
import {AShaderMaterial} from "../AShaderMaterial";
import {ATexture} from "../../ATexture";
import {ShaderManager} from "../ShaderManager";


const SHADER_NAME = 'basictexture';
ShaderManager.LoadShader(SHADER_NAME, `basictexture/${SHADER_NAME}.vert.glsl`, `basictexture/${SHADER_NAME}.frag.glsl`);

@ASerializable("BasicTextureShaderModel")
export class BasicTextureShaderModel extends AShaderModel{
    textureName!:string|undefined;

    /** Get set input */
    set inputTexture(texture:ATexture){this.setTexture('input', texture);}
    get inputTexture(){ // @ts-ignore
        return this.getTexture('input');}

    constructor(shader_name?:string, texture?:string|ATexture, shaderSettings?:ShaderMaterialParameters) {
        // texture=texture??marble;
        shaderSettings = shaderSettings??{
            lights:false,
            transparent: true,
            opacity:1.0,
            depthWrite: true,
            depthTest:true,
        };

        super(shader_name??SHADER_NAME, shaderSettings);
        // this.materialClass = THREE.RawShaderMaterial;

        if(texture instanceof ATexture){
            this.inputTexture = texture;
            this.textureName = texture.name;
        }else if(texture){
            let textureName = texture??'debug.jpeg';
            this.textureName=textureName;
            this.inputTexture = new ATexture('./images/'+this.textureName)
            this.inputTexture.setWrapToRepeat();
        }
    }

    CreateMaterial(inputTexture?:ATexture|THREE.WebGLRenderTarget, ...args:any[]){
        let mat = super.CreateMaterial(...args);
        // mat.setUniform('exposure', 1.0);
        if(inputTexture instanceof THREE.WebGLRenderTarget){
            mat.setTexture('input', new ATexture(inputTexture.texture));
        }else {
            let intex = inputTexture ?? this.getTexture('input');
            if(intex) {
                mat.setTexture('input', intex);
            }
        }

        let itex = mat.getTexture('input');
        if(itex) {
            mat.setUniform('inputSize', V2(itex.width, itex.height));
        }
        // else{
        //     throw new Error("Cannot set material with texture!")
        // }
        // mat.setUniform('outputScale', V4(1,1,1,1));
        // mat.setUniform('outputOffset', V4(0,0,0,0));
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

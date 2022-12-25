import * as THREE from "three";
// import {ShaderMaterialParameters} from "three/src/materials/ShaderMaterial";
import {ASerializable} from "../../base";
import {AMaterialModelBase} from "./AMaterialModel";
// import {LineMaterial, LineMaterialParameters} from "three/examples/jsm/lines/LineMaterial";
import {Color} from "../../math";
import {AMaterial} from "./AMaterial";
import {AShaderModelBase} from "./AShaderModel";
import {DefaultMaterials} from "./MaterialConstants";
// import {AThreeJSLineMaterial} from "./threeMaterials";
import {AShaderProgramSource, ShaderManager} from "./ShaderManager";
import {AThreeJSLineMaterial, LineMaterialParameters} from "./threeMaterials";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {Material} from "three";


// // @ts-ignore
// THREE.UniformsLib.line = {
//     worldUnits: { value: 1 },
//     linewidth: { value: 1 },
//     resolution: { value: new THREE.Vector2( 1, 1 ) },
//     dashOffset: { value: 0 },
//     dashScale: { value: 1 },
//     dashSize: { value: 1 },
//     gapSize: { value: 1 } // todo FIX - maybe change to totalSize
//
// };
//
// ShaderManager.LoadShader('line', 'line/line.vert.glsl', 'line/line.frag.glsl').then((programSounrce:AShaderProgramSource)=>{
//     // ShaderManager.GetShaderSource('line').sourcesLoadedPromise.then();
//     programSounrce.sourcesLoadedPromise.then((loadedProgrameSource)=> {
//         THREE.ShaderLib['line'] = {
//             uniforms: THREE.UniformsUtils.merge([
//                 THREE.UniformsLib.common,
//                 THREE.UniformsLib.fog,
//                 // @ts-ignore
//                 THREE.UniformsLib.line
//             ]),
//             vertexShader: programSounrce.vertexSource,
//             fragmentShader: programSounrce.fragSource
//         };
//     });
// });
//
//
// let ShaderLibLineDict = {
//     uniforms: THREE.UniformsUtils.merge([
//         THREE.UniformsLib.common,
//         THREE.UniformsLib.fog,
//         {
//             worldUnits: {value: 1},
//             linewidth: {value: 1},
//             resolution: {value: new THREE.Vector2(1, 1)},
//             dashOffset: {value: 0},
//             dashScale: {value: 1},
//             dashSize: {value: 1},
//             gapSize: {value: 1} // todo FIX - maybe change to totalSize
//         }
//     ])
// }
//



@ASerializable("ALineMaterialModel")
export class  ALineMaterialModel extends AMaterialModelBase<LineMaterialParameters>{
    static GlobalInstance:ALineMaterialModel;
    constructor() {
        super(
            DefaultMaterials.LineMaterial,
            LineMaterial,
            {},
            {
                // color: undefined,
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide,
                depthWrite: true,
                depthTest:true,
                linewidth: 0.005,
                vertexColors:true
            });
    }


    _CreateTHREEJS(): Material {
        return super._CreateTHREEJS();
    }

    // _CreateTHREEJS(){
    //     return new LineMaterial({
    //         ...this.defaults,
    //         ...this.sharedParameters
    //     }, );
    // }

    get color(){
        return Color.FromThreeJS(this.sharedParameters['color']);
    }
    set color(c:Color){
        this.sharedParameters['color'] = c.asThreeJS();
    }
    getMaterialGUIParams(material:AMaterial){
        const self = this;

        return {
            // ...AMaterialModelBase.MaterialGUIColorControl(material),
            ...AMaterialModelBase.MaterialGUIControl(material, 'opacity', 1, {
                min:0,
                max:1,
                step:0.01
            }),
            // @ts-ignore
            ...AShaderModelBase.ShaderUniformGUIControl(material, 'linewidth', 1.0, {
                min:0,
                max:5,
                step:0.01
            })
        }
    }
}

ALineMaterialModel.GlobalInstance = new ALineMaterialModel();

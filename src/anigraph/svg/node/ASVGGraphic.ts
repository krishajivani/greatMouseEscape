import {ASerializable} from "../../base";
import {AGraphicElement, AGraphicGroup} from "../../rendering";
import {Color, Mat4, VertexArray3D} from "../../math";
import * as THREE from "three";
import {ASVGModel} from "./ASVGModel";
import {SVGAsset} from "../SVGAsset";

@ASerializable("ASVGGraphic")
export class ASVGGraphic extends AGraphicGroup{
    _svgObject!:THREE.Object3D;
    svgRootNode!:THREE.Object3D;
    get svgObject():THREE.Object3D{
        return this._svgObject;
    }


    setElementColor(elementName:string, color:Color){
        let parentObj = this.threejs;
        function setElColor(p:THREE.Object3D){
            if(p.type == "Mesh") {
                if (p.name == elementName) {
                    let material = ((p as THREE.Mesh).material as THREE.MeshBasicMaterial);
                    material.setValues({"color": color.asThreeJS()});
                    if(color.a<1){
                        material.setValues({"transparent": true});
                        material.setValues({"opacity": color.a});
                        // (p as THREE.Mesh).material.setValue("transparent", true);
                        // (p as THREE.Mesh).material.setValue("opacity", color.a);
                    }else{
                        material.setValues({"transparent": false});
                        material.setValues({"opacity": 1.0});
                    }
                }
            }
            for(let c of p.children){
                setElColor(c);
            }
        }
        setElColor(parentObj);
    }

    protected constructor(svgSourceObject:THREE.Object3D) {
        super();
        this._svgObject=svgSourceObject.clone();
        this.threejs.add(svgSourceObject);
    }

    static Create(svgAsset:SVGAsset, deepCopy?:boolean){
        let svgObj = svgAsset.getNewSceneObject(true, deepCopy);
        let group = new THREE.Group();
        group.matrixAutoUpdate=false;
        group.add(svgObj);
        let newNode = new this(group);
        newNode.svgRootNode = svgObj;
        return newNode;
    }

    setSourceTransform(mat:Mat4){
        mat.assignTo(this.svgRootNode.matrix);
    }

    // static Create(svgSourceObject:THREE.Object3D){
    //     return new this(svgSourceObject);
    // }
}

import * as THREE from "three";
import {AGraphicElement} from "../graphicobject";
import {Color, VertexArray3D} from "../../math";
import {ASerializable} from "../../base";

@ASerializable("ASphereGraphic")
export default class ASphereGraphic extends AGraphicElement{

    get geometry(){return this._geometry;}


    constructor(radius:number=100,
                material?:Color|THREE.Color|THREE.Material|THREE.Material[],
                ...args:any[]){
        // super(new THREE.SphereBufferGeometry(radius, 100, 100), material, ...args);
        super(VertexArray3D.ColoredSphere(radius, 20, 20), material);
    }
}

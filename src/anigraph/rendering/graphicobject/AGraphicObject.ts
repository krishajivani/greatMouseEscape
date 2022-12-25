import * as THREE from "three";
import {Color, Mat3, Mat4, TransformationInterface} from "../../math";
import {AMaterial} from "../material";
import {ASerializable} from "../../base";


@ASerializable("AGraphicObject")
export abstract class AGraphicObject {
    /**
     * This should be what is added to the threejs scenevis
     */
    abstract get threejs():THREE.Object3D;

    onMaterialUpdate(newMaterial:AMaterial, ...args:any[]){
    }
    onMaterialChange(newMaterial:AMaterial, ...args:any[]){
    }
    setColor(color:Color){
    }


    setObject3DName(name:string){
        this.threejs.name = name;
    }

    /**
     * This should be whatever receives events
     */
    // get eventHandler(){return this.threejs;}

    setMatrix(mat:Mat3|Mat4){
        if(mat instanceof Mat3){
            Mat4.From2DMat3(mat).assignTo(this.threejs.matrix);;
        }else{
            mat.assignTo(this.threejs.matrix);
        }

    }

    getMatrix(){return
        Mat4.FromThreeJS(this.threejs.matrix);
    }

    get uid(){
        return this.threejs.uuid;
    }

    add(toAdd:AGraphicObject){
        this.threejs.add(toAdd.threejs);
    }
    remove(toRemove:AGraphicObject){
        this.threejs.remove(toRemove.threejs);
    }

    get serializationLabel(){
        // @ts-ignore
        return this.constructor._serializationLabel
    }

    /** Get set visible */
    set visible(value){this.threejs.visible = value;}
    get visible(){return this.threejs.visible;}

    public setTransform(T:TransformationInterface){
        let mat = T.getMatrix();
        if(mat instanceof Mat3){
            mat = Mat4.From2DMat3(mat);
        }
        (mat as Mat4).assignTo(this.threejs.matrix);
    };

    dispose(){
        if(this.threejs){
            // this._mesh.dispose();
            this.threejs.parent?.remove(this.threejs);
        }

    }
}

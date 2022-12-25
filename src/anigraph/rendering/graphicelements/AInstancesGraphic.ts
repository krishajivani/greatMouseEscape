import {AGraphicObject} from "../graphicobject";
import {Color, Mat3, Mat4} from "../../math";

export abstract class AInstancesGraphic extends AGraphicObject{
    protected abstract _mesh:THREE.InstancedMesh;
    protected abstract _geometry:THREE.BufferGeometry;
    protected abstract _material:THREE.Material;
    protected _maxCount:number=10;
    get mesh(){return this._mesh;}
    /** Get set count */
    set count(value:number){this.mesh.count=value;}
    get count(){
        return this.mesh.count;
    }


    /**
     * Set the color of the instance in index `index`
     * @param index
     * @param color
     */
    setColorAt(index:number, color:Color){
        this.mesh.setColorAt(index, color.asThreeJS());
    }

    /**
     * Set the transformation matrix of the instance in index `index`
     * @param index
     * @param m
     */
    setMatrixAt(index:number, m:Mat4|Mat3){
        if(m instanceof Mat4){
            this.mesh.setMatrixAt(index, m.asThreeJS());
        }else{
            this.mesh.setMatrixAt(index, Mat4.From2DMat3(m).asThreeJS());
        }
    }

    dispose(){
        super.dispose();
        if(this._geometry){
            this._geometry.dispose();
        }
        if(this._material){
            this._material.dispose();
        }
    }

    setUsage(usage:THREE.Usage){
        // mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
        this.mesh.instanceMatrix.setUsage( usage );
    }

    get geometery(){return this._geometry;}
    get material(){return this._material;}
}

import {AShaderMaterial, Mat3, Mat4} from "../../../../../anigraph";
import {ATexture} from "../../../../../anigraph/rendering/ATexture";
import {Polygon2D, Polygon2DModel} from "../../Polygon2D";

const DefaultTextureMatrix =Mat4.From2DMat3(Mat3.Scale2D(0.5).times(Mat3.Translation2D(1.0, 1.0)));

export class TexturedPolygon2DModel extends Polygon2DModel{
    texture?:ATexture;
    textureMatrix:Mat4 = DefaultTextureMatrix;
    get material():AShaderMaterial{
        return this._material as AShaderMaterial;
    }

    constructor(verts?:Polygon2D, transform?:Mat3, textureMatrix?:Mat3|Mat4, ...args:any[]) {
        super(verts, transform);
        if(textureMatrix){
            if(textureMatrix instanceof Mat3){
                this.textureMatrix = textureMatrix.Mat4From2DH();
            }else{
                this.textureMatrix = textureMatrix;
            }
        }
    }

    setTexture(texture:ATexture){
        this.material.setTexture('input', texture);
    }
}


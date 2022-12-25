import * as THREE from "three";
import {ACameraModel} from "./ACameraModel";
import {AniGraphEnums, ASerializable} from "../../base";
import {Mat4, V4} from "../../math/linalg";
// import {AObjectState} from "../../base";

const ZNEAR:number = AniGraphEnums.DefaultZNear;
const ZFAR:number = AniGraphEnums.DefaultZFar;

@ASerializable("APerspectiveCamera")
export class APerspectiveCamera extends ACameraModel{


    CreateThreeJSCamera():THREE.PerspectiveCamera{
        return new THREE.PerspectiveCamera(this.fovy, this.aspect, this.zNear, this.zFar);
        // this.frustumLeft, this.frustumRight, this.frustumTop, this.frustumBottom, this.zNear, this.zFar
    }

    //##################//--Perspective--\\##################
    //<editor-fold desc="Perspective">
    setPerspectiveNearPlane(left:number, right:number, bottom:number, top:number, near:number=ZNEAR, far:number=ZFAR){
        this.lrbt = [left, right, bottom, top];
        this.zNear = near;
        this.zFar = far;
        this.updateProjection();
    }

    onCanvasResize(width: number, height: number) {
        let oldAspect = this.aspect;
        let newAspect = width/height;
        let ratio = newAspect/oldAspect;
        let newL = this.lrbt[0]*ratio;
        let newR = this.lrbt[1]*ratio;
        this.lrbt = [newL, newR, this.lrbt[2], this.lrbt[3]];
        this.updateProjection();
    }

    setPerspectiveFOV(fovy:number, aspect:number, near?:number, far?:number){
        this.zNear = near??ZNEAR;
        this.zFar = far??ZFAR;
        let m = Mat4.PerspectiveFromFOV(fovy, aspect, near, far);
        let minv = m.getInverse();
        let bl = minv.times(V4(-1,-1,-1,1)).Point3D;
        let tr = minv.times(V4(1,1,-1,1)).Point3D;
        this.lrbt=[bl.x,tr.x,bl.y,tr.y];
        this.updateProjection();
    }

    get fovy(){
        return Math.atan(this.frustumTop/this.zNear);
    }


    updateProjection(){
        this._setProjection(Mat4.PerspectiveFromNearPlane(this.lrbt[0], this.lrbt[1], this.lrbt[2], this.lrbt[3], this.zNear, this.zFar));
    }

    //</editor-fold>
    //##################\\--Perspective--//##################

    static CreatePerspectiveNearPlane(left:number, right:number, bottom:number, top:number, near:number=ZNEAR, far:number=ZFAR){
        let camera = new APerspectiveCamera();
        camera.setPerspectiveNearPlane(left, right, bottom, top, near, far);
        return camera;
    }

    static CreatePerspectiveFOV(fov: number, aspect: number, near: number=ZNEAR, far: number=ZFAR){
        let camera = new APerspectiveCamera();
        camera.setPerspectiveFOV(fov, aspect, near, far);
        return camera;
    }
}

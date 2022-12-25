import * as THREE from "three";
import {ACameraModel} from "./ACameraModel";
import {AniGraphEnums, AObjectState, ASerializable} from "../../base";
import {Mat4} from "../../math/linalg";
import {NodeTransform, NodeTransform3D} from "../../math/nodetransforms";
import {VertexArray} from "src/anigraph/math";
// import {AObjectState} from "../../base";


const ZNEAR: number = AniGraphEnums.DefaultZNear;
const ZFAR: number = AniGraphEnums.DefaultZFar;
const LEFT = -100;
const RIGHT = 100;
const TOP = 100;
const BOTTOM = -100;

@ASerializable("AOrthoCamera")
export class AOrthoCamera extends ACameraModel {
    normalized?:number;

    constructor(threeCamera?:THREE.OrthographicCamera);
    constructor(pose?:NodeTransform3D, projection?:Mat4);
    // constructor(pose?:NodeTransform3D, left?:number, right?:number, bottom?:number, top?:number, near?:number, far?:number);
    constructor(...args:any[]){
        super(...args);
        // this.setProjectionOrtho(left, right, bottom, top, near, far)
    }


    CreateThreeJSCamera():THREE.OrthographicCamera{
        return new THREE.OrthographicCamera(this.frustumLeft, this.frustumRight, this.frustumTop, this.frustumBottom, this.zNear, this.zFar);
    }

    updateProjection(){
        let center = this._nearPlaneCenter;
        let wh = this._nearPlaneWH.times(0.5);
        this._setProjection(Mat4.ProjectionOrtho(center.x-wh.x, center.x+wh.x, center.y-wh.y, center.y+wh.y, this.zNear, this.zFar));
    }
    onZoomUpdate() {
        this.updateProjection();
    }

    setProjectionOrtho(left:number, right:number, bottom:number, top:number, near:number=ZNEAR, far:number=ZFAR){
        this.zNear = near;
        this.zFar = far;
        this.lrbt = [left, right, bottom, top];
        this.updateProjection();
    }

    onCanvasResize(width: number, height: number) {
        // this.lrbt = [
        //     -width /2,
        //     width/2,
        //     -height/2,
        //     height/2
        // ];
        // let w = 2.0;
        let w=width;
        let h = height;
        if(this.normalized!==undefined){
            w = this.normalized;
            h = this.normalized*height/width;
        }

        this.lrbt = [
            -w /2,
            w/2,
            -h/2,
            h/2
        ];
        this.updateProjection();
    }

    static Create(left: number, right: number, bottom: number, top: number, near: number=ZNEAR, far: number=ZFAR, pose?:NodeTransform3D){
        let camera = new AOrthoCamera(pose);
        camera.setProjectionOrtho(left, right, bottom, top, near, far);
        return camera;
    }



    CreateConnectedTHREEJSCamera(){
        let threejs = this.CreateThreeJSCamera();
        return this.ConnectTHREEJSCamera(threejs);
    }

    ConnectTHREEJSCamera(threejs:THREE.OrthographicCamera){
        threejs.matrixAutoUpdate=false;
        const self = this;
        let updatePose = function(){
            self.getPose().getMatrix().assignTo(threejs.matrix);
            threejs.updateWorldMatrix(false, true);
        }

        let updateProjection = function(){
            self.getProjection().assignTo(threejs.projectionMatrix);
            self.getProjectionInverse().assignTo(threejs.projectionMatrixInverse);
        }
        this.addPoseListener(updatePose);
        this.addProjectionListener(updateProjection);
        updatePose();
        updateProjection();
        return threejs;
    }

}

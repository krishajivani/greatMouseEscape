import * as THREE from "three";
import {ACallbackSwitch, AniGraphEnums, AObject, AObjectState, ASerializable} from "../../base";
import {Mat4, V2, V4, Vec3, Vec4} from "../../math/linalg";
import {NodeTransform3D} from "../../math/nodetransforms";
import {ANodeModel, ANodeModel3D} from "../ANodeModel";
// import {AClock} from "../../base";

const ZNEAR:number = AniGraphEnums.DefaultZNear;
const ZFAR:number = AniGraphEnums.DefaultZFar;

enum CamUpdateEvents{
    POSE_UPDATED='CAMERA_POSE_UPDATED',
    PROJECTION_UPDATED='CAMERA_PROJECTION_UPDATED',
}



export interface HasCamera{
    addCameraProjectionListener(callback:(self:AObject)=>void, handle?:string, synchronous?:boolean):ACallbackSwitch;
    addCameraPoseListener(callback:(self:AObject)=>void, handle?:string, synchronous?:boolean):ACallbackSwitch;
}

@ASerializable("ACameraModel")
export abstract class ACameraModel extends ANodeModel3D{
    static CameraUpdateEvents = CamUpdateEvents;
    static DEFAULT_NEAR = ZNEAR;
    static DEFAULT_FAR = ZFAR;

    @AObjectState _pose:NodeTransform3D;
    @AObjectState protected _projection:Mat4;
    @AObjectState movementSpeed:number;
    @AObjectState zoom:number;
    @AObjectState lrbt:number[];
    @AObjectState zNear!:number;
    @AObjectState zFar!:number;


    abstract CreateThreeJSCamera():THREE.Camera;

    get position(){
        return this.pose.position;
    }

    get pose(){return this._pose;}
    get projection(){return this._projection;}
    set pose(p:NodeTransform3D){
        this._pose = p;
    }
    set projection(p:Mat4){
        this._projection = p;
    }

    get frustumLeft(){return this.lrbt[0];}
    get frustumRight(){return this.lrbt[1];}
    get frustumBottom(){return this.lrbt[2];}
    get frustumTop(){return this.lrbt[3];}



    getPose(){return this.pose;}
    getProjection(){return this.projection;}
    getProjectionInverse(){return this.projection.getInverse();}
    get modelMatrix(){return this.pose.getMatrix();}
    get viewMatrix(){return this.pose.getMatrix().getInverse();}
    get PV(){return this.projection.times(this.viewMatrix);}

    get right(){return this.pose.rotation.Mat4().c0.Point3D;}
    get up(){return this.pose.rotation.Mat4().c1.Point3D;}
    get backward(){return this.pose.rotation.Mat4().c2.Point3D;}
    get forward(){return this.backward.times(-1);}


    abstract onCanvasResize(width:number, height:number):void;

    get aspect(){
        let wh = this._nearPlaneWH;
        return wh.x/wh.y;
    }

    /**
     * update projection when lrtb, zoom, or near/far have changed
     */
    abstract updateProjection():void;

    _setProjection(projection:Mat4, signalEvent:boolean=true){
        this.projection = projection;
        if(signalEvent) {
            this.signalEvent(ACameraModel.CameraUpdateEvents.PROJECTION_UPDATED);
        }
    }

    constructor(threeCamera?:THREE.Camera);
    constructor(pose?:NodeTransform3D, projection?:Mat4);
    constructor(...args:any[])
    {
        super();
        this._pose = new NodeTransform3D();
        this._projection = new Mat4()
        this.movementSpeed=AniGraphEnums.DefaultMovementSpeed;
        this.zoom = 1;
        this.lrbt=[];
        this.zNear=ACameraModel.DEFAULT_NEAR;
        this.zFar=ACameraModel.DEFAULT_FAR;
        // console.log(this.zNear);
        // console.log(this.zFar);
        // console.log(ACameraModel.DEFAULT_NEAR);
        // console.log(ACameraModel.DEFAULT_FAR);


        if(args.length) {
            if(args[0] instanceof THREE.Camera) this.setWithThreeJSCamera(args[0]);
            if(args[0] instanceof NodeTransform3D) this.pose = args[0];
            if(args[1] && args[1] instanceof Mat4) this.projection = args[1];
        }
        const self = this;
        this.addStateKeyListener('zoom', ()=>{
            self.onZoomUpdate();
        })
    }

    addPoseListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true,){
        return this.addStateKeyListener('_pose', callback, handle, synchronous);
    }
    addProjectionListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        return this.addStateKeyListener('_projection', callback, handle, synchronous);
    }

    setProjection(projection:Mat4){
        this._setProjection(projection);
        let pinv = this.projection.getInverse();
        this.zNear = pinv.times(V4(0.0,0.0,-1.0, 1.0)).getHomogenized().z;
        this.zFar = pinv.times(V4(0.0,0.0,1.0, 1.0)).getHomogenized().z;
    }

    setPose(pose:NodeTransform3D){
        this.pose = pose;
    }

    setPosition(position:Vec3){
        this.pose.position = position;
    }

    setWithThreeJSCamera(camera:THREE.Camera){
        this.setProjection(Mat4.FromThreeJS(camera.projectionMatrix));
        if(camera.matrixAutoUpdate){
            this.setPose(NodeTransform3D.FromThreeJSObject(camera));
        }else{
            this.setPose(NodeTransform3D.FromMatrix(Mat4.FromThreeJS(camera.matrix)));
        }
    }

    onZoomUpdate() {
        this.updateProjection();
    }


    get _nearPlaneCenter(){
        return V2(this.frustumLeft,this.frustumBottom).plus(V2(this.frustumRight, this.frustumTop)).times(0.5);
    }
    get _nearPlaneWH(){
        return V2(this.frustumRight, this.frustumTop).minus(V2(this.frustumLeft,this.frustumBottom)).times(1.0/this.zoom);
    }

    getProjectedPoint(p:Vec3|Vec4){
        let pointIn = (p instanceof Vec4)?p:p.Point3DH;
        return this.getWorldToNDC().times(pointIn).Point3D;
    }

    getWorldSpaceProjectionOnNearPlane(p:Vec3|Vec4, offset:number=0.001){
        let pointIn = (p instanceof Vec4)?p:p.Point3DH;
        let proj = this.getWorldToNDC().times(pointIn).getHomogenized();
        proj.z=-1+offset;
        let npointh = this.getWorldToNDC().getInverse().times(proj);
        return npointh.Point3D;
    }

    getHUDTransform(){
        return Mat4.Translation3D(new Vec3(0,0,-0.99)).times(this.modelMatrix);
    }

    getWorldToNDC(){
        return this.PV;
    }

    /**
     * gets a matrix with:
     * x column: the vector from the left of the near plane to the right of the near plane in world coords
     * y column: the vector from the bottom of the near plane to the top of the near plane in world coords
     * z column: the vector from the near to the far plane in world coords
     * w column: the location of the middle of the near plane
     */
    _getNearPlaneMatrix(camera:THREE.Camera){
        let camPVMI = this.getWorldToNDC().getInverse();
        let maxMat = Mat4.Identity();
        // set depth of x and y columns to near plane
        maxMat.r2=new Vec4(-1,-1,1,0);
        // set homogeneous coords of columns to 1
        maxMat.r3=new Vec4(1,1,1,1);

        maxMat = camPVMI.times(maxMat);
        let minMat = Mat4.Scale3D(-1);
        // set depth of x y and z to near plane
        minMat.r2=new Vec4(-1,-1,-1,-1);
        // set homogeneous coords of columns to 1
        minMat.r3 = new Vec4(1,1,1,1);
        minMat = camPVMI.times(minMat);

        let rmat = new Mat4();
        rmat.c0=maxMat.c0.getHomogenized().minus(minMat.c0.getHomogenized());
        rmat.c1=maxMat.c1.getHomogenized().minus(minMat.c1.getHomogenized());
        rmat.c2=maxMat.c2.getHomogenized().minus(minMat.c2.getHomogenized());
        rmat.c3 = minMat.c3.getHomogenized();
        return rmat;
    }

    /**
     * gets a matrix with:
     * x column: the vector from the left of the far plane to the right of the far plane in world coords
     * y column: the vector from the bottom of the far plane to the top of the far plane in world coords
     * z column: the vector from the near to the far plane in world coords
     * w column: the location of the middle of the far plane
     */
    _getFarPlaneMatrix(camera:THREE.Camera){
        let camPVMI = this.getWorldToNDC().getInverse();
        let maxMat = Mat4.Identity();
        // set depth of x and y columns to far plane
        maxMat.r2=new Vec4(1,1,1,0);
        // set homogeneous coords of columns to 1
        maxMat.r3=new Vec4(1,1,1,1);
        maxMat = camPVMI.times(maxMat);
        let minMat = Mat4.Scale3D(-1);
        // set depth of x y and z to far plane
        minMat.r2=new Vec4(1,1,-1,1);
        // set homogeneous coords of columns to 1
        minMat.r3 = new Vec4(1,1,1,1);
        minMat = camPVMI.times(minMat);
        let rmat = new Mat4();
        rmat.c0=maxMat.c0.getHomogenized().minus(minMat.c0.getHomogenized());
        rmat.c1=maxMat.c1.getHomogenized().minus(minMat.c1.getHomogenized());
        rmat.c2=maxMat.c2.getHomogenized().minus(minMat.c2.getHomogenized());
        rmat.c3 = minMat.c3.getHomogenized();
        return rmat;
    }
}

import {AObjectState, AObject, ACallbackSwitch, HasTags} from "../base";
import {AModel} from "../base/amvc/AModel";
import {
    AGeometrySet,
    BoundingBox2D,
    BoundingBox3D,
    Color,
    HasBounds, HasBounds2D, Mat3, Mat4,
    NodeTransform, NodeTransform2D,
    NodeTransform3D, Quaternion, V2, V3,
    VertexArray, VertexArray2D,
    VertexArray3D
} from "../math";
import {AMaterial} from "../rendering/material";
import type {TransformationInterface} from "../math"

const MATERIAL_UPDATE_SUBSCRIPTION_HANDLE = 'MATERIAL_UPDATE_SUBSCRIPTION_SceneNodeModel';

enum ANodeModelEvents{
    GEOMETRY_UPDATE = "GEOMETRY_UPDATE",
    TRANSFORM_UPDATE = "TRANSFORM_UPDATE"
}

export abstract class ANodeModel extends AModel implements HasTags{
    abstract get verts():VertexArray<any>;
    // abstract get transform():NodeTransform<any, any>
    abstract get transform():TransformationInterface;
    abstract setVerts(verts:VertexArray<any>):void;
    abstract setTransform(transform:TransformationInterface):void;
    // abstract getBounds2D():BoundingBox2D;
    // abstract getBounds3D():BoundingBox3D;


    // @AObjectState protected _transform!:TransformationInterface;
    @AObjectState protected _transform!:TransformationInterface;
    // @AObjectState protected _transform!:Mat4;
    @AObjectState protected _matrix!:Mat4;
    @AObjectState color!:Color;
    @AObjectState _nodeTags!:{[tagName:string]:any};

    // get matrix(){
    //     return this._matrix;
    // }
    // set matrix(value:Mat4){
    //     this._matrix = value;
    // }

    protected getNodeTags(){return this._nodeTags;}
    addTag(tagName:string){
        this._nodeTags[tagName]=true;
    }

    setTagValue(tagName:string, value:any){
        this._nodeTags[tagName]=value;
    }

    hasTag(tagName:string){
        return (tagName in this._nodeTags);
    }

    getTagValue(tagName:string){
        return this._nodeTags[tagName];
    }

    removeTag(tagName:string){
        delete this._nodeTags[tagName];
    }

    static NodeModelEvents = ANodeModelEvents;
    protected _geometry!:AGeometrySet;
    get geometry(){return this._geometry;}


    // get verts():VertexArray<any>{return _verts;}

    protected _material!:AMaterial;
    get material(){return this._material;}
    // get transform(){return this._transform;}
    // setTransform(t:NodeTransform3D){this._transform=t;}
    // protected set transform(t:NodeTransform3D){
    //     this.setTransform(t);
    // }


    constructor(...args:any[]) {
        super();
        this._nodeTags = [];
        this._geometry = new AGeometrySet();
        this.signalGeometryUpdate = this.signalGeometryUpdate.bind(this);
    }


    // init(){
    //     this.verts = new GeometrySet();
    //     this._transform = new NodeTransform3D();
    //     this.color = Color.Random();
    // }


    //##################//--Listeners--\\##################
    //<editor-fold desc="Listeners">

    addColorListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        return this.addStateKeyListener('color', callback, handle, synchronous);
    }

    addMaterialUpdateListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(AMaterial.Events.UPDATE, callback, handle);
    }
    addMaterialChangeListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(AMaterial.Events.CHANGE, callback, handle);
    }

    addTransformListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true):ACallbackSwitch{
        return this.addEventListener(ANodeModel.NodeModelEvents.TRANSFORM_UPDATE, callback, handle);
        // return this.addStateKeyListener('_transform', callback, handle, synchronous);
    }

    addGeometryListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        // return this.addStateKeyListener('verts', callback, handle, synchronous);
        // return this.addStateKeyListener('verts', callback, handle, synchronous);
        return this.addEventListener(ANodeModel.NodeModelEvents.GEOMETRY_UPDATE, callback, handle);
    }

    signalGeometryUpdate(){
        this.signalEvent(ANodeModel.NodeModelEvents.GEOMETRY_UPDATE, this);
    }

    signalTransformUpdate(){
        this.signalEvent(ANodeModel.NodeModelEvents.TRANSFORM_UPDATE, this);
    }

    // signalMaterialUpdate(){
    //     this.signalEvent(ANodeModel.NodeModelEvents.MATERIAL_UPDATE, this);
    // }
    //</editor-fold>
    //##################\\--Listeners--//##################

    //##################//--Material Updates--\\##################
    //<editor-fold desc="Material Updates">
    setMaterial(material:AMaterial|string){
        if(this.material === material){
            return;
        }else{
            let amaterial:AMaterial;
            if(material instanceof AMaterial){
                amaterial=material;
            }else{
                throw new Error("Material from string not implemented yet. Should look up in MaterialManager.")
                // amaterial = GetAppState().CreateMaterial(material);
            }
            let color = this.color;
            if(this.material){
                this._disposeMaterial()
            }
            this._material = amaterial;
            if(color) {
                this._material.setModelColor(color);
            }
            this.setMaterialUpdateSubscriptions();
        }
        this.signalEvent(AMaterial.Events.CHANGE)
    }

    _disposeMaterial(){
        this.unsubscribe(MATERIAL_UPDATE_SUBSCRIPTION_HANDLE);
        this.material.release();
    }


    onMaterialUpdate(...args:any[]){
        this.signalEvent(AMaterial.Events.UPDATE, ...args);
    }

    setMaterialUpdateSubscriptions(){
        const self = this;
        this.subscribe(this.material.addEventListener(AMaterial.Events.UPDATE, (...args:any[])=>{
            self.onMaterialUpdate(AMaterial.Events.UPDATE, ...args)
        }), MATERIAL_UPDATE_SUBSCRIPTION_HANDLE);
        this.material.subscribe(this.addStateKeyListener('color', ()=>{
            self.material.setModelColor(self.color);
            if('opacity' in self.material._material) self.material.setValue('opacity', self.color.a);
        }))
    }


    timeUpdate(t:number){

    }

    //</editor-fold>
    //##################\\--Material Updates--//##################


}


export abstract class ANodeModelClass<TransformType extends TransformationInterface, VertexArrayType extends VertexArray<any>> extends ANodeModel{
    // abstract get verts():VertexArray<any>;
    // abstract setVerts(verts:VertexArray<any>):void;
    get transform():TransformType{
        return this._transform as TransformType;
    };
    setTransform(transform:TransformType){
        this._transform = transform;
        this.signalTransformUpdate();
    }
    protected set transform(t:TransformType){
        this.setTransform(t);
    }

    get verts(): VertexArrayType{
        return this._geometry.verts as VertexArrayType;
    }

    _setVerts(verts: VertexArrayType) {
        this._geometry.verts=verts;
    }
    setVerts(verts: VertexArrayType) {
        this._setVerts(verts);
        this.signalGeometryUpdate();
    }

    constructor(verts?:VertexArrayType, transform?:TransformType) {
        super();
        if(transform !== undefined){
            this._transform = transform;
        }
        if(verts !== undefined){
            this._setVerts(verts);
        }
    }

    /**
     * Returns the transform from object coordinates (the coordinate system where this.verts is
     * defined) to world coordinates
     * @returns {TransformType}
     */
    getWorldTransform():TransformType{
        let parent = this.parent;
        if(parent && parent instanceof ANodeModelClass){
            return parent.getWorldTransform().times(this.transform);
        }else{
            return this.transform;
        }
    }

}

export class ANodeModel3D extends ANodeModelClass<Mat4,VertexArray3D> implements HasBounds{
    constructor() {
        super();
        this._transform = new Mat4();
        this.color = Color.Random();
        this._setVerts(new VertexArray3D());
    }


    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox3D}
     */
    getBounds(): BoundingBox3D {
        let b = this.verts.getBounds();
        b.transform = this.transform;
        return b;
    }


    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox2D}
     */
    getBounds2D(): BoundingBox2D {
        let tpoint = new VertexArray3D()
        tpoint.position = this.verts.position.GetTransformedByMatrix(this.transform.getMatrix());
        return tpoint.getBounds().getBoundsXY();
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox3D}
     */
    getBounds3D(): BoundingBox3D {
        let b = this.verts.getBounds();
        b.transform = this.transform;
        return b;
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox3D}
     */
    getBoundsXY(): BoundingBox2D {
        return this.getBounds().getBoundsXY();
    }

}

export class ANodeModel2D extends ANodeModelClass<Mat3, VertexArray2D> implements HasBounds2D{
    _zValue:number=0;
    /** Get set zValue */
    set zValue(value){
        this._zValue = value;
        this.signalGeometryUpdate();
    }
    get zValue(){return this._zValue;}
    constructor() {
        super();
        this._transform = new Mat3();
        this.color = Color.Random();
        this._setVerts(new VertexArray2D());
    }

    get transform(): Mat3 {
        return this._transform as Mat3;
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox2D}
     */
    getBounds(): BoundingBox2D {
        let b = this.verts.getBounds().getBoundsXY();
        b.transform = this.transform;
        return b;
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox2D}
     */
    getBounds2D(): BoundingBox2D {
        let b = this.verts.getBounds().getBoundsXY();
        b.transform = this.transform;
        return b;
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox3D}
     */
    getBounds3D(): BoundingBox3D {
        let b = this.verts.getBounds();
        b.transform = this.transform.Mat4From2DH();
        return b;
    }

    /**
     * Right now, bounds are only transformed by the model's current (local) transform
     * @returns {BoundingBox3D}
     */
    getBoundsXY(): BoundingBox2D {
        return this.getBounds();
    }
}


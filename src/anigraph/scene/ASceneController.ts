import * as THREE from "three";
import {
    AController, AInteractionEvent,
    AModel,
    AModelInterface, AObjectNode, AObjectState,
    AView,
    ClassInterface,
    HasModelViewMap,
    SceneControllerInterface
} from "../base";
import {AGLContext, AGLRenderWindow, ARenderDelegate, AShaderModel, ShaderManager} from "../rendering";
import {AClock} from "../time/AClock";
import {ASceneModel, SceneEvents} from "./ASceneModel";
import {ASceneView} from "./ASceneView";
import {ACameraView, APerspectiveCamera} from "./camera";
import {ANodeModel} from "./ANodeModel";
import {ANodeView} from "./ANodeView";
import {Mat4, Vec2} from "../math";
import {AModelViewClassMap, AMVClassSpec, AMVClassSpecDetails} from "../base/amvc/AModelViewClassSpec";


export enum SceneControllerSubscriptions {
    ModelNodeAdded = "ModelNodeAdded",
    ModelNodeRemoved = "ModelNodeRemoved"
}

export abstract class ASceneController extends AController implements ARenderDelegate, HasModelViewMap, SceneControllerInterface {
    @AObjectState protected readyToRender:boolean;
    classMap:AModelViewClassMap;
    _renderWindow!: AGLRenderWindow;
    protected _model!: ASceneModel;
    protected _view!: ASceneView;
    protected _cameraView!: ACameraView;


    abstract initModelViewSpecs():void;
    abstract onAnimationFrameCallback(context: AGLContext): void
    abstract initCamera():void;
    abstract initInteractions():void;

    get2DWorldCoordinatesForCursorEvent(event?:AInteractionEvent):Vec2{
        return this.model.get2DWorldCoordinatesForCursorEvent(event);
    }


    async initScene(){
        this.initCamera();
        this.initInteractions();
    }

    get isReadyToRender(): boolean {
        return this.readyToRender;
    }

    get renderWindow(): AGLRenderWindow {
        return this._renderWindow;
    }

    get renderer(): THREE.WebGLRenderer {
        return this.renderWindow.renderer;
    }

    get sceneController(){
        return this;
    }

    get eventTarget(): HTMLElement {
        return this.renderWindow.contextElement;
    }

    constructor(model: ASceneModel) {
        super();
        this.readyToRender=false;
        this.classMap = new AModelViewClassMap();
        // this._clock = new AClock();
        // this._clock.play();
        this.onModelNodeAdded = this.onModelNodeAdded.bind(this);
        this.onModelNodeRemoved = this.onModelNodeRemoved.bind(this);

        this.initModelViewSpecs();

        if (model) {
            this.setModel(model)
        }
    }

    async PreloadAssets(){
        // await this.model.PreloadAssets();
    };

    async initRendering(renderWindow: AGLRenderWindow) {
        this._renderWindow = renderWindow;
        this._view = new ASceneView(this);
        this.renderer.autoClear = false;
        this.renderer.clear()
        await this.model.confirmInitialized();
        this._cameraView = ACameraView.Create(this.model.camera);
        await this.initScene();
        this.addModelSubscriptions();
        this.readyToRender = true;
    }

    createViewForNodeModel(nodeModel: ANodeModel){
        let spec = this.classMap.getSpecForModel(nodeModel);
        if(spec){
            let view = new (spec.viewClass)();
            view.setModel(nodeModel);
            return view;
        } else{
            throw new Error(`Unsure how to create view for ${nodeModel} with class ${nodeModel.constructor.name}`)
        }
    }

    addModelViewSpec(modelClass:ClassInterface<ANodeModel>, viewClass:ClassInterface<ANodeView>, details?:AMVClassSpecDetails){
        this.classMap.addSpec(new AMVClassSpec(modelClass, viewClass, details))
    }

    setModel(model: ASceneModel) {
        if (this._model && this._model !== model) {
            this._unSetModel();
        }
        this._model = model;
        this._view = new ASceneView(this);
    }

    protected addModelSubscriptions() {
        const self = this;
        this.subscribe(this.model.addEventListener(SceneEvents.NodeAdded, (node: ANodeModel) => {
            self.onModelNodeAdded(node);
        }), SceneControllerSubscriptions.ModelNodeAdded);
        this.subscribe(this.model.addEventListener(SceneEvents.NodeRemoved, (node: ANodeModel) => {
            self.onModelNodeRemoved(node);
        }), SceneControllerSubscriptions.ModelNodeRemoved);
        this.model.mapOverDescendants((descendant:AObjectNode)=>{
            self.onModelNodeAdded(descendant as ANodeModel);
        })

    }

    protected _unSetModel() {
        this.clearSubscriptions();
        this.view.release();
    }

    get model(): ASceneModel {
        return this._model as ASceneModel;
    }

    get view(): ASceneView {
        return this._view as ASceneView;
    }

    get camera() {
        return this._cameraView.model;
    }

    // get clock() {
    //     return this._clock;
    // }

    protected get _threeCamera() {
        return this._cameraView.threejs;
    }

    get modelMap() {
        return this.model.modelMap
    };

    get viewMap() {
        return this.view.viewMap;
    }

    hasModel(model: AModelInterface) {
        return this.model.hasModel(model);
    };

    hasView(view: AView) {
        return this.view.hasView(view);
        // return (this.model.hasModelID(view.modelID) && view.uid in this.viewMap[view.modelID]);
    }

    addView(view: ANodeView) {
        this.view.addView(view);
    }

    removeView(view: AView) {
        this.view.removeView(view);
    }

    getViewListForModel(model: AModelInterface) {
        return this.view.getViewListForModel(model);
    }

    onModelNodeAdded(nodeModel: ANodeModel) {
        let newView = this.createViewForNodeModel(nodeModel);
        this.view.addView(newView);
    }

    onModelNodeRemoved(nodeModel: ANodeModel) {
        let views = this.view.getViewListForModel(nodeModel);
        for (let v of views) {
            v.release();
        }
        delete this.viewMap[nodeModel.uid];
    }

    onResize(renderWindow: AGLRenderWindow): void {
        this.renderer.setSize(renderWindow.container.clientWidth, renderWindow.container.clientHeight);
        this.camera.onCanvasResize(renderWindow.container.clientWidth, renderWindow.container.clientHeight);
    }

    async loadShader(name:string){
        return this.model.loadShader(name);
    }
    async loadLineShader(name:string){
        return this.model.loadLineShader(name);
    }

}

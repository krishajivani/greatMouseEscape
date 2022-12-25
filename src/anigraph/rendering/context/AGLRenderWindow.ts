/**
 * @file Manages the configuration settings for the widget.
 * @author Abe Davis
 * @description Defines AGLRenderWindow class, which connects an AGLContext with a HTMLElement and provides functionality for window image capture.
 */
import {AObject, AObjectState, ASerializable} from "../../base";
import {AGLContext} from "./AGLContext";
import * as ARenderDelegate from "./ARenderDelegate";
import {ASceneController} from "../../scene";


@ASerializable("AGLRenderWindow")
export class AGLRenderWindow extends AObject {
    @AObjectState isRendering:boolean;
    protected _frameRequested:boolean=false;
    protected _delegate!:ARenderDelegate.ARenderDelegate;
    public container!: HTMLElement;
    protected _context!: AGLContext;

    get contextElement(){
        return this.context.renderer.domElement;
    }

    protected _recordNextFrame: boolean = false;
    protected _recordNextFrameCallback!: (imageBlob: Blob | null) => void;

    get aspect(){
        return this.container.clientWidth/this.container.clientHeight;
    }

    constructor(context?:AGLContext, delegate?: ARenderDelegate.ARenderDelegate, container?:HTMLElement,){
        super();
        this.isRendering=false;
        if(context) {
            this.setContext(context);
        }
        if(container){
            this.setContainer(container);
        }
        if(delegate) {
            this.setDelegate(delegate);
            // this._delegate = delegate;
            // this.delegate.initRendering(this);
        }
        this.bindMethods();

        const self = this;
        window.addEventListener("resize", ()=>{
            if(self.delegate) {
                self.delegate.onResize(self);
            }
        });
    }

    get delegate(){return this._delegate;}
    get context(): AGLContext {return this._context;}
    get renderer() {return this.context.renderer;}


    setContainer(container:HTMLElement){
        this.container = container;
        this.container.appendChild(this.renderer.domElement);
        this.renderer.setSize(this.container.clientWidth, this.container.clientWidth);
    }

    setContext(context:AGLContext){
        this._context = context;
    }


    async setDelegate(delegate:ARenderDelegate.ARenderDelegate){
        this._delegate = delegate;
        this._delegate.PreloadAssets().then(()=>{
            delegate.initRendering(this);
            // delegate.setReadyToRender(true);
        });
        // this.delegate.initRendering()
    }

    bindMethods(){
        this.render = this.render.bind(this);
        this._saveSingleFrameCallback = this._saveSingleFrameCallback.bind(this);
    }

    recordNextFrame(callback?:(imageBlob:Blob|null)=>void){
        if(callback===undefined){
            this._recordNextFrameCallback = this._saveSingleFrameCallback;
        }else{
            this._recordNextFrameCallback=callback;
        }
        this._recordNextFrame = true;
    }

    _saveSingleFrameCallback(imageBlob:Blob|null){
        // @ts-ignore
        saveAs(imageBlob, `${this.serializationLabel}.png`);
    }

    stopRendering(){
        this.isRendering = false;
    }

    startRendering(){
        if(!this.isRendering){
            this.isRendering=true;
            this.render();
        }
    }

    render(){
        if(this.isRendering){
            requestAnimationFrame(()=>this.render());
            this._frameRequested=true;
            if(this.delegate.isReadyToRender) {
                this.delegate.onAnimationFrameCallback(this.context);
                if (this._recordNextFrame === true) {
                    this._recordNextFrame = false;
                    let self = this;
                    this.renderer.domElement.toBlob(function (blob: Blob | null) {
                        self._recordNextFrameCallback(blob);
                    });
                    console.warn("May be using DOM element resolution for saving frame...")
                }
            }
        }
    }
}

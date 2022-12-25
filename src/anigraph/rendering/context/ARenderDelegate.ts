import {AObject} from "../../base";
import {AGLRenderWindow} from "./AGLRenderWindow";
import {AGLContext} from "./AGLContext";




export interface ARenderDelegate{
    // contextView:AGLContextView;
    get isReadyToRender():boolean;
    // setReadyToRender(value:boolean):void;
    initRendering(contextView:AGLRenderWindow):Promise<void>;
    onAnimationFrameCallback(context:AGLContext):void;
    onResize(renderWindow:AGLRenderWindow):void;
    get renderWindow():AGLRenderWindow;
    PreloadAssets():Promise<void>;
    // get renderer():THREE.WebGLRenderer;
}

// type RenderDelegate implements ARenderDe

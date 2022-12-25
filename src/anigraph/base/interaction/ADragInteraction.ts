import {AInteraction, AInteractionEvent, AInteractionEventListener, PointerEvents,} from "./AInteraction";
import {CallbackType} from "../basictypes";
import {Vec2} from "../../math";


export type ADragInteractionCallback = (event:AInteractionEvent, interaction:ADragInteraction)=>any;
// export type ADragSelectionCallback = (interaction:ADragInteraction, currentModelData:GenericDict, event?:any)=>any;

enum DragInteractionStates{
    CURSOR_START_POSITION="CURSOR_START_POSITION",
    CURSOR_LAST_POSITION="CURSOR_START_POSITION",
}

export class ADragInteractionBase extends AInteraction{
    public _dragCallbacks:{[name:string]:CallbackType}={};
    public _dragSetCallback!:CallbackType|null;
    public _mouseDownEventListener!:AInteractionEventListener;
    public _mouseMoveEventListener!:AInteractionEventListener;
    public _mouseUpEventListener!:AInteractionEventListener;
    // public dragStartPosition!:Vec2;
    public dragStartEvent!:AInteractionEvent|undefined;

    get cursorStartPosition(){
        return this.getInteractionState("CURSOR_START_POSITION")
    }
    set cursorStartPosition(value:Vec2){
        this.setInteractionState("CURSOR_START_POSITION", value);
    }


    dispose(){
        this._removeDragListeners();
        this.clearInteractionState();
        super.dispose();
    }

    activate(){
        this._removeDragListeners();
        this._addDragListeners();
        this._mouseDownEventListener.addListener();
        this.active = true;
    }

    deactivate(){
        this.clearInteractionState();
        super.deactivate();
    }

    setDragStartCallback(dragStartCallback:CallbackType){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['start'] = dragStartCallback;
        if(this.active){this._updateDragListeners();}
    }

    getDragStartCallback(){return this._dragCallbacks['start'];}
    callDragStartCallback(event:any){
        return this._dragCallbacks['start'](event, this)
    }

    setDragMoveCallback(dragMoveCallback:CallbackType){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['move'] = dragMoveCallback;
        if(this.active){this._updateDragListeners();}
    }
    getDragMoveCallback(){return this._dragCallbacks['move'];}
    callDragMoveCallback(event:any){
        return this._dragCallbacks['move'](event, this)
    }

    setDragEndCallback(dragEndCallback?:CallbackType){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        if(dragEndCallback) {
            this._dragCallbacks['end'] = dragEndCallback;
        }else{
            this._dragCallbacks['end'] = (event:Event)=>{};
        }
        if(this.active){this._updateDragListeners();}
    }
    getDragEndCallback(){return this._dragCallbacks['end'];}
    callDragEndCallback(event:any){
        return this._dragCallbacks['end'](event, this)
    }

    _updateDragListeners(){
        this._removeDragListeners();
        this._addDragListeners();
    }
    _removeDragListeners(){
        this.clearEventListeners();
    }
    _addDragListeners(){
        if(this._dragSetCallback===undefined){
            this._dragSetCallback=null;
        }
        if(this._dragSetCallback!==null){
            this._removeDragListeners();
        }
        const interaction = this;
        const self = this;

        function dragmovingcallback(event:AInteractionEvent) {
            event.preventDefault();
            interaction.callDragMoveCallback(event);
        }
        // if(this.element instanceof THREE.Object3D) {
        //     self._mouseMoveEventListener = self.addSceneEventListener(PointerEvents.POINTER_MOVE, dragmovingcallback);
        // }else{
            // element is a DOM element...
        self._mouseMoveEventListener =self.addDOMEventListener(PointerEvents.POINTER_MOVE, dragmovingcallback);
        // }

        function dragendcallback(event:AInteractionEvent) {
            event.preventDefault();
            interaction.callDragEndCallback(event);
            self._mouseMoveEventListener.removeListener();
            interaction.dragStartEvent = undefined;
            // startCallback();
        }

        self._mouseUpEventListener =self.addDOMEventListener(PointerEvents.POINTER_UP, dragendcallback, {once:true});

        // self._mouseUpEventListener = self.addWindowEventListener(PointerEvents.POINTER_UP, dragendcallback);


        this._dragSetCallback = function(event:AInteractionEvent){
            if(self.onlyOnFirstIntersection && !event.onFirstIntersection){
                event.preventDefault();
            }else{
                event.preventDefault();
                if(!self._shouldIgnoreEvent(event._event)){
                    interaction.callDragStartCallback(event);
                    interaction.dragStartEvent = event;
                    self._mouseMoveEventListener.addListener();
                    self._mouseUpEventListener.addListener();
                }
            }
        }

        // startCallback();
        if(interaction._dragSetCallback) {
            self._mouseDownEventListener = self.addEventListener(PointerEvents.POINTER_DOWN, interaction._dragSetCallback);
        }
    }
}

export class ADragInteraction extends ADragInteractionBase{
    /**
     * Adds a drag interaction to a specified threejs object with the given callbacks.
     * Most of the time you probably want to leave out the handle argument, unless you know what you are doing
     * and it's for debugging.
     *
     * @param element - a THREE.Object3D, (or Mesh, or any other object that inherits THREE.Object3D)
     * @param dragStartCallback
     * @param dragMoveCallback
     * @param dragEndCallback
     * @param handle
     * @returns {ADragInteraction}
     * @constructor
     */
    static Create(element:any,
                  dragStartCallback:ADragInteractionCallback,
                  dragMoveCallback:ADragInteractionCallback,
                  dragEndCallback?:ADragInteractionCallback,
                  handle?:string){
        const interaction = new this(element, undefined, handle);
        interaction.setDragStartCallback(dragStartCallback);
        interaction.setDragMoveCallback(dragMoveCallback);
        interaction.setDragEndCallback(dragEndCallback);
        interaction.bindMethods();
        //Finally, return the interaction
        return interaction;
    }
}

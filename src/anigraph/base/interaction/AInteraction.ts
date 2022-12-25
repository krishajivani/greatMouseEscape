/**
 * For defining interactions with graphics.
 * If you want to subclass to cover a different class of interactions (e.g., not using three.interaction) you just need to change the addEventListener call to use
 */
import {V2, Vec2} from "../../math";
import {ACallbackSwitch} from "../index";
import {HasInteractions} from "../amvc/HasInteractions";
import {Element} from "typedoc/dist/lib/utils/jsx";

export const enum PointerEvents{
    POINTER_UP = 'pointerup',
    POINTER_DOWN='pointerdown',
    POINTER_MOVE = 'pointermove',
    POINTER_CLICK = 'click',
    POINTER_WHEEL='wheel',
    POINTER_OVER='pointerover'
}

export const enum DOMPointerEvents{
    POINTER_CLICK = 'pointertap',
    POINTER_MOVE = 'pointermove',
}


// interface ReceivesOnOffInteractionsInterface{
//     on(eventType:string, callback:(...args:any[])=>any):any;
//     off(eventType:string, callback:(...args:any[])=>any):any;
//     once(eventType:string, callback:(...args:any[])=>any):any;
// }

interface ReceivesEventListenerInteractionsInterface{
    addEventListener(eventType:string, callback:(event:any)=>any, ...args:any[]):any;
    removeEventListener(eventType:string, callback:(event:any)=>any, ...args:any[]):any;
}

export type AReceivesInteractionsInterface =ReceivesEventListenerInteractionsInterface;
    // ReceivesEventListenerInteractionsInterface|ReceivesOnOffInteractionsInterface;

export interface AInteractionEventListener{
    eventType: string;
    addListener: () => void;
    removeListener: () => void;
}

export interface InteractionEventInterface extends Event{
    clientX?:number;
    clientY?:number;
    key?:string;
    code?:string;
}


export abstract class AInteractionEvent{
    public interaction!:AInteraction;
    abstract _event:InteractionEventInterface;
    abstract get DOMEvent():Event;
    abstract preventDefault():void;
    abstract elementIsTarget(event:AReceivesInteractionsInterface):boolean;
    abstract get eventIsOnTarget():boolean;
    abstract get positionInContext():Vec2|null;
    abstract get cursorPosition():Vec2|null;
    abstract get cursorPositionCenterOrigin():Vec2|null;
    abstract get ndcCursor():Vec2|null;
    // abstract get targetModel():AModelInterface;
    abstract get shiftKey():boolean;
    abstract get altKey():boolean;
    abstract get ctrlKey():boolean;
    abstract get onFirstIntersection():boolean;
    abstract get key():string;
}

export class AMockInteractionEvent extends AInteractionEvent{
    public _cursorPosition:Vec2;
    _shiftKey:boolean;
    _altKey:boolean;
    _ctrlKey:boolean;
    _key:string;
    static GetMockElement(){
        return {
            addEventListener:(eventType:string, callback:(event:any)=>any, ...args:any[])=>{return;},
            removeEventListener:(eventType:string, callback:(event:any)=>any, ...args:any[])=>{}
        }
    }
    get onFirstIntersection(){return true;}
    public _event!:InteractionEventInterface;
    constructor(interaction:AInteraction, cursorPosition:Vec2, shiftKey:boolean=false, altKey:boolean=false, ctrlKey:boolean=false, event?:InteractionEventInterface){
        super();
        this._event = (event as InteractionEventInterface);
        if(!this._event){
            this._event = new PointerEvent(PointerEvents.POINTER_MOVE);
            //new Event();
        }
        this._key = '';
        this.interaction=interaction;
        this._cursorPosition = cursorPosition;
        this._shiftKey = shiftKey;
        this._altKey = altKey;
        this._ctrlKey=ctrlKey;
    }
    get key(){return this._key;}
    get DOMEvent(){return this._event;}
    preventDefault(){}
    elementIsTarget(event:AReceivesInteractionsInterface){return true;};
    get eventIsOnTarget(){return true;}
    get positionInContext() {return this._cursorPosition;};
    get cursorPosition(){return this._cursorPosition;};
    get cursorPositionCenterOrigin(){
        console.warn("Cursor position center origin not implemented in mock events")
        return this._cursorPosition;
    }
    get ndcCursor(){
        console.warn("NDC Cursor position not implemented in mock events")
        return this._cursorPosition;
    }

    // get targetModel(){
    //     return (this.interaction.owner as ASceneNodeController<any>).sceneController.model;
    // }
    get shiftKey(){return this._shiftKey};
    get altKey(){return this._altKey;};
    get ctrlKey(){return this._ctrlKey;}
}


export class ADOMInteractionEvent extends AInteractionEvent{
    public _event:InteractionEventInterface;
    constructor(event:InteractionEventInterface, interaction:AInteraction){
        super();
        this._event = event;
        this.interaction=interaction;
    }
    get onFirstIntersection(){return true;}
    get DOMEvent() {
        return this._event;
    }
    get shiftKey(){
        return (this._event as PointerEvent).shiftKey;
    }
    get altKey(){
        return (this._event as PointerEvent).altKey;
    }
    get ctrlKey(){
        return (this._event as PointerEvent).ctrlKey;
    }

    preventDefault(){
        this._event.preventDefault();
    }
    elementIsTarget(element:AReceivesInteractionsInterface){
        return this._event.target===element;
    }
    get positionInContext(){
        const contextElement = this.interaction.owner.eventTarget;
        if(contextElement instanceof Element) {
            const svgrect = contextElement.getBoundingClientRect();
            // @ts-ignore
            return new Vec2(this._event.clientX-svgrect.left, this._event.clientY-svgrect.top);
        }
        else return null;

    }
    get cursorPosition(){
        return this.positionInContext;
    }

    get cursorPositionCenterOrigin(){
        const contextElement = this.interaction.owner.eventTarget;
        if(contextElement instanceof HTMLElement) {
            const contextRect = contextElement.getBoundingClientRect();
            let midpoint = V2(contextRect.right - contextRect.left, contextRect.bottom - contextRect.top).times(0.5);
            // @ts-ignore
            return new Vec2(this._event.clientX - contextRect.left - midpoint.x, contextRect.top - this._event.clientY + midpoint.y
            );
        }else{
            return null;
        }
    }

    get ndcCursor(){
        const contextElement = this.interaction.owner.eventTarget;
        if(contextElement instanceof HTMLElement) {
            const contextRect = contextElement.getBoundingClientRect();
            let contextw = contextRect.right - contextRect.left;
            let contexth = contextRect.bottom - contextRect.top;
            let midpoint = V2(contextw*0.5, contexth*0.5);
            // @ts-ignore
            let cunnormalized = new Vec2(this._event.clientX - contextRect.left - midpoint.x, contextRect.top - this._event.clientY + midpoint.y
            );
            return new Vec2(cunnormalized.x/contextw, cunnormalized.y/contexth);
        }else{
            return null;
        }
    }
    // get targetModel(){
    //     return (this.interaction.owner as ASceneNodeController<any>).sceneController.model;
    // }
    get eventIsOnTarget(){
        return this._event.target===this._event.currentTarget;
    }

    get key(){
        return (this.DOMEvent as KeyboardEvent).key;
    }
}


export class AInteraction extends ACallbackSwitch {
    public interactionState:{[name:string]:any}={};
    setInteractionState(name:string, value:any){
        this.interactionState[name]=value;
    }
    getInteractionState(name:string){
        return this.interactionState[name];
    }
    clearInteractionState(){
        this.interactionState={};
    }
    protected _eventListeners:AInteractionEventListener[];

    /**
     * `owner` is whatever holds the interactions.
     * @type {HasInteractions}
     */
    public owner!: HasInteractions;
    /**
     * `element` is typically the thing being interacted with. For example, if you are adding a click interaction to a THREE.Mesh, then the element would be the THREE.Mesh.
     * @type {any}
     */
    // public element: AReceivesInteractionsInterface;
    public element:AReceivesInteractionsInterface;

    public onlyOnFirstIntersection:boolean=true;

    _shouldIgnoreEvent(event:Event|AInteractionEvent){
            return false;
    }

    // static Create(element:any, clickCallback?:CallbackType, handle?:string, ...args:any[]);

    getWindowElement(){
        return window;
    }

    // getSceneElement(){
    //     // return this.owner.sceneController.view._backgroundElement;
    //     if(!('sceneController' in this.owner)){throw new Error("Tried to get scene element on controller class without a sceneController property...");}
    //     // return (this.owner as ASceneNodeController<any>).sceneController.view.backgroundThreeJSObject;
    //     return this.owner.sceneController.view.threejs;
    // }

    /**
     * Event listeners is a list of event listeners associated with the interaction. Often this may just be a single event listener, but in the case of, for example, dragging, it may contain multiple event listeners.
     * And event listener is one call of [...].on(...).
     * @type {any[]}
     * @private
     */
    /** Get eventListeners */
    get eventListeners(){return this._eventListeners;};

    /**
     *
     * @param element
     * @param eventListeners
     * @param onlyMouseDownOnTarget - should this trigger only when the element is the target of the interaction. Defaults to true.
     * @param handle
     */
    constructor(element:AReceivesInteractionsInterface, eventListeners?:AInteractionEventListener[], handle?:string){
        super(handle);
        this.element = element;
        this._eventListeners = eventListeners?eventListeners:[];
    }

    bindMethods(){

    }

    addEventListener(eventType:string, callback:(...args:any[])=>any){
        const interaction = this;
        // const modcallbackmock = function(event:AInteractionEvent){
        //     callback(event);
        // }
        const modcallback = function(event:Event){
            if(!interaction._shouldIgnoreEvent(event)) {
                callback(new ADOMInteractionEvent(event, interaction));
            }
        }
        function addListener(this:AInteractionEventListener){
            interaction.element.addEventListener(eventType, modcallback);
        }

        function removeListener(this:AInteractionEventListener){
            interaction.element.removeEventListener(eventType, modcallback);
        }
        const eventListener = {eventType:eventType, addListener: addListener, removeListener: removeListener};
        eventListener.addListener = eventListener.addListener.bind(eventListener);
        eventListener.removeListener = eventListener.removeListener.bind(eventListener)
        this.eventListeners.push(eventListener);
        return eventListener;
    }

    addDOMEventListener(eventType: string, callback: (...args: any[]) => any, options?: boolean | AddEventListenerOptions){
        const interaction = this;
        // @ts-ignore
        const once:boolean = ((options!==undefined) && ((typeof options)!=="boolean"))?options.once:false;
        // @ts-ignore
        const capture:boolean = ((options!==undefined) && ((typeof options)!=="boolean"))?options.capture:false;

        let modcallback = function(event:InteractionEventInterface){
            // if(!interaction._shouldIgnoreEvent(event)) {
                callback(new ADOMInteractionEvent(event, interaction));
            // }
        }
        function addListener(){
            // this.active = true;
            // @ts-ignore
            interaction.element.addEventListener(eventType, modcallback, {once:once, capture:capture});
        }
        function removeListener(){
            // this.active=false;
            // @ts-ignore
            interaction.element.removeEventListener(eventType, modcallback, {once:once, capture:capture});
        }
        const eventListener = {eventType:eventType, addListener: addListener, removeListener: removeListener};
        eventListener.addListener = eventListener.addListener.bind(eventListener);
        eventListener.removeListener = eventListener.removeListener.bind(eventListener)
        this.eventListeners.push(eventListener);
        return eventListener;
    };


    activate() {
        // if(!this.isActive) {
        this.deactivate();
        for (let eventListener of this.eventListeners) {
            eventListener.addListener();
        }
        this.active = true;
        // }
    }

    _deactivateEventListeners() {
        for (let eventListener of this.eventListeners) {
            eventListener.removeListener();
        }
    }

    clearEventListeners() {
        this._deactivateEventListeners();
        this._eventListeners = [];
    }

    deactivate() {
        // if(this.isActive){
        this._deactivateEventListeners();
        this.active = false;
        // }
    }

    dispose() {
        this.deactivate();
        this._eventListeners = [];
        // super.dispose();
    }
}

import {AModel} from "./AModel";
import {AObjectNode} from "../aobject";
import {AClock} from "../../time/AClock";
import {AInteraction, AInteractionMode, AInteractionModeMap, BasicInteractionModes} from "../interaction";
import {CallbackType} from "../basictypes";
import {BezierTween} from "../../math";
import {ARenderDelegate} from "../../rendering";
import { v4 as uuidv4 } from "uuid";
import {HasInteractions} from "./HasInteractions";

export interface AControllerInterface{
    sceneController:ARenderDelegate;
    get eventTarget():HTMLElement;
}

export interface SceneControllerInterface extends ARenderDelegate, AControllerInterface{
}

export abstract class AController extends AObjectNode implements AControllerInterface, HasInteractions{
    protected _model!:AModel;
    protected _clock: AClock;
    abstract get sceneController():SceneControllerInterface;
    abstract get eventTarget():HTMLElement;

    /**
     * Interaction mode map. Has a .modes property that maps mode names to AInteractionModes.
     * @type {AInteractionModeMap}
     * @protected
     */
    protected _interactions!: AInteractionModeMap;
    /**
     * Right now, controllers are restricted to having one or zero active modes at a time. The name of the current mode, which can be active or inactive, is stored here.
     * @type {string}
     * @protected
     */
    protected _currentInteractionModeName: string;


    /**
     * Getter for the current interaction mode.
     * @returns {AInteractionMode}
     */
    get interactionMode() {
        return this._interactions.modes[this._currentInteractionModeName];
    }

    constructor() {
        super();
        this._clock = new AClock();
        this._clock.play();
        this._interactions = new AInteractionModeMap(this);
        this._currentInteractionModeName = BasicInteractionModes.Default;
    }

    getContextDOMElement(){
        return this.sceneController.renderWindow.contextElement;
    }

    /**
     * Add an interaction to the current mode.
     * @param interaction
     */
    addInteraction(interaction: AInteraction) {
        this.interactionMode.addInteraction(interaction);
        // interaction.owner = this;
        return interaction;
    }

    activateInteractions() {
        this.interactionMode.activate();
    }

    setCurrentInteractionMode(name?: string) {
        this.interactionMode.deactivate();
        let activeMode = name ? name : BasicInteractionModes.Default;
        this._interactions.setActiveMode(activeMode);
        this._currentInteractionModeName = activeMode;
    }

    defineInteractionMode(name: string, mode?: AInteractionMode) {
        this._interactions.defineMode(name, mode);
    }

    clearInteractionMode(name: string) {
        this._interactions.undefineMode(name)
    }

    isInteractionModeDefined(name: string):boolean {
        return this._interactions.modeIsDefined(name);
    }


    /**
     * If you provide a handle, then the action will not call so long as an existing subscription by that handle exists.
     * This means that you won't duplicate the action before one has finished previously.
     * @param callback
     * @param duration
     * @param tween
     * @param actionOverCallback
     * @param handle
     */
    addTimedAction(callback: (actionProgress: number) => any, duration: number, actionOverCallback?: CallbackType, tween?: BezierTween, handle?: string) {
        if (handle && (handle in this._subscriptions)) {
            return;
        }
        const self = this;
        const subscriptionHandle = handle ?? uuidv4();
        this.subscribe(this._clock.CreateTimedAction(callback, duration, () => {
                self.unsubscribe(subscriptionHandle);
                if (actionOverCallback) {
                    actionOverCallback();
                }
            }, tween),
            subscriptionHandle);
    }

    release(...args: undefined[]) {
        this.dispose();
        super.release(...args);
    }

    dispose() {
        this._interactions.dispose();
    }
}

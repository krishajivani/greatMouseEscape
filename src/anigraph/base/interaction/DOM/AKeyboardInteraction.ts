import {AInteraction, AInteractionEvent, AInteractionEventListener,} from "../AInteraction";
import {CallbackType} from "../../basictypes";

export type AKeyboardInteractionCallback = (event: any, interaction: AKeyboardInteraction) => any;

export class AKeyboardInteraction extends AInteraction {
    public keyDownCallback!: AKeyboardInteractionCallback;
    public keyUpCallback!: AKeyboardInteractionCallback;
    public _keyDownEventListener!: AInteractionEventListener | undefined;
    public _keyUpEventListener!: AInteractionEventListener | undefined;
    public keysDownState: { [name: string]: boolean } = {};
    /**
     * including once and capture https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @type {{[p: string]: any}}
     */
    public eventListenerOptions: { [name: string]: any } = {}

    clearKeyState() {
        this.keysDownState = {};
    }

    setEventListenerOptions(options?: { [name: string]: any }) {
        if (options) {
            this.eventListenerOptions = options;
        }
    }

    setKeyDownCallback(keyDownCallback: CallbackType) {
        this.keyDownCallback = keyDownCallback;
        if (this.active) {
            this.updateListeners();
        }
    }

    setKeyUpCallback(keyUpCallback: CallbackType) {
        this.keyUpCallback = keyUpCallback;
        if (this.active) {
            this.updateListeners();
        }
    }

    _processKeyDownEvent(event: AInteractionEvent) {
        this.keysDownState[(event.DOMEvent as KeyboardEvent).key] = true;
    }

    _processKeyUpEvent(event: AInteractionEvent) {
        this.keysDownState[(event.DOMEvent as KeyboardEvent).key] = false;
    }

    updateListeners() {
        this._removeKeyListeners();
        const interaction = this;

        function keyDownCallback(event: AInteractionEvent) {
            event.preventDefault();
            interaction._processKeyDownEvent(event);
            interaction.keyDownCallback(event, interaction);
        }

        function keyUpCallback(event: AInteractionEvent) {
            event.preventDefault();
            interaction._processKeyUpEvent(event);
            interaction.keyUpCallback(event, interaction);
        }

        // @ts-ignore
        if (interaction.keyDownCallback) {
            interaction._keyDownEventListener = interaction.addDOMEventListener('keydown', keyDownCallback, this.eventListenerOptions);
        }
        // @ts-ignore
        if (interaction.keyUpCallback) {
            interaction._keyUpEventListener = interaction.addDOMEventListener('keyup', keyUpCallback, this.eventListenerOptions);
        }
    }

    _removeKeyListeners() {
        this._keyDownEventListener = undefined;
        this._keyUpEventListener = undefined;
        this.clearEventListeners();
    }

    activate() {
        this.updateListeners();
        this._keyDownEventListener?.addListener();
        this._keyUpEventListener?.addListener();
        this.active = true;
    }

    static Create(element: any, keyDownCallback?: CallbackType, keyUpCallback?: CallbackType, options?: { [name: string]: any }, handle?: string, ...args: any[]) {
        let host = element;
        if(element.ownerDocument){
            host = element.ownerDocument;
        }
        const interaction = new this(host, undefined, handle);
        interaction.setEventListenerOptions(options);
        if (keyDownCallback) {
            interaction.setKeyDownCallback(keyDownCallback);
        }
        if (keyUpCallback) {
            interaction.setKeyUpCallback(keyUpCallback);
        }

        interaction.bindMethods();
        //Finally, return the interaction
        return interaction;
    }
}

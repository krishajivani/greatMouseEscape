import {ACallbackSwitch, AEventCallbackDict} from "../aevents";
import {v4 as uuidv4} from "uuid";

export class AHandlesEvents{
    protected _eventCallbackDicts: { [name: string]: AEventCallbackDict } = {};

    _getEventCallbackDict(eventName: string) {
        return this._eventCallbackDicts[eventName];
    }

    addEventListener(
        eventName: string,
        callback: (...args: any[]) => void,
        handle?: string
    ) {
        if (this._eventCallbackDicts[eventName] === undefined) {
            this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
        }
        return this._eventCallbackDicts[eventName].addCallback(callback, handle);
    }

    addEventListeners(
        eventName: string,
        callbacks: ((...args: any[]) => void)[],
        handle?: string
    ) {
        if (this._eventCallbackDicts[eventName] === undefined) {
            this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
        }
        return this._eventCallbackDicts[eventName].addCallback(callbacks, handle);
    }

    addOneTimeEventListener(
        eventName: string,
        callback: (...args: any[]) => void,
        handle?: string
    ) {
        if (this._eventCallbackDicts[eventName] === undefined) {
            this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
        }
        const self = this;
        handle = handle ? handle : (uuidv4() as string);
        function wrapped(...args: []) {
            callback(...args);
            self.removeEventListener(eventName, handle as string);
        }
        return this._eventCallbackDicts[eventName].addCallback(wrapped, handle);
    }

    removeEventListener(eventName: string, handle: string) {
        if (this._eventCallbackDicts[eventName] === undefined) {
            return;
        }
        return this._eventCallbackDicts[eventName].removeCallback(handle);
    }

    signalEvent(eventName: string, ...args: any[]) {
        if (this._eventCallbackDicts[eventName] === undefined) {
            this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
        }
        this._getEventCallbackDict(eventName).signalEvent(...args);
    }
    //</editor-fold>
    //##################\\--ASignalsEvents--//##################

    //##################//--ASubscribesToEvents--\\##################
    //<editor-fold desc="ASubscribesToEvents">
    protected _subscriptions: { [name: string]: ACallbackSwitch } = {};
    public subscribe(callbackSwitch: ACallbackSwitch, name?: string) {
        name = name ? name : uuidv4();
        if (name in this._subscriptions) {
            if (this._subscriptions[name].active) {
                this._subscriptions[name].deactivate();
                console.warn(
                    `Re-Subscribing to "${name}", which already has a subscription!`
                );
            }
        }
        this._subscriptions[name] = callbackSwitch;
    }

    public unsubscribe(name: string, errorIfAbsent: boolean = true) {
        if (name in this._subscriptions) {
            if (this._subscriptions[name].active) {
                this._subscriptions[name].deactivate();
            }
            delete this._subscriptions[name];
        } else if (errorIfAbsent) {
            // select both, drag on one, and release with shift then click again
            throw new Error(
                `tried to remove subscription "${name}", but no such subscription found in ${this}`
            );
        }
    }

    clearSubscriptions() {
        for (let name in this._subscriptions) {
            this.unsubscribe(name);
        }
    }

    deactivateSubscription(name: string) {
        if (name in this._subscriptions) {
            if (this._subscriptions[name].active) {
                this._subscriptions[name].deactivate();
            }
        } else {
            throw new Error(
                `tried to deactivate subscription "${name}", but no such subscription found in ${this}`
            );
        }
    }

    activateSubscription(name: string) {
        if (name in this._subscriptions) {
            if (!this._subscriptions[name].active) {
                this._subscriptions[name].activate();
            }
        } else {
            throw new Error(
                `tried to activate subscription "${name}", but no such subscription found in ${this}`
            );
        }
    }
    //</editor-fold>
    //##################\\--ASubscribesToEvents--//##################

}

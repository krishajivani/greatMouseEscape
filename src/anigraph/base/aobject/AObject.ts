import { proxy, ref, snapshot, subscribe } from "valtio/vanilla";
import { subscribeKey } from "valtio/utils";
import { v4 as uuidv4 } from "uuid";
import { ASerializable } from "../aserial/ASerializable";
import { ACallbackSwitch } from "../aevents/ACallbackSwitch";
import { AEventCallbackDict } from "../aevents/AEventCallbackDict";
import { GenericDict } from "../basictypes";
import {AHandlesEvents} from "./AHandlesEvents";
import {AppStateValueChangeCallback, GetAAppStateBase} from "../../scene/AAppState";

class AStateCallbackSwitch extends ACallbackSwitch {
  public callback: (...args: any[]) => any;
  public owner: AObject;
  public synchronous: boolean;
  public state_name: string | null;
  public _unsubscribe_proxy: any = null;
  constructor(
    owner: AObject,
    handle: string,
    callback: (...args: any[]) => any,
    synchronous: boolean = true,
    state_name: string | null = null
  ) {
    super(handle);
    this.callback = callback;
    this.owner = owner;
    this.synchronous = synchronous;
    this.state_name = state_name;
  }

  activate() {
    this.owner._getListeners()[this.handle] = this;
    if (this.state_name) {
      this._unsubscribe_proxy = subscribeKey(
        this.owner.state,
        this.state_name,
        () => {
          return this.callback(this.owner);
        },
        this.synchronous
      );
    } else {
      this._unsubscribe_proxy = subscribe(
        this.owner.state,
        () => {
          return this.callback(this.owner);
        },
        this.synchronous
      );
    }
    this.active = true;
  }
  deactivate() {
    this.owner.removeListener(this.handle);
    this.active = false;
  }
}

/**
 * # AObjectState Decorator
 * The `@AObjectState` decorator and AObjectState
 * The @AObjectState decorator lets you declare state variables on a class that extends AObject (as is the case
 * here, because A2DSceneNode already extends AObject). AObjectState variables are tracked in a special way so that
 * other code can listen for changes to those variables. This will let us, for example, specify a callback function
 * to be executed whenever a particular AObjectState variable is changed. In this assignment, clicking and dragging
 * a point or a line will cause its coordinates to change. Our view of said point/line will listen for changes to
 * this state so that we can keep our visualization (graphics) up to date.
 * Side Note: for the curious, the state variables for each AObject are stored in what's called a `proxy`. More
 * specifically, AniGraph uses a [valtio proxy](https://github.com/pmndrs/valtio) proxt under the hood.
 *
 * ### Limitations:
 * - You cannot call on templated members
 * - no inline value initialization (it will be ignored), you need to either initialize in constructor or use ! in declaration
 *
 * @param target
 * @param propertyKey
 * @return {any}
 */
export function AObjectState(target: any, propertyKey: any) {
  // if (target.constructor.AObjectStateKeys.includes(propertyKey)) {
  //     throw new Error(`class ${target.constructor.name} already contains AObjectState with key ${propertyKey}`);
  // }
  target.constructor.AObjectStateKeys.push(propertyKey);
  Object.defineProperty(target, propertyKey, {
    get: function () {
      return this.state[propertyKey];
      // return valuesByInstance.get(this);
    },
    set: function (value) {
      this.state[propertyKey] = value;
      // valuesByInstance.set(this, value);
    },
  });
  return target;
}

export function AObjectStateRef(target: any, propertyKey: any) {
  target.constructor.AObjectStateKeys.push(propertyKey);

  Object.defineProperty(target, propertyKey, {
    get: function () {
      return this.state[propertyKey];
      // return valuesByInstance.get(this);
    },
    set: function (value) {
      this.state[propertyKey] = ref(value);
      // valuesByInstance.set(this, value);
    },
  });
  return target;
}

@ASerializable("AObject")
export class AObject extends AHandlesEvents{
  static SerializationLabel() {
    if (this.hasOwnProperty("_serializationLabel")) {
      // @ts-ignore
      return this._serializationLabel;
    } else {
      return this.name;
    }
  }
  //Base class, gets uid for reference saving
  static AObjectStateKeys: string[] = [];
  // public _stateObject:{[name:string]:any}={AObjectVersion:1.0};
  static AObjectVersion: number = 1;
  public state: { [name: string]: any } = {};
  // public tempState:{[name:string]:any}={};
  private listeners: { [handle: string]: AStateCallbackSwitch } = {};
  @AObjectState uid!: string;
  // @AObjectState AObjectVersion!:string;

  _aobjectInfo: GenericDict = {};
  getInfo(name: string) {
    return this._aobjectInfo[name];
  }
  setInfo(name: string, value: any) {
    this._aobjectInfo[name] = value;
  }

  get ClassConstructor() {
    return this.constructor as typeof AObject;
  }

  get serializationLabel() {
    // @ts-ignore
    return this.constructor._serializationLabel;
  }

  get stateSnapshop() {
    return snapshot(this.state);
  }

  // get useSnapshot(){
  //
  // }

  constructor();
  constructor(uid:string);
  constructor(...args: Array<any>){
    super();
    this.state = proxy({});
    if(args.length>0){
      this.uid = args[0];
    }else{
      this.uid = uuidv4();
    }
  }

    release(){
        this.clearSubscriptions();
        // if(Object.keys(this._eventCallbackDicts).length>0) {
        //     for (let k in this._eventCallbackDicts) {
        //         // console.log(this._eventCallbackDicts[k]);
        //         this._eventCallbackDicts[k]
        //     }
        //     // console.warn(`disposing object ${this} with the above event listeners still listening...`)
        // }
    };

  static CreateWithState(state: { [name: string]: any }) {
    let newObj = new this();
    for (let key in state) {
      // @ts-ignore
      newObj[key] = state[key];
    }
    return newObj;
  }

  removeListener(handle: string) {
    this.listeners[handle]._unsubscribe_proxy();
    delete this.listeners[handle];
  }

  _getListeners() {
    return this.listeners;
  }

  toJSON() {
    return snapshot(this.state);
  }

  static fromJSON(state_dict: { [name: string]: any }) {
    return this.CreateWithState(state_dict);
  }

  // ASerialize(ref_map?:{[id:string]:ASerializableClass}){
  //     var rstate:{[name:string]:any} = {};
  //     for (let key in this.state){
  //         rstate[key]=GetIndexedCopy(this.state[key], ref_map);
  //     }
  // }

  /**
   * Sets a callback function to be called whenever the state specified in state_key changes.
   * The return value callbackSwitch is a callback switch. You can activate the listener with callbackSwitch.activate()
   * and deactive with callbackSwitch.deactivate().
   * Example Usage:
   * ```typescript
   * var callbackswitch = model.addStateKeyListener('name',()=>{
   *      n_name_changes = n_name_changes+1;
   * })
   * ```
   * @param state_key - the name of the state to listen to
   * @param callback - the callback to be executed when state changes
   * @param handle - the handle / unique identifier for
   * @param synchronous - whether callbacks should happen synchronously or allow for batching
   */
  addStateKeyListener(
    state_key: string,
    callback: (self: AObject) => void,
    handle?: string,
    synchronous: boolean = true
  ) {
    var h: string = handle ? handle : (uuidv4() as string);
    const object = this;
    const callbackSwitch = new AStateCallbackSwitch(
      object,
      h,
      callback,
      synchronous,
      state_key
    );
    callbackSwitch.activate();
    return callbackSwitch;
  }

  addStateListener(
    callback: (self: AObject) => void,
    handle?: string,
    synchronous: boolean = true
  ) {
    var h: string = handle ? handle : (uuidv4() as string);
    const object = this;
    const callbackSwitch = new AStateCallbackSwitch(
      object,
      h,
      callback,
      synchronous
    );
    callbackSwitch.activate();
    return callbackSwitch;
  }

  subscribeToAppState(key:string, callback:AppStateValueChangeCallback, subscriptionKey?:string) {
    let appState = GetAAppStateBase();
    this.subscribe(
        appState.addStateValueListener(key, callback), subscriptionKey
    )
  }

  //##################//--ASignalsEvents--\\##################
  //<editor-fold desc="ASignalsEvents">
  // protected _eventCallbackDicts: { [name: string]: AEventCallbackDict } = {};
  //
  // _getEventCallbackDict(eventName: string) {
  //   return this._eventCallbackDicts[eventName];
  // }
  //
  // addEventListener(
  //   eventName: string,
  //   callback: (...args: any[]) => void,
  //   handle?: string
  // ) {
  //   if (this._eventCallbackDicts[eventName] === undefined) {
  //     this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
  //   }
  //   return this._eventCallbackDicts[eventName].addCallback(callback, handle);
  // }
  //
  // addEventListeners(
  //   eventName: string,
  //   callbacks: ((...args: any[]) => void)[],
  //   handle?: string
  // ) {
  //   if (this._eventCallbackDicts[eventName] === undefined) {
  //     this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
  //   }
  //   return this._eventCallbackDicts[eventName].addCallback(callbacks, handle);
  // }
  //
  // addOneTimeEventListener(
  //   eventName: string,
  //   callback: (...args: any[]) => void,
  //   handle?: string
  // ) {
  //   if (this._eventCallbackDicts[eventName] === undefined) {
  //     this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
  //   }
  //   const self = this;
  //   handle = handle ? handle : (uuidv4() as string);
  //   function wrapped(...args: []) {
  //     callback(...args);
  //     self.removeEventListener(eventName, handle as string);
  //   }
  //   return this._eventCallbackDicts[eventName].addCallback(wrapped, handle);
  // }
  //
  // removeEventListener(eventName: string, handle: string) {
  //   if (this._eventCallbackDicts[eventName] === undefined) {
  //     return;
  //   }
  //   return this._eventCallbackDicts[eventName].removeCallback(handle);
  // }
  //
  // signalEvent(eventName: string, ...args: any[]) {
  //   if (this._eventCallbackDicts[eventName] === undefined) {
  //     this._eventCallbackDicts[eventName] = new AEventCallbackDict(eventName);
  //   }
  //   this._getEventCallbackDict(eventName).signalEvent(...args);
  // }
  // //</editor-fold>
  // //##################\\--ASignalsEvents--//##################
  //
  // //##################//--ASubscribesToEvents--\\##################
  // //<editor-fold desc="ASubscribesToEvents">
  // protected _subscriptions: { [name: string]: ACallbackSwitch } = {};
  // public subscribe(callbackSwitch: ACallbackSwitch, name?: string) {
  //   name = name ? name : uuidv4();
  //   if (name in this._subscriptions) {
  //     if (this._subscriptions[name].active) {
  //       this._subscriptions[name].deactivate();
  //       console.warn(
  //         `Re-Subscribing to "${name}", which already has a subscription!`
  //       );
  //     }
  //   }
  //   this._subscriptions[name] = callbackSwitch;
  // }
  //
  // public unsubscribe(name: string, errorIfAbsent: boolean = true) {
  //   if (name in this._subscriptions) {
  //     if (this._subscriptions[name].active) {
  //       this._subscriptions[name].deactivate();
  //     }
  //     delete this._subscriptions[name];
  //   } else if (errorIfAbsent) {
  //     // select both, drag on one, and release with shift then click again
  //     throw new Error(
  //       `tried to remove subscription "${name}", but no such subscription found in ${this}`
  //     );
  //   }
  // }
  //
  // clearSubscriptions() {
  //   for (let name in this._subscriptions) {
  //     this.unsubscribe(name);
  //   }
  // }
  //
  // deactivateSubscription(name: string) {
  //   if (name in this._subscriptions) {
  //     if (this._subscriptions[name].active) {
  //       this._subscriptions[name].deactivate();
  //     }
  //   } else {
  //     throw new Error(
  //       `tried to deactivate subscription "${name}", but no such subscription found in ${this}`
  //     );
  //   }
  // }
  //
  // activateSubscription(name: string) {
  //   if (name in this._subscriptions) {
  //     if (!this._subscriptions[name].active) {
  //       this._subscriptions[name].activate();
  //     }
  //   } else {
  //     throw new Error(
  //       `tried to activate subscription "${name}", but no such subscription found in ${this}`
  //     );
  //   }
  // }
  //</editor-fold>
  //##################\\--ASubscribesToEvents--//##################
}

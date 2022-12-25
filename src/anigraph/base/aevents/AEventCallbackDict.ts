import { v4 as uuidv4 } from "uuid";
import { ACallbackSwitch } from "./ACallbackSwitch";

export class AEventCallbackSwitch extends ACallbackSwitch {
  public callback: ((...args: any[]) => any) | ((...args: any[]) => any)[];
  public owner: AEventCallbackDict;
  constructor(
    owner: AEventCallbackDict,
    handle: string,
    callback: ((...args: any[]) => any) | ((...args: any[]) => any)[]
  ) {
    super(handle);
    this.callback = callback;
    this.owner = owner;
  }
  activate() {
    this.owner.callbacks[this.handle] = this;
    this.active = true;
  }
  deactivate() {
    this.owner.removeCallback(this.handle);
    this.active = false; // the this variable here will refer the callbackSwitch
  }
}

type CallbacksDictType = { [handle: string]: AEventCallbackSwitch };

export class AEventCallbackDict {
  public name: string;
  public callbacks: CallbacksDictType = {};
  /**
   * Event callback dictionary. When you add a callback, it returns a switch.
   * If you call switch.activate() then the callback is added to the Dict.
   * if you call switch.deactivate() then the callback is removed.
   * deactivating it removes the record of it from the dictionary, so there is no pointer left
   * behind in the dictionary.
   *
   * @param args
   */
  constructor(name?: string, callbacks?: CallbacksDictType) {
    this.name = name ? name : "";
    if (callbacks !== undefined) {
      this.callbacks = callbacks;
    }
  }

  /**
   * Adds the callback and returns a callback switch, which can call activate() and deactivate() to enable/disable the callback.
   * @param callback
   * @returns Callback switch {{activate: activate, active: boolean, handle: string, deactivate: deactivate}}
   */
  addCallback(
    callback: ((...args: any[]) => void)[] | ((...args: any[]) => void),
    handle?: string
  ) {
    if (handle === undefined) {
            handle = (uuidv4() as string);
    }
    const callbackSwitch = new AEventCallbackSwitch(this, handle, callback);
    callbackSwitch.activate();
    // // this.callbacks[handle] = callback;
    // const event = this;
    // const callbackSwitch = {
    //     callback:callback,
    //     handle: handle,
    //     active: false,
    //     deactivate: function(){
    //         event.removeCallback((handle as string));
    //         this.active = false; // the this variable here will refer the callbackSwitch
    //     },
    //     owner:event,
    //     activate: function(){
    //         event.callbacks[(handle as string)] = this;
    //         this.active = true;
    //     },
    // }
    // callbackSwitch.activate();
    return callbackSwitch;
  }

  removeCallback(handle: string) {
    delete this.callbacks[handle];
  }

  getCallbackList() {
    const callbacks = this.callbacks;
        return Object.keys(callbacks).map(function(k){return callbacks[k]});
  }

  signalEvent(...args: any[]) {
    const callbackList = this.getCallbackList();
    for (let c of callbackList) {
            if(Array.isArray(c['callback'])){
                for(let cb of c['callback']){
          cb.call(null, ...args);
        }
      } else {
        c["callback"].call(null, ...args);
      }
    }
  }
}

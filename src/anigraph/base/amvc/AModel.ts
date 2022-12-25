import {ASerializable} from "../aserial";
// import {ACallbackSwitch} from "../aevents";
import {AObjectState, AObjectNode} from "../aobject";
import {AppStateValueChangeCallback, GetAAppStateBase} from "../../scene/AAppState";
import {CallbackType} from "../basictypes";

export interface AModelInterface extends AObjectNode {
    uid: string;
    name: string;
    parent: AObjectNode | null;
    serializationLabel: string;
    // addEventListener(eventName:string, callback:(...args:any[])=>void, handle?:string):ACallbackSwitch;
}

enum AModelEvents {
    RELEASE = 'RELEASE'
}

@ASerializable("AModel")
export abstract class AModel extends AObjectNode implements AModelInterface {
    @AObjectState public name!: string;
    static AModelEvents = AModelEvents;

    constructor(name?: string) {
        super();
        this.name = name ? name : this.serializationLabel;
    }

    release() {
        super.release();
        this.signalEvent(AModel.AModelEvents.RELEASE);
    }



}

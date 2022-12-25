import {AObject} from "../aobject";
import objectHash from "object-hash";

export class AMockInteractiveElement extends AObject{
    on(type:string, fn:(...args:any[])=>void) {
        let hash = objectHash({type:type,fn:fn});
        this.addEventListener(type, fn, hash);
    }
    off(type:string, fn:(...args:any[])=>void) {
        let hash = objectHash({type:type,fn:fn});
        this.removeEventListener(type, hash);
    };
    once(type:string, fn:(...args:any[])=>void) {
        let hash = objectHash({type:type,fn:fn});
        this.addOneTimeEventListener(type, fn, hash);
    };
}

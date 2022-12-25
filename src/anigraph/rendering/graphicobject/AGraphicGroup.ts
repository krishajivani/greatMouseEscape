import * as THREE from "three";
import {AGraphicObject} from "./AGraphicObject";
import {ASerializable} from "../../base";


@ASerializable("AGraphicGroup")
export class AGraphicGroup extends AGraphicObject{
    protected _threejs:THREE.Object3D;

    get threejs(){
        return this._threejs;
    }
    protected members:AGraphicObject[]=[];
    constructor(threejsObject?:THREE.Object3D) {
        super();
        // this._threejs = new THREE.Group();
        if(threejsObject){
            this._threejs = threejsObject;
        }else{
            this._threejs = new THREE.Group();
        }
        this._threejs.matrixAutoUpdate=false;
        if(this.threejs){
            if(this.threejs.name ==""){
                this.setObject3DName(this.serializationLabel);
            }
        }
    }

    mapOverMembers(fn:(child:AGraphicObject)=>any[]|void){
        var rvals = [];
        for(let member of this.members){
            rvals.push(fn(member));
        }
        return rvals;
    }

    add(toAdd:AGraphicObject){
        this.members.push(toAdd);
        super.add(toAdd);
    }

    remove(toRemove:AGraphicObject){
        for(let c=0;c<this.members.length;c++){
            if(this.members[c].uid===toRemove.uid){
                this.members.splice(c,1);
                // this.onExit(toRemove);
                // this.threejs.remove(toRemove.threejs);
                super.remove(toRemove);
                return;
            }
        }
        throw new Error(`Tried to remove render object ${toRemove} that is not a member of ${this}`);
    }



    dispose() {
        this.mapOverMembers((m:AGraphicObject)=>{m.dispose();});
        super.dispose();
    }

}



// constructor() {
//     super();
//     this.members=new ASelection<AGraphicObject>(
//         [],
//         (o:AGraphicObject)=>{
//             this.threejs.add(o.threejs);
//         },
//         (o:AGraphicObject)=>{return;},
//         (o:AGraphicObject)=>{
//             this.threejs.remove(o.threejs);
//         }
//     );
// }
// dispose(){
//     super.dispose();
//     let memberList = this.members.items();
//     this.members.set();
//     for(let m of memberList){
//         m.dispose();
//     }
// }
//
// add(obj:AGraphicObject){
//     this.members.push(obj);
//     this.threejs.add(obj.threejs);
// }
//
// remove(obj:AGraphicObject){
//
// }

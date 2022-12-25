import {ANodeModel2D, AObject, ASerializable} from "../../../index";
import {AParticle} from "../../../index";

enum ParticleSystemEvents{
    PARTICLE_UPDATE="PARTICLE_UPDATE"
}

@ASerializable("ParticleSystemModelBase")
export abstract class ParticleSystemModelBase extends ANodeModel2D{
    protected _particles:AParticle[]=[];
    get particles():AParticle[]{return this._particles;};
    static Events = ParticleSystemEvents;
    signalParticleUpdate(){
        this.signalEvent(ParticleSystemModelBase.Events.PARTICLE_UPDATE);
    }
    addUpdateListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        return this.addEventListener(ParticleSystemModelBase.Events.PARTICLE_UPDATE, callback, handle);
    }

}



import {AGraphicGroup, AInstancedParticlesGraphic, ANodeView} from "../../../index";
import {ParticleSystemModelBase} from "./ParticleSystemModelBase";

export abstract class ParticleSystemViewBase extends ANodeView{
    group!:AGraphicGroup;
    get model():ParticleSystemModelBase{
        return this.model as ParticleSystemModelBase;
    }

    protected _particlesElement!:AInstancedParticlesGraphic;
    get particlesElement(){
        return this._particlesElement;
    }

    initGraphics(){
        this.group = new AGraphicGroup();
        this.initParticleGraphics();
    }


    update(){
        for(let p=0;p<this.model.particles.length;p++){
            this.particlesElement.setParticle(p, this.model.particles[p]);
        }
        this.particlesElement.setNeedsUpdate();
    }

    initParticleGraphics(){
        const self = this;
        this.subscribe(this.model.addStateKeyListener('nParticles', ()=>{
            self.updateNumParticles();
        }))
        this.subscribe(this.model.addStateKeyListener('time', ()=>{
            self.update();
        }))
    }

    updateNumParticles(){
    }

}

import * as THREE from "three";
import {
    AGraphicGroup,
    APolygon2DGraphic,
    Color,
} from "../../../index";

import {ANodeView} from "../../../scene/ANodeView";

import {BasicParticleGraphic} from "../../../rendering/graphicelements";
import {BasicParticleSystem2DModel} from "./BasicParticleSystem2DModel";
import {ParticleSystem2DModel} from "../../../../Creative1/C1/ExampleScenes/ParticleScene/particles";

export abstract class BasicParticleSystem2DView extends ANodeView{
    get particleTexture(){return "images/gradientParticleb.jpg"}
    particleGroup!:AGraphicGroup;
    get model():ParticleSystem2DModel{
        return this._model as ParticleSystem2DModel;
    }

    particleGraphics!: BasicParticleGraphic[];

    addParticleGraphic(p:BasicParticleGraphic){
        this.particleGraphics.push(p);
        this.particleGroup.add(p);
        this.registerGraphic(p);
    }

    createParticles(){
        this.disposeGraphics();
        this.particleGroup = new AGraphicGroup();
        this.particleGraphics = [];
        for(let p of this.model.particles){
            let newElement=new APolygon2DGraphic();
            newElement.init(
                this.model.getVertsForParticle(p),
                    new THREE.MeshBasicMaterial({
                        depthWrite: false,
                        transparent:true,
                        alphaMap: new THREE.TextureLoader().load(this.particleTexture),
                        color:Color.RandomRGBA().asThreeJS()
                    })
                );
            newElement.setTransform(this.model.getTransformForParticle(p));
            this.addParticleGraphic(newElement);
        }
        this.addGraphic(this.particleGroup);
    }



    updateParticles(){
        for(let i=0;i<this.model.particles.length;i++){
            this.particleGraphics[i].setTransform(this.model.getTransformForParticle(this.model.particles[i]));
            this.particleGraphics[i].setColor(this.model.getColorForParticle(this.model.particles[i]));
        }
        //TODO: This is the part that doesn't work :(( idk how to make it show the bullets
        for(let i=0;i<this.model.bullets.length;i++){
            this.particleGraphics[i].setTransform(this.model.getTransformForParticle(this.model.particles[i]));
            this.particleGraphics[i].setColor(this.model.getColorForParticle(this.model.particles[i]));
        }
    }

    init(): void {
        this.createParticles();
        this.update();
        const self = this;
        this.subscribe(this.model.addEventListener(BasicParticleSystem2DModel.Events.PARTICLE_UPDATE,()=>{
            self.updateParticles();
        }));
    }


    update(): void {
        this.setTransform(this.model.getWorldTransform().Mat4From2DH());
    }
}

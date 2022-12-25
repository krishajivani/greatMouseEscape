import {GetAppState} from "../../../Creative1AppState";
import {CreativeSceneModelBase} from "../../CreativeSceneModelBase";
import {Color, DefaultMaterials, Vec2} from "../../../../anigraph";
import {ParticleSystem2DModel} from "./particles/ParticleSystem2DModel";
import {ATexture} from "../../../../anigraph/rendering/ATexture";
import {PlayerModel} from "./Player";
let appState = GetAppState();



export class ParticleSystemSceneModel extends CreativeSceneModelBase {
    particleSystem!:ParticleSystem2DModel;
    princeTextures:ATexture[]=[];
    player!:PlayerModel;

    async PreloadAssets() {
        await super.PreloadAssets();
        await this.materials.loadShaderModel(DefaultMaterials.RGBA_SHADER)
        this.initCamera();

        this.princeTextures.push(await ATexture.LoadAsync(`./images/MouseFriend.png`))
        await this.loadShader('basicTexture');
    }

    initCamera() {
        this.initOrthographicCamera(this.sceneScale);
    }

    createPlayer() {
        this.player = new PlayerModel();
        this.player.setMaterial(this.materials.CreateMaterial('basicTexture'));
        this.player.material.setTexture('input', this.princeTextures[0]);
        this.player.zValue = 0.1;
        this.addChild(this.player);
    }

    initScene() {
        const self = this;
        this.createPlayer();
        /**
         * Add AppState controls here
         */
        appState.addSliderControl(ParticleSystem2DModel.AppStateKeys.ExampleParticleParam, 1, 1, 5, 0.01);
        this.subscribeToAppState(ParticleSystem2DModel.AppStateKeys.ExampleParticleParam,(v:number)=>{
            self.particleSystem.exampleParticleParam = v;
            self.particleSystem.signalParticleUpdate();
        })

        this.particleSystem = new ParticleSystem2DModel();
        this.particleSystem.init();
        this.addChild(this.particleSystem);
    }

    timeUpdate(t: number) {
        try {
            const self = this;
            // We are going to iterate over ALL of the particles.
            for(let p of this.particleSystem.particles){
                    // Test for intersection with the player
                if(this.player.isPlayerParticleCollision(p)) {
                    console.log("Player has collided with a particle, game over!!")
                    if (this.particleSystem.gameOn) {
                        const app = document.getElementById("app");
                        const p = document.createElement("h2");
                        p.textContent = "Score: " + Math.floor(t);
                        app?.appendChild(p);

                        this.particleSystem.gameOn = false;
                    }

                    break;
                }

            }
        }catch(e) {
            console.log("Oopsy daisy");
        }

        if (this.particleSystem.gameOn) {
            this.player.update(t);
            this.particleSystem.newTimeUpdate(t, this.player);
        }

    }
}

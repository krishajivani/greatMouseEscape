import * as THREE from "three";
import {AObject, AObjectState} from "../base";
import {ASerializable} from "../base";
import type {GenericDict} from "../base";
import {Color} from "../math";

// // http://stackoverflow.com/a/14855016/2207790
// var loadTextureHTTP = function (url, callback) {
//     require('request')({
//         method: 'GET', url: url, encoding: null
//     }, function(error, response, body) {
//         if(error) throw error;
//
//         var image = new Image;
//         image.src = body;
//
//         var texture = new THREE.Texture(image);
//         texture.needsUpdate = true;
//
//         if (callback) callback(texture);
//     });
// };

@ASerializable("ATexture")
export class ATexture extends AObject{
    @AObjectState name!:string;
    @AObjectState _url!:string;
    @AObjectState _texdata:GenericDict;
    public _threejs!:THREE.Texture;
    /** Get set threejs */
    set threejs(value:THREE.Texture){this._threejs = value;}
    get threejs(){return this._threejs;}

    get width():number{
        let w = this.getTexData('width');
        if(w!==undefined){
            return w;
        }else{
            return this.threejs.image.width;
        }
    }
    get height():number{
        let h = this.getTexData('height');
        if(h!==undefined){
            return h;
        }else{
            return this.threejs.image.height;
        }
    }

    static async LoadAsync(texturePath:string, name?:string){
        let threetexture = await new THREE.TextureLoader().loadAsync(texturePath,
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            });
        return new ATexture(threetexture, name);
    }

    constructor(texture?:string|THREE.Texture, name?:string, ...args:any[]) {
        super();
        this._texdata = {};
        if(texture) {
            if (texture instanceof THREE.Texture) {
                this._setTHREETexture(texture);
            } else {
                this.loadFromURL(texture as string);
            }
            // this.setWrapToRepeat();
        }
        if(name){
            this.name=name;
        }else{
            if(this.threejs instanceof THREE.Texture){
                this.name = this.threejs.name;
            }
        }

    }

    _setTHREETexture(tex:THREE.Texture){
        this.threejs=tex;
    }
    setTexData(key:string, value:any){
        this._texdata[key]=value;
    }
    getTexData(key:string){
        return this._texdata[key];
    }

    loadFromURL(url:string){
        this._url = url;
        this.threejs = new THREE.TextureLoader().load(this._url);
        this.setTexData('url', url);
    }

    setWrapToRepeat(repeats?:number|number[]){
        this.threejs.wrapS=THREE.RepeatWrapping;
        this.threejs.wrapT=THREE.RepeatWrapping;
        if(repeats!==undefined) {
            if (Array.isArray(repeats)) {
                this.threejs.repeat.set(repeats[0], repeats[1]);
            } else {
                this.threejs.repeat.set(repeats, repeats);
            }
        }
    }
    setWrapToClamp(){
        this.threejs.wrapS=THREE.ClampToEdgeWrapping;
        this.threejs.wrapT=THREE.ClampToEdgeWrapping;
    }


    setMinFilter(mode?:THREE.TextureFilter){
        if(mode){this.threejs.minFilter=mode;}
    }
    setMagFilter(mode?:THREE.TextureFilter){
        if(mode){this.threejs.minFilter=mode};
    }
}

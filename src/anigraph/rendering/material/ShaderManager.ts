import * as THREE from "three";
import {ASerializable, AObject, AObjectState} from "../../base";

export enum ShaderManagerEnums{
    SHADER_DIRECTORY_URL='shaders/',
    DEFAULT_SHADER='basic'
}


export class AShaderProgramSource extends AObject{
    public name: string;
    public vertexURL: string;
    public fragURL: string;
    @AObjectState vertexSource!: string;
    @AObjectState fragSource!: string;
    public sourcesLoadedPromise:Promise<this>;

    constructor(name: string, vertexURL: string, fragURL: string) {
        super();
        this.name = name;
        this.vertexURL = vertexURL;
        this.fragURL = fragURL;
        const self = this;
        async function loadSources(){
            self.vertexSource = (await AShaderProgramSource.LoadShaderFile(vertexURL)) as string;
            self.fragSource = (await AShaderProgramSource.LoadShaderFile(fragURL)) as string;
            return self;
        };
        this.sourcesLoadedPromise = loadSources();
        // this.sourcesLoadedPromise = new Promise(function (myResolve, myReject){
        //     self.vertexSource = (ShaderProgramSource.LoadShaderFile(vertexURL)) as string;
        //     self.fragSource = (ShaderProgramSource.LoadShaderFile(fragURL)) as string;
        //     myResolve();
        // });
        // this.sourcesLoadedPromise = loadSources();
    }

    static LoadShaderFile(sourceURL: string) {
        let shaderLoader = new THREE.FileLoader();
        let shaderSource = shaderLoader.loadAsync(
            sourceURL,
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            });
        return shaderSource;
    }
}

export type ShaderPromise = Promise<AShaderProgramSource>;

@ASerializable("ShaderSourceManager")
class AShaderSourceManager extends AObject{
    @AObjectState _shaderSources!:{[name:string]:AShaderProgramSource}
    _shaderPromises:{[name:string]:Promise<AShaderProgramSource>}={};
    constructor() {
        super();
        this._shaderSources={};
    }

    static GetURLForShaderAtPath(path:string){
        return ShaderManagerEnums.SHADER_DIRECTORY_URL+path;
    }

    LoadShader(name:string, vertexPath?:string, fragPath?:string):ShaderPromise{
        let vPath = vertexPath??`${name}/${name}.vert.glsl`
        let fPath = fragPath??`${name}/${name}.frag.glsl`
        const self=this;
        // this._shaderPromises[name]=new Promise<AShaderProgramSource>(function(myResolve, myReject){
        //     let newSource =
        //         new AShaderProgramSource(
        //             name,
        //             AShaderSourceManager.GetURLForShaderAtPath(vPath),
        //             AShaderSourceManager.GetURLForShaderAtPath(fPath)
        //         );
        //     newSource.sourcesLoadedPromise.then(
        //         function(value){
        //             self._shaderSources[name]=value;
        //         }
        //     );
        //     self._shaderSources[name]=newSource;
        //     myResolve(newSource);
        // })

        let newSource =
            new AShaderProgramSource(
                name,
                AShaderSourceManager.GetURLForShaderAtPath(vPath),
                AShaderSourceManager.GetURLForShaderAtPath(fPath)
            );
        self._shaderSources[name]=newSource;
        self._shaderPromises[name]=newSource.sourcesLoadedPromise;
        return this._shaderPromises[name];
        // assert(this._shaderSources[name] === undefined, `Tried to re-load shader ${name} with V:${vertexPath} F:${fragPath}`);
    }

    GetShaderSource(name:string){
        return this._shaderSources[name];
    }
}


export const ShaderManager = new AShaderSourceManager();
// ShaderManager.LoadShader('standard', 'standard/standard.vert.glsl', 'standard/standard.frag.glsl');
// ShaderManager.LoadShader('textured', 'textured/textured.vert.glsl', 'textured/textured.frag.glsl');
// ShaderManager.LoadShader('rgba', 'rgba/rgba.vert.glsl', 'rgba/rgba.frag.glsl');
// ShaderManager.LoadShader('simple');


// export {ShaderManager};



## Classes

### Loading GLSL code from files with ShaderManager
[ShaderManager.ts](./ShaderManager.ts) exports *ShaderManager* which is a const instance of `AShaderSourceManager`:
```typescript
// in ShaderManager.ts
export const ShaderManager = new AShaderSourceManager();
```
This provides a global library of the loaded GLSL shaders. 

If you load a shader using:
```typescript
ShaderManager.LoadShader(SHADER_NAME);
```
this will load the shader at path [public/shaders/#SHADER_NAME](../../../../public/shaders/README.md), defined by `public/shaders/#SHADER_NAME/#SHADERNAME.vert.glsl` and `public/shaders/#SHADER_NAME/#SHADERNAME.frag.glsl`.

The function itself returns a `ShaderPromise` which is a `Promise<AShaderProgramSource>`.


### Managing Materials for Rendering with AMaterialManager
[`ASceneModel._materials`](../../scene/ASceneModel.ts) is an instance of [`AMaterialManager`](./AMaterialManager.ts).

You can load new material models with:
```typescript
materialManager.setMaterialModel(name:string, m:AMaterialModelBase<any>)
```
which is an `async` function.



## AMaterialModels \& AMaterials
`AMaterialModels` are basically a template for creating a material.
`AMaterial` is an instance of that material with its own values for uniforms.
The actual THREE.Material for an AMaterial is created by calling it's model's `_CreateTHREEJS` function.


- AShaderManager: 
- AMaterialManager

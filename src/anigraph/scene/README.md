# Scene Structure


### Scene Initialization
The model and controller both 

### Scene Model: [ASceneModel](./ASceneModel.ts)
The content of a scene is defined in an [ASceneModel](./ASceneModel.ts) subclass.


#### Initialization:
Scene models are initialized asynchronously, and initialization may be triggered lazily by the first controller that tries to access the model (it can also be triggered more proactively, depending on the application). The scene model has a read-only state variable `isInitialized` that is set to false when a new scene model is constructed, but flipped to true after initialization is performed. To trigger initialization, the async function `confirmInitialized()` must be called at least once. E.g., a scene controller will call:
```typescript
await this.model.confirmInitialized();
```
in its `initRendering` function. If the scene model has not been initialized, this will trigger initialization and cause execution of `initRendering` to wait until that initialization has finished before returning. If the scene model has already been initialized, the call will simply return right away.






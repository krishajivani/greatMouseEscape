
In [CreativeAppComponent](./Creative1/C1/CreativeAppComponent.tsx) You will find the following:

```typescript
// const SceneControllerClass = C1SceneController;
// const SceneModel = new C1SceneModel();
// const SceneModel = new CurveSceneModel();
// const SceneController = new CurveSceneController(SceneModel);
const SceneModel = new PyramidSceneModel();
SceneModel.confirmInitialized();
const SceneController = new PyramidSceneController(SceneModel);
```

You can uncomment different lines for different examples. 

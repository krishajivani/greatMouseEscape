

This starter code has a few example starter scenes for inspiration. You can run them by uncommenting different choices of scene model and controller in [CreativeAppComponent](./src/Creative1/C1/CreativeAppComponent.tsx) you will find the following:


```typescript
/**
 * This would be good starter code for a project like the pyramid example we provide. It even has some of the controls set up already.
 */
const SceneModel = new CustomSceneModel();
SceneModel.confirmInitialized();
const SceneController = new CustomSceneController(SceneModel);

/**
 * This example is an empty scene. Room to fill with your hopes and dreams...
 */
const SceneModel = new EmptySceneModel();
SceneModel.confirmInitialized();
const SceneController = new EmptySceneController(SceneModel);


/**
 * This would be a good project for procedural / animated curves
 */
const SceneModel = new CurveSceneModel();
SceneModel.confirmInitialized();
const SceneController = new CurveSceneController(SceneModel);

/**
 * This is a starter particle system project. It shows you how to render and position particles.
 * You just have to write code to make them move in interesting ways.
 */
const SceneModel = new ParticleSystemSceneModel();
SceneModel.confirmInitialized();
const SceneController = new ParticleSystemSceneController(SceneModel);
```


Check back on the [assignment docs](https://www.cs.cornell.edu/courses/cs4620/2022fa/assignments/) for an overview of the helper examples and videos of a couple of possible features you could implement. We will try to update the docs with answers to questions that come up during the week.


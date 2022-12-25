import {
    ANodeModel2D,
    ASerializable,
    Color,
    Curve2DModel,
    Mat4,
    Quaternion,
    V2,
    V3,
    Vec2
} from "../../../../../anigraph";

enum AppStateKeys{
    PyramidScale="PyramidScale",
    PyramidRotation="PyramidRotation",
    PyramidProps="PyramidProps",
    PyramidBaseColor="PyramidBaseColor",
}

@ASerializable("CustomPolygonModel")
export class CustomPolygonModel extends ANodeModel2D{
    static AppStateKeys=AppStateKeys;
    pyramidScale:number=1.0;
    pyramidRotation:number=0.1;
    pyramidAnchor:Vec2=V2();
    color:Color;
    nElements:number=5;

    signalPyramidUpdate(){
        this.signalEvent(CustomPolygonModel.AppStateKeys.PyramidProps);
    }

    constructor() {
        super();
        this.color = Color.Random();
        const self = this;
        /**
         * Here we are calling signalPyramidUpdate any time one of the control panel parameters changes
         */
        this.subscribeToAppState(CustomPolygonModel.AppStateKeys.PyramidScale, (v:number)=>{
            self.pyramidScale = v;
            self.signalPyramidUpdate();
        })
        this.subscribeToAppState(CustomPolygonModel.AppStateKeys.PyramidRotation, (v:number)=>{
            self.pyramidRotation = v;
            self.signalPyramidUpdate();
        })
        this.subscribeToAppState(CustomPolygonModel.AppStateKeys.PyramidBaseColor, (color:Color)=>{
            self.color = color;
            self.signalPyramidUpdate();
        })
    }
}

import {ASerializable, AObjectState} from "../../../../base";
import {ANodeModel2D} from "../../../ANodeModel";
import {Color, V2, Vec2, Vec3, Vec4} from "../../../../math";

@ASerializable("Vector2DModel")
export class Vector2DModel extends ANodeModel2D{
    @AObjectState lineWidth!:number;
    @AObjectState arrowheadSize!:number;

    constructor(){
        super();
        this.verts.initColorAttribute()
        this.lineWidth = 0.002;
        this.arrowheadSize = 10;
    }

    addVertices(positions: Vec2[] | Vec3[], colors?: Color[] | Vec3[] | Vec4[]){
        this.verts.addVertices(positions, colors);
    }
    setEndpoint(position:Vec2){
        this.verts.position.setAt(this.verts.nVerts-1, position);
        this.signalGeometryUpdate()
    }

    getEndPoint(){
        let ep3 = this.verts.position.getAt(this.verts.nVerts-1);
        return V2(ep3.x, ep3.y);
    }

}


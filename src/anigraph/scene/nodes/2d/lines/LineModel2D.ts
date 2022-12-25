import {ANodeModel2D} from "../../../index";
import {
    AObjectState,
    ASerializable,
    Color,
    Vec2, Vec3, Vec4,
    VertexArray2D
} from "../../../../index";


@ASerializable("LineModel2D")
export class LineModel2D extends ANodeModel2D{
    @AObjectState lineWidth!:number;
    constructor(){
        super();
        // this.verts.initColor3DAttribute();
        this.verts.initColorAttribute()
        this.lineWidth = 0.02;
    }

    addVertices(positions: Vec2[] | Vec3[], colors?: Color[] | Vec3[] | Vec4[]){
        this.verts.addVertices(positions, colors);
    }
}

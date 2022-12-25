import {ANodeView} from "../../../../anigraph";
import {APolygon2DGraphic} from "../../../../anigraph";
import {Polygon2DModel} from "./Polygon2DModel";

let nErrors = 0;

export class Polygon2DView extends ANodeView{
    element!: APolygon2DGraphic;
    get model(): Polygon2DModel {
        return this._model as Polygon2DModel;
    }
    init(): void {
        this.element = new APolygon2DGraphic();
        this.element.init(this.model.verts, this.model.material.threejs);
        this.addGraphic(this.element);
        this.update();
    }

    update(): void {
        this.element.setVerts2D(this.model.verts);
        this.setTransform(this.model.getWorldTransform().Mat4From2DH());
    }
}

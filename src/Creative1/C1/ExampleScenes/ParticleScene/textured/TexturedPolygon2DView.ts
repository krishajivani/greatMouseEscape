import {APolygon2DGraphic} from "../../../../../anigraph/rendering/graphicelements/APolygon2DGraphic";
import {ANodeView} from "../../../../../anigraph";
import {TexturedPolygon2DModel} from "./TexturedPolygon2DModel";
import {Polygon2DView} from "../../Polygon2D";

export class TexturedPolygon2DView extends Polygon2DView{
    element!: APolygon2DGraphic;
    get model(): TexturedPolygon2DModel {
        return this._model as TexturedPolygon2DModel;
    }
    init(): void {
        super.init();
        this.element.setTextureMatrix(this.model.textureMatrix);
    }

    update(...args:any[]): void {
        super.update();
        this.element.setTextureMatrix(this.model.textureMatrix);
    }
}





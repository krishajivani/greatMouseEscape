import {ANodeView2D, Color, Mat3, V2} from "../../../../../anigraph";
import {APolygon2DGraphic} from "../../../../../anigraph";
import {CustomPolygonModel} from "./CustomPolygonModel";
import {Startup} from "mathjax-full/js/components/startup";


export class CustomPolygonView extends ANodeView2D{
    elements!: APolygon2DGraphic[];

    get model(): CustomPolygonModel {
        return this._model as CustomPolygonModel;
    }

    createElements(){
        this.disposeGraphics();
        this.elements = [];
        for(let i=0;i<this.model.nElements;i++){
            let newElement=new APolygon2DGraphic();
            newElement.init(this.model.verts, Color.Random());
            newElement.setTransform(this.model.transform);
            this.elements.push(newElement);
            this.addGraphic(newElement);
        }
    }

    /**
     * Use this funct ion to create your pyramid!
     */
    updateElements(){
        for(let i=0;i<this.model.nElements;i++){
            this.elements[i].setTransform(Mat3.Translation2D(V2(1,1).times(this.model.pyramidScale*i)));
            this.elements[i].setMaterial(this.model.color);
        }
    }

    init(): void {
        this.createElements();
        this.update();
        const self = this;
        /**
         * We are going to update elements every time pyramid props are updates
         */
        this.subscribe(this.model.addEventListener(CustomPolygonModel.AppStateKeys.PyramidProps,()=>{
            self.updateElements();
        }));
    }


    update(): void {
        this.setTransform(this.model.getWorldTransform().Mat4From2DH());
    }
}

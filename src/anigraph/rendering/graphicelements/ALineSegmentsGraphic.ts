import {AGraphicElement} from "../graphicobject";
import {Color} from "../../math";
import {VertexArray, VertexArray2D} from "../../math";
import {LineSegmentsGeometry} from "three/examples/jsm/lines/LineSegmentsGeometry";
import {LineSegments2} from "three/examples/jsm/lines/LineSegments2";
import * as THREE from "three";
import {AMaterial, AThreeJSLineMaterial} from "../material";
import {ASerializable} from "../../base";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";

@ASerializable("ALineSegmentsGraphic")
export class ALineSegmentsGraphic extends AGraphicElement {
    get geometry(): LineGeometry {
        return this._geometry as LineGeometry;
    }

    // get color() {
    //     return this.material.color;
    // }

    // setColor(color: Color) {
    //     this.material.color = color.asThreeJS();
    // }

    // getColor() {
    //     return Color.FromThreeJS(this.color);
    // }

    get lineWidth() {
        return this.material.linewidth;
    }

    setLineWidth(lineWidth: number) {
        this.material.linewidth = lineWidth;
    }

    onMaterialUpdate(newMaterial: AMaterial) {
        super.onMaterialUpdate(newMaterial);
    }

    onMaterialChange(newMaterial: AMaterial) {
        super.onMaterialUpdate(newMaterial);
    }

    get threejs(): LineSegments2 {
        return this._element as LineSegments2;
    }

    get material(): AThreeJSLineMaterial {
        return this._material as AThreeJSLineMaterial;
    }

    static Create(verts?: VertexArray<any>, material?: Color | THREE.Color | THREE.Material | THREE.Material[] | AMaterial, lineWidth?: number) {
        // let newElement = new this(verts, material);
        let newElement = new ALineSegmentsGraphic();
        newElement.init(verts, material);
        if (lineWidth !== undefined) {
            newElement.setLineWidth(lineWidth);
        }
        return newElement;
    }

    // With Line Segment Geometry
    _createLineGeometry() {
        this._geometry = new LineSegmentsGeometry();
        // this._geometry = new LineGeometry();
    }

    // _createLineGeometry(){
    //     this._geometry = new THREE.BufferGeometry();
    // }

    init(geometry?: LineSegmentsGeometry | LineGeometry | VertexArray<any>, material?: Color | THREE.Color | THREE.Material | THREE.Material[] | AMaterial) {
        if (this._element) {
            throw new Error(`Tried to call init on GraphicElement that already has _element ${this._element}`);
        }
        this._initIfNotAlready(geometry, material);
    }

    _initIfNotAlready(geometry?: LineSegmentsGeometry | LineGeometry | VertexArray<any>, material?: Color | THREE.Color | THREE.Material | THREE.Material[] | AMaterial) {
        if (geometry) {
            if (geometry instanceof LineSegmentsGeometry || geometry instanceof LineGeometry) {
                this._geometry = geometry;
            } else {
                // this._createLineGeometry();
                this.setGeometry(geometry);
            }
        }
        if (material) {
            this.setMaterial(material);
        }
        if (this.material && this.geometry) {
            // @ts-ignore
            this._element = new Line2(this.geometry, this.material);
            this._element.matrixAutoUpdate = false;
        }
    }

    constructor() {
        super();
    }

    setColors(rgba: number[] | Float32Array) {
        let colors: Float32Array;
        if (rgba instanceof Float32Array) {
            colors = rgba;
        } else {
            colors = new Float32Array(rgba);
        }
        const instanceColorBuffer = new THREE.InstancedInterleavedBuffer(colors, 8, 1); // rgba, rgba
        this.geometry.setAttribute('instanceColorStart', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 4, 0)); // rgba
        this.geometry.setAttribute('instanceColorEnd', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 4, 4)); // rgba
    }

    setVerts2D(verts: VertexArray<any> | number[]) {
        let geometry = verts;
        if (Array.isArray(verts)) {
            // geometry = VertexArray2D.CreateLineSegments2D(verts);
            throw new Error("Setting verts from array not implemented yet")
        }

        if (this._geometry) {
            this._geometry.dispose();
        }
        this._createLineGeometry();
        if ((geometry as VertexArray<any>).nVerts > 0) {
            this.geometry.setPositions((geometry as VertexArray<any>).position.getElementsSlice());
            if((geometry as VertexArray<any>).color !== undefined && (geometry as VertexArray<any>).color.nVerts>0) {
                this.setColors((geometry as VertexArray<any>).color.getElementsSlice());
            }
        }

        if (this._element) {
            this.element.geometry = this._geometry;
        }
    }

    /**
     * For some subclasses this will be different from setGeometry, because some subclasses will compute procedural
     * geometry based on verts and then set the geometry to the output of that procedure
     * @param verts
     */
    setVerts(verts: VertexArray<any>) {
        if (verts instanceof VertexArray2D && 'setVerts2D' in this) {
            // @ts-ignore
            this.setVerts2D(verts);
        } else {
            this.setGeometry(verts);
        }
    }

}


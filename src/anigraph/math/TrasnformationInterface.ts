import {Mat4, Matrix} from "./linalg";
import * as THREE from "three";

export interface TransformationInterface {
    getMatrix(): Matrix;
    assignTo(threejsMat:THREE.Matrix4):void;
}

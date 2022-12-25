import * as THREE from "three";

export function GetDeepTHREEJSClone(object:THREE.Object3D, cloneGeometry:boolean=true, cloneMaterial:boolean=true){
    let clone:THREE.Object3D;
    if (object instanceof THREE.Mesh) {
        clone = object.clone(false) as THREE.Mesh;
        let g = object.geometry;
        if(cloneGeometry){
            g=g.clone();
        }
        let m=object.material;
        if(cloneMaterial){
            m = m.clone();
        }
        (clone as THREE.Mesh).geometry=g;
        (clone as THREE.Mesh).material=m;
        // clone = new THREE.Mesh(g, m);
        // clone.copy(object, false)
    }else{
        clone = object.clone(false);
    }
    for(let c of object.children){
        clone.add(GetDeepTHREEJSClone(c));
    }
    return clone;

}

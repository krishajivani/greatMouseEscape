import * as THREE from "three";
import type { SvgNode, SVGParsedData } from "./SVGLoader";
import { SVGLoader, SVGPath } from "./SVGLoader";

/**
 * set position, scale, rotation of @param object
 * specified by the 4x4 homogeneous matrix @param m4
 * @param object object to set its position, scale and rotation
 * @param m4 4x4 homogeneous matrix m4
 */
export function setAttributesFromMatrix(
  object: THREE.Object3D,
  m4: THREE.Matrix4
) {
  object.position.add(new THREE.Vector3().setFromMatrixPosition(m4));
  object.scale.copy(new THREE.Vector3().setFromMatrixScale(m4));
  object.rotation.copy(
    new THREE.Euler().setFromRotationMatrix(
      new THREE.Matrix4().extractRotation(m4)
    )
  );
}

/** move ThreeJs obeject @param object to the center
 * of world coordinate
 */
export function moveObjectToWorldCenter(object: THREE.Object3D) {
  let center = new THREE.Vector3();
  let boundingBox = new THREE.Box3().setFromObject(object);
  boundingBox.getCenter(center);
  object.position.sub(center);
}

export function createMeshesFromPath(path: SVGPath) {
  const meshes: THREE.Mesh[] = [];
  addFillMeshes(meshes);
  addStrokeMeshes(meshes);
  return meshes;

  function addFillMeshes(meshes: THREE.Mesh[]) {
    const fillColor = path.userData.style.fill;
    if (fillColor !== undefined && fillColor !== "none") {
      // const material = new THREE.MeshBasicMaterial({
      //   color: new THREE.Color().setStyle(fillColor),
      //   opacity: path.userData.style.fillOpacity,
      //   transparent:
      //     path.userData.style.strokeOpacity &&
      //     path.userData.style.strokeOpacity < 1
      //       ? true
      //       : false,
      //   side: THREE.DoubleSide,
      //   depthWrite: false,
      //   wireframe: false,
      // });

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setStyle(fillColor),
        opacity: path.userData.style.fillOpacity,
        transparent:
            path.userData.style.strokeOpacity &&
            path.userData.style.strokeOpacity < 1
                ? true
                : false,
        side: THREE.DoubleSide,
        depthWrite: true,
        depthTest: true,
        wireframe: false,
      });

      const shapes: THREE.Shape[] = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);
        meshes.push(mesh);
      }
    }
  }
  function addStrokeMeshes(meshes: THREE.Mesh[]) {
    const strokeColor = path.userData.style.stroke;

    if (strokeColor !== undefined && strokeColor !== "none") {
      // const material = new THREE.MeshBasicMaterial({
      //   color: new THREE.Color().setStyle(strokeColor),
      //   opacity: path.userData.style.strokeOpacity,
      //   transparent:
      //     path.userData.style.strokeOpacity &&
      //     path.userData.style.strokeOpacity < 1
      //       ? true
      //       : false,
      //   side: THREE.DoubleSide,
      //   depthWrite: false,
      //   wireframe: false,
      // });
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setStyle(strokeColor),
        opacity: path.userData.style.strokeOpacity,
        transparent:
            path.userData.style.strokeOpacity &&
            path.userData.style.strokeOpacity < 1
                ? true
                : false,
        side: THREE.DoubleSide,
        depthWrite: true,
        wireframe: false,
      });

      for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
        const subPath = path.subPaths[j];

        const geometry = SVGLoader.pointsToStroke(
          subPath.getPoints(),
          path.userData.style
        );

        if (geometry) {
          const mesh = new THREE.Mesh(geometry, material);

          meshes.push(mesh);
        }
      }
    }
  }
}

/**
 * Convert 1d position list (x1,y1,z1,x2,y2...)
 * to vertices array [[x1,y1,z1],[x2,y2,z2]]
 * @example
 * const vertices = verticesFromPositionList(positions)
 * vertices = [[1,2,0], [2,3,0]]
 */
export function verticesFromPositionList(
  positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute
): number[][] {
  const vertices = [];
  let index = 0;
  while (index < positions.array.length) {
    const vertex = [];
    for (let i = 0; i < 3; i++) {
      vertex.push(positions.array[index]);
      index++;
    }
    vertices.push(vertex);
  }
  return vertices;
}

/**
 * make vertices of @param mesh
 * centered around its local origin
 * while perserving its position in
 * world coordinate (parent coordinate)
 * @param mesh
 * @implements
 * vertices -= center
 * mesh.position += center
 */
export function makeOriginCenterForMesh(mesh: THREE.Mesh) {
  const center = getCenter(mesh);
  centerWithoutMove(mesh, center);
}

/** @returns center point of @params mesh */
export function getCenter(mesh: THREE.Mesh): THREE.Vector3 {
  mesh.geometry.computeBoundingBox();
  let center = new THREE.Vector3();
  mesh.geometry.boundingBox!.getCenter(center);
  return center;
}

/**
 * make vertices of @param mesh
 * centered around local origin
 * specified as @param center
 * while perserving its position in
 * world coordinate (parent coordinate)
 * @param mesh
 * @param center
 */
export function centerWithoutMove(mesh: THREE.Mesh, center: THREE.Vector3) {
  /**
   * @return [vertex1, vertex2,...] or [[x1,y1,z1],[x2,y2,z2],...]
   * @example return [[1,2,0], [2,3,0]]
   */
  function getVertices(mesh: THREE.Mesh) {
    const positions = mesh.geometry.getAttribute("position");
    const vertices = verticesFromPositionList(positions);
    return vertices;
  }
  const vertices = getVertices(mesh);
  // center vertices
  vertices.forEach((vertex) => {
    vertex[0] -= center.x;
    vertex[1] -= center.y;
  });
  mesh.geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices.flat(), 3)
  );
  // update position of matrix to make sure it doesn't move
  mesh.position.set(center.x, center.y, 0);
  mesh.updateMatrix();
  // make sure future references of bounding box is correct
  mesh.geometry.computeBoundingBox();
}

/**
 * move local origin of @param group to the center of
 * all of its children (i.e. center of its bounding box)
 * while maintaining its world position
 * @param group
 * @implements
 * eachChild.position -= center
 * group.position += center
 */
export function makeOriginCenterForGroup(group: THREE.Group) {
  let center = new THREE.Vector3();
  let boundingBox = new THREE.Box3().setFromObject(group);
  boundingBox.getCenter(center);
  for (const child of group.children) {
    child.position.sub(center);
  }
  group.position.add(center);
}

function matrix4FromMatrix3(matrix3: THREE.Matrix3): THREE.Matrix4 {
  function from1Dto2DArray(list: number[]) {
    let m: number[][] = [[], [], []];
    let index = 0;
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        m[i].push(list[index]);
        index++;
      }
    }
    return m;
  }
  const m = from1Dto2DArray(matrix3.toArray());
  const m4 = [
    [m[0][0], m[0][1], 0, m[0][2]],
    [m[1][0], m[1][1], 0, m[1][2]],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  return new THREE.Matrix4().fromArray(m4.flat()).transpose();
}

/**
 * @returns a Hierarchical THREE.Group object from
 * svg specified by @param svgUrl
 * @param svgUrl url for the svg file
 * @example
 * loadSVG('./sbsp.svg')
 */
export async function SvgToThreeJsObject(
  svgUrl: string
): Promise<THREE.Object3D> {
  const svgParsedData = await loadSvgData(svgUrl);
  const svgRootThreeJSObject = generateThreeJSGroupForSVG(svgParsedData);
  moveObjectToWorldCenter(svgRootThreeJSObject);
  svgRootThreeJSObject.scale.multiplyScalar(0.3);
  svgRootThreeJSObject.scale.y *= -1;
  return svgRootThreeJSObject;
}

async function loadSvgData(svgUrl: string) {
  const loader = new SVGLoader();
  const svgParsedData: SVGParsedData = await loader.load(svgUrl);
  return svgParsedData;
}

export function SvgTextToThreeJsObject(svgText: string): THREE.Object3D {
  const svgParsedData = parseSVG(svgText);
  const svgRootThreeJSObject = generateThreeJSGroupForSVG(svgParsedData);
  moveObjectToWorldCenter(svgRootThreeJSObject);
  svgRootThreeJSObject.scale.multiplyScalar(1.0);
  svgRootThreeJSObject.scale.y *= -1;
  return svgRootThreeJSObject;
}

export function ThreeJSObjectFromParsedSVG(
  svgParsedData: SVGParsedData
): THREE.Object3D {
  const svgRootThreeJSObject = generateThreeJSGroupForSVG(svgParsedData);
  // moveObjectToWorldCenter(svgRootThreeJSObject);
  // svgRootThreeJSObject.scale.multiplyScalar(1.0);
  // svgRootThreeJSObject.scale.y *= -1;
  // svgRootThreeJSObject.updateMatrix();
  svgRootThreeJSObject.matrixAutoUpdate = false;
  return svgRootThreeJSObject;
}

export function getSVGTextFromFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result);
    };
    reader.onerror = (err) => {
      alert("failed to upload file with err" + err);
    };
    reader.readAsText(file);
  });
}

function parseSVG(svgText: string) {
  const loader = new SVGLoader();
  const svgParsedData: SVGParsedData = loader.parse(svgText);
  return svgParsedData;
}

function generateThreeJSGroupForSVG(svgData: SVGParsedData): THREE.Object3D {
  const rootSvgNode = svgData.rootSvgNode;
  const svgThreeJsRootObject: THREE.Object3D =
    createThreeJSObject(rootSvgNode)[0];
  return svgThreeJsRootObject;
}

/**
 * create an array of ThreeJS object
 * with root being current SVG node
 * @implements
 * Create mesh for primitive types like path, rect.
 * Create group for g.
 * Convert localTransform into position, scale, rotation
 * attributes of ThreeJS object
 * @param root {SvgNode} tree structure
 * parsed from SVG containing path and svg node information
 * @returns [THREE.Group] or [THREE.Mesh] or []
 */
function createThreeJSObject(root: SvgNode): THREE.Object3D[] {
  // decide if root is a group by seeting whether length > 0
  if (root.children.length > 0) {
    const group = new THREE.Group();
    group.name = root.id ?? root.node.nodeName;
    for (const child of root.children) {
      const childSceneArray = createThreeJSObject(child);
      if (childSceneArray) {
        childSceneArray.forEach((scene) => group.add(scene));
      }
    }
    makeOriginCenterForGroup(group);
    setAttributesFromMatrix(group, matrix4FromMatrix3(root.localTransform));
    return [group];
  } else if (root.originPath) {
    const meshes = createMeshesFromPath(root.originPath);
    meshes.forEach((mesh: THREE.Mesh) => {
      mesh.name = root.id ?? root.node.nodeName;
      makeOriginCenterForMesh(mesh);
      setAttributesFromMatrix(mesh, matrix4FromMatrix3(root.localTransform));
    });
    return meshes;
  } else return [];
}

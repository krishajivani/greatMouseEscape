precision highp float;
precision highp int;

varying vec4 vPosition;
varying vec4 vColor;
varying vec3 vNormal;

void main() {
    //    vColor = vec4(color.xyzw);
    vColor = color;
    vPosition = modelViewMatrix * vec4(position.xyz, 1.0);
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz , 1.0);
}

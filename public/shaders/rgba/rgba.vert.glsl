precision highp float;
precision highp int;
attribute vec4 color;
varying vec4 vPosition;
varying vec4 vColor;
varying vec3 vNormal;

void main() {
    vColor = color;
    vPosition = modelViewMatrix * vec4(position.xyz, 1.0);
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz , 1.0);
}

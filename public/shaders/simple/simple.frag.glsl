precision highp float;
precision highp int;
uniform mat4 modelViewMatrix;
varying vec4 vPosition;
varying vec4 vColor;
varying vec3 vNormal;


void main()	{
    gl_FragColor = vColor;

}

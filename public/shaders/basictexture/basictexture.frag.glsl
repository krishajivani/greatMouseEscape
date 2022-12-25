precision highp float;
precision highp int;

//uniform float exposure;

uniform sampler2D inputMap;
uniform bool inputMapProvided;

varying vec4 vPosition;
varying vec2 vUv;

void main()	{
    vec4 inputColor = texture(inputMap, vUv);
//    gl_FragColor = vec4(inputColor.xyz*exposure, inputColor.w);
    gl_FragColor = inputColor;
//    float L = rgb2lab(inputColor.xyz).x;
//    gl_FragColor = vec4(L,L,L,1.0);
}

precision highp float;
precision highp int;

uniform sampler2D tex0Map;
uniform sampler2D tex1Map;
uniform sampler2D tex2Map;
uniform sampler2D tex3Map;
uniform sampler2D tex4Map;
uniform sampler2D tex5Map;
uniform sampler2D tex6Map;
uniform sampler2D tex7Map;
uniform sampler2D tex8Map;
uniform sampler2D tex9Map;
uniform sampler2D tex10Map;
uniform sampler2D tex11Map;
uniform sampler2D tex12Map;
uniform sampler2D tex13Map;
uniform sampler2D tex14Map;
varying vec2 vUv;

uniform float weights[15];
uniform int nTextures;
uniform bool homogenize;


vec4 sampleTexValue(int index, vec2 uv){
    if(index==0){
        return texture(tex0Map, uv);
    }
    if(index==1){
        return texture(tex1Map, uv);
    }
    if(index==2){
        return texture(tex2Map, uv);
    }
    if(index==3){
        return texture(tex3Map, uv);
    }
    if(index==4){
        return texture(tex4Map, uv);
    }
    if(index==5){
        return texture(tex5Map, uv);
    }
    if(index==6){
        return texture(tex6Map, uv);
    }
    if(index==7){
        return texture(tex7Map, uv);
    }
    if(index==8){
        return texture(tex8Map, uv);
    }
    if(index==9){
        return texture(tex9Map, uv);
    }
    if(index==10){
        return texture(tex10Map, uv);
    }
    if(index==11){
        return texture(tex11Map, uv);
    }
    if(index==12){
        return texture(tex12Map, uv);
    }
    if(index==13){
        return texture(tex13Map, uv);
    }
    return texture(tex14Map, uv);
}

void main()    {
//    vec4 inputPix = texture(inputMap, vUv);
    vec4 oval = vec4(0.0,0.0,0.0,0.0);

    for(int tx=1;tx<nTextures;tx++){
        oval = oval + sampleTexValue(tx, vUv)*weights[tx];
    }
    if(homogenize){
        oval=oval/oval.w;
    }

    gl_FragColor = oval;

}

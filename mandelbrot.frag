#ifdef GL_ES
precision lowp float;
#endif

#extension GL_ARB_gpu_shader_fp64 : enable

#define PI 3.1415926538

uniform vec2 u_resolution;
uniform float u_time;

vec2 map(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main()
{

    const float maxIter = 1000.;
    
    vec2 center = vec2(-1.110052,-0.256334);

    float zoom = exp(u_time/2.);

    //zoom = 1.;
    
    vec2 pxMin = vec2(center.x - (2.*u_resolution.x/u_resolution.y/zoom), center.y-2./zoom);
    //vec2 pxMin = center - 2.*u_resolution.x/u_resolution.y;
    vec2 pxMax = vec2(center.x + 2.*u_resolution.x/u_resolution.y/zoom, center.y+2./zoom);
    //vec2 pxMax = center + 2.*u_resolution.x/u_resolution.y;
        
    vec2 pxSize = (pxMax-pxMin)/u_resolution;

    // Normalized pixel coordinates on space defined my pxMin and pxMax
    //vec2 uv = vec2((gl_FragCoord.x - 1.) * (pxMax.x - pxMin.x) / (u_resolution.x - 1.) + pxMin.x, (gl_FragCoord.y - 1.) * (pxMax.y - pxMin.y) / (u_resolution.y - 1.) + pxMin.y);
    vec2 uv = map(gl_FragCoord.xy, vec2(0, 0), u_resolution.xy, pxMin, pxMax);

    vec3 col = vec3(0, 0, 0);
    
    vec2 z = vec2(0., 0.);   
    for(float i=0.; i<maxIter; i++){
      z = vec2(z.x*z.x-z.y*z.y+uv.x, 2.*z.x*z.y+uv.y);
      if(length(z)>2.){
          col = vec3(pow(cos(i/maxIter*10.*PI),2.), pow(cos(i/maxIter*10.*PI+PI/3.),2.), pow(cos(i/maxIter*10.*PI+2.*PI/3.),2.));
          col = vec3(pow(cos(i*log(maxIter)/1000.*PI),2.), 0, pow(cos(i*log(maxIter)/1000.*PI+2.*PI/3.),2.));
          break;
      }
    }
        

    // Time varying pixel color
    //vec3 col = 0.5 + 0.5*cos(u_time+uv.xyx+vec3(0,2,4));

    // Output to screen
    gl_FragColor = vec4(col,1.0);
}
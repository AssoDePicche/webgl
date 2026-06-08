precision mediump float;

attribute vec3 aPosition;
attribute vec2 textureCoordinates;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProjection;

varying vec2 fragTextureCoord;

varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
  vec4 worldPosition = mWorld * vec4(aPosition, 1.0);

  vWorldPosition = worldPosition.xyz;
    
  vNormal = normalize(mat3(mWorld) * aPosition); 

  fragTextureCoord = textureCoordinates;

  gl_Position = mProjection * mView * worldPosition;
}

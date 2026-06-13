precision mediump float;

attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aTextureCoordinates;

uniform mat4 u_World;
uniform mat4 u_View;
uniform mat4 u_Projection;

varying vec2 v_TextureCoordinates;
varying vec3 v_WorldPosition;
varying vec3 v_Normal;

void main() {
  vec4 worldPosition = u_World * vec4(aPosition, 1.0);

  v_WorldPosition = worldPosition.xyz;
    
  v_Normal = normalize(mat3(u_World) * aNormal); 

  v_TextureCoordinates = aTextureCoordinates;

  gl_Position = u_Projection * u_View * worldPosition;
}

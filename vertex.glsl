precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTextureCoord;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProjection;

varying vec2 fragTextureCoord;

void main() {
  fragTextureCoord = vertTextureCoord;

  gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);
}

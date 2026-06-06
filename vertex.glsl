precision mediump float;

attribute vec3 aPosition;
attribute vec2 textureCoordinates;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProjection;

varying vec2 fragTextureCoord;

void main() {
  fragTextureCoord = textureCoordinates;

  gl_Position = mProjection * mView * mWorld * vec4(aPosition, 1.0);
}

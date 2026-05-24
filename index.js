import { clearBackground, createBuffer, createShader, createTexture, deg2Rad, getGraphicsContext, linkProgram, setupAttribute } from './src/webgl.js';

const getFileContents = async (URL) => await fetch(URL).then((resource) => resource.text());

const vertexShaderSourceCode = await getFileContents("vertex.glsl");

const fragmentShaderSourceCode = await getFileContents("fragment.glsl");

const context = getGraphicsContext();

clearBackground(context, 0, 0, 0, 1);

const vertexShader = createShader(context, vertexShaderSourceCode, context.VERTEX_SHADER);

const fragmentShader = createShader(context, fragmentShaderSourceCode, context.FRAGMENT_SHADER);

const program = context.createProgram();

context.attachShader(program, vertexShader);

context.attachShader(program, fragmentShader);

linkProgram(context, program);

// X, Y, Z, U, V
const vertices = [
// Top
  -1.0, 1.0, -1.0,   0, 0,
  -1.0, 1.0, 1.0,    0, 1,
   1.0, 1.0, 1.0,     1, 1,
   1.0, 1.0, -1.0,    1, 0,

// Left
  -1.0, 1.0, 1.0,    0, 0,
  -1.0, -1.0, 1.0,   1, 0,
  -1.0, -1.0, -1.0,  1, 1,
  -1.0, 1.0, -1.0,   0, 1,

// Right
   1.0, 1.0, 1.0,    1, 1,
   1.0, -1.0, 1.0,   0, 1,
   1.0, -1.0, -1.0,  0, 0,
   1.0, 1.0, -1.0,   1, 0,

// Front
   1.0, 1.0, 1.0,    1, 1,
   1.0, -1.0, 1.0,    1, 0,
  -1.0, -1.0, 1.0,    0, 0,
  -1.0, 1.0, 1.0,    0, 1,

// Back
   1.0, 1.0, -1.0,    0, 0,
   1.0, -1.0, -1.0,    0, 1,
  -1.0, -1.0, -1.0,    1, 1,
  -1.0, 1.0, -1.0,    1, 0,

// Bottom
  -1.0, -1.0, -1.0,   1, 1,
  -1.0, -1.0, 1.0,    1, 0,
   1.0, -1.0, 1.0,     0, 0,
   1.0, -1.0, -1.0,    0, 1,
];

const indices = [
// Top
0, 1, 2,
0, 2, 3,

// Left
5, 4, 6,
6, 4, 7,

// Right
8, 9, 10,
8, 10, 11,

// Front
13, 12, 14,
15, 14, 12,

// Back
16, 17, 18,
16, 18, 19,

// Bottom
21, 20, 22,
22, 20, 23
];

createBuffer(context, new Float32Array(vertices), context.ARRAY_BUFFER);

createBuffer(context, new Uint16Array(indices), context.ELEMENT_ARRAY_BUFFER);

setupAttribute(context, program, "vertPosition", 3, 0);

setupAttribute(context, program, "vertTextureCoord", 2, 3);

context.useProgram(program);

const texture = createTexture(context, "crate.svg");

const worldUniformLocation = context.getUniformLocation(program, "mWorld");

const worldMatrix = glMatrix.mat4.identity(new Float32Array(16));

const viewUniformLocation = context.getUniformLocation(program, "mView");

const viewMatrix = glMatrix.mat4.lookAt(new Float32Array(16), [0,0,-8], [0,0,0], [0,1,0]);

const projectionUniformLocation = context.getUniformLocation(program, "mProjection");

const fieldOfView = deg2Rad(45);

const aspectRatio = canvas.width / canvas.height;

const frustumNearBound = 0.1;

const frustumFarBound = 1000.0;

const projectionMatrix = glMatrix.mat4.perspective(new Float32Array(16), fieldOfView, aspectRatio, frustumNearBound, frustumFarBound);

context.uniformMatrix4fv(worldUniformLocation, context.FALSE, worldMatrix);

context.uniformMatrix4fv(viewUniformLocation, context.FALSE, viewMatrix);

context.uniformMatrix4fv(projectionUniformLocation, context.FALSE, projectionMatrix);

var xRotationMatrix = new Float32Array(16);

var yRotationMatrix = new Float32Array(16);

var angle = 0;

const identityMatrix = glMatrix.mat4.identity(new Float32Array(16));

const loop = () => {
  angle = performance.now() / 1000 / 6 * 2 * Math.PI;

  glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle / 2, [0, 1, 0]);

  glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);

  glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);

  context.uniformMatrix4fv(worldUniformLocation, context.FALSE, worldMatrix);

  clearBackground(context, 0, 0, 0, 1);

  context.bindTexture(context.TEXTURE_2D, texture);

  context.activeTexture(context.TEXTURE0);

  context.drawElements(context.TRIANGLES, indices.length, context.UNSIGNED_SHORT, 0);

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);

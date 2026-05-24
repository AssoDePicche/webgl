import { indices, vertices } from './src/cube.js';

import { getFileContents } from './src/fs.js';

import { attachEventListeners, cameraState, updateCamera } from './src/input.js';

import { deg2Rad } from './src/utils.js';

import { clearBackground, createBuffer, createShader, createTexture, getGraphicsContext, linkProgram, setupAttribute } from './src/webgl.js';

const vertexShaderSourceCode = await getFileContents('vertex.glsl');

const fragmentShaderSourceCode = await getFileContents('fragment.glsl');

const inputX = document.getElementById('angleX');

const inputY = document.getElementById('angleY');

const inputZ = document.getElementById('angleZ');

const inputFieldOfView = document.getElementById('fieldOfView');

const outputX = document.getElementById('angleX_Value');

const outputY = document.getElementById('angleY_Value');

const outputZ = document.getElementById('angleZ_Value');

const outputFieldOfView = document.getElementById('fieldOfView_Value');

const context = getGraphicsContext();

clearBackground(context, 0, 0, 0, 1);

const vertexShader = createShader(context, vertexShaderSourceCode, context.VERTEX_SHADER);

const fragmentShader = createShader(context, fragmentShaderSourceCode, context.FRAGMENT_SHADER);

const program = context.createProgram();

context.attachShader(program, vertexShader);

context.attachShader(program, fragmentShader);

linkProgram(context, program);

createBuffer(context, new Float32Array(vertices), context.ARRAY_BUFFER);

createBuffer(context, new Uint16Array(indices), context.ELEMENT_ARRAY_BUFFER);

setupAttribute(context, program, 'vertPosition', 3, 0);

setupAttribute(context, program, 'vertTextureCoord', 2, 3);

context.useProgram(program);

const texture = createTexture(context, 'crate.svg');

const worldUniformLocation = context.getUniformLocation(program, 'mWorld');

const worldMatrix = glMatrix.mat4.identity(new Float32Array(16));

const viewUniformLocation = context.getUniformLocation(program, 'mView');

const projectionUniformLocation = context.getUniformLocation(program, 'mProjection');

const aspectRatio = context.canvas.width / context.canvas.height;

const frustumNearBound = 0.1;

const frustumFarBound = 1000.0;

const loop = () => {
  updateCamera();

  const { phi, radius, theta } = cameraState;

  const x = radius * Math.cos(phi) * Math.sin(theta);

  const y = radius * Math.sin(phi);

  const z = radius * Math.cos(phi) * Math.cos(theta);

  const eye = vec3(x, y, z);

  const at = vec3(0.0, 0.0, 0.0);

  const up = vec3(0.0, 1.0, 0.0);

  const viewMatrix = lookAt(eye, at, up);

  const fieldOfViewDegrees = parseFloat(inputFieldOfView.value);

  const fieldOfView = deg2Rad(fieldOfViewDegrees);

  const angleX = parseFloat(inputX.value);

  const angleY = parseFloat(inputY.value);

  const angleZ = parseFloat(inputZ.value);

  outputX.innerHTML = angleX;

  outputY.innerHTML = angleY;

  outputZ.innerHTML = angleZ;

  outputFieldOfView.innerHTML = fieldOfViewDegrees;

  const projectionMatrix = glMatrix.mat4.perspective(new Float32Array(16), fieldOfView, aspectRatio, frustumNearBound, frustumFarBound);

  context.uniformMatrix4fv(worldUniformLocation, context.FALSE, worldMatrix);

  context.uniformMatrix4fv(viewUniformLocation, context.TRUE, flatten(viewMatrix));

  context.uniformMatrix4fv(projectionUniformLocation, context.FALSE, projectionMatrix);

  glMatrix.mat4.identity(worldMatrix);

  glMatrix.mat4.rotate(worldMatrix, worldMatrix, angleX, [1, 0, 0]);

  glMatrix.mat4.rotate(worldMatrix, worldMatrix, angleY, [0, 1, 0]);

  glMatrix.mat4.rotate(worldMatrix, worldMatrix, angleZ, [0, 0, 1]);

  context.uniformMatrix4fv(worldUniformLocation, context.FALSE, worldMatrix);

  clearBackground(context, 0, 0, 0, 1);

  context.activeTexture(context.TEXTURE0);

  context.bindTexture(context.TEXTURE_2D, texture);

  context.drawElements(context.TRIANGLES, indices.length, context.UNSIGNED_SHORT, 0);

  requestAnimationFrame(loop);
};

attachEventListeners(context.canvas);

requestAnimationFrame(loop);

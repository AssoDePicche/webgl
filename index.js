import { indices, vertices } from './src/cube.js';

import { attachEventListeners, cameraState, updateCamera } from './src/input.js';

import { clearBackground, createBuffer, createShader, createTexture, deg2Rad, getGraphicsContext, linkProgram, setupAttribute } from './src/webgl.js';

const getFileContents = async (URL) => await fetch(URL).then((resource) => resource.text());

const vertexShaderSourceCode = await getFileContents('vertex.glsl');

const fragmentShaderSourceCode = await getFileContents('fragment.glsl');

const inputX = document.getElementById('angleX');

const inputY = document.getElementById('angleY');

const inputZ = document.getElementById('angleZ');

const inputFieldOfView = document.getElementById('fieldOfView');

const context = getGraphicsContext();

attachEventListeners(context.canvas);

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

  const eye = vec3(
    radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(theta),
  );

  const at = vec3(0.0, 0.0, 0.0);

  const up = vec3(0.0, 1.0, 0.0);

  const viewMatrix = lookAt(eye, at, up);

  const fieldOfView = deg2Rad(parseFloat(inputFieldOfView.value));

  const angleX = parseFloat(inputX.value);

  const angleY = parseFloat(inputY.value);

  const angleZ = parseFloat(inputZ.value);

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

requestAnimationFrame(loop);

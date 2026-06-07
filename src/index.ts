import * as glMatrix from 'gl-matrix';

import { BLACK } from './color.js';

import { indices, vertices } from './cube.js';

import { getFileContents } from './fs.js';

import { attachEventListeners, cameraState, inputState, updateCamera } from './input.js';

import { formatMatrix, uiState } from './ui.js'

import { deg2Rad } from './utils.js';

import {
    clearBackground,
    createBuffer,
    createShader,
    createTexture,
    getGraphicsContext,
    linkProgram,
    setupAttribute
} from './webgl.js';

const vertexShaderSourceCode = await getFileContents('vertex.glsl');

const fragmentShaderSourceCode = await getFileContents('fragment.glsl');

try {
    const context: WebGLRenderingContext = getGraphicsContext();

    clearBackground(context, BLACK);

    const vertexShader = createShader(context, vertexShaderSourceCode, context.VERTEX_SHADER);

    const fragmentShader = createShader(context, fragmentShaderSourceCode, context.FRAGMENT_SHADER);

    const program = context.createProgram();

    context.attachShader(program, vertexShader);

    context.attachShader(program, fragmentShader);

    linkProgram(context, program);

    createBuffer(context, new Float32Array(vertices), context.ARRAY_BUFFER);

    createBuffer(context, indices, context.ELEMENT_ARRAY_BUFFER);

    setupAttribute(context, program, 'aPosition', 3, 0);

    setupAttribute(context, program, 'textureCoordinates', 2, 3);

    context.useProgram(program);

    const textureURL = 'https://as2.ftcdn.net/jpg/01/99/14/99/1000_F_199149981_RG8gciij11WKAQ5nKi35Xx0ovesLCRaU.jpg';

    const texture = await createTexture(context, textureURL);

    const worldUniformLocation = context.getUniformLocation(program, 'mWorld');

    const worldMatrix = glMatrix.mat4.identity(new Float32Array(16));

    const viewUniformLocation = context.getUniformLocation(program, 'mView');

    const projectionUniformLocation = context.getUniformLocation(program, 'mProjection');

    const aspectRatio = context.canvas.width / context.canvas.height;

    const loop = () => {
        updateCamera();

        const { phi, radius, theta } = cameraState;

        const x = radius * Math.cos(phi) * Math.sin(theta);

        const y = radius * Math.sin(phi);

        const z = radius * Math.cos(phi) * Math.cos(theta);

        const eye = [x, y, z];

        const at = [0.0, 0.0, 0.0];

        const up = [0.0, 1.0, 0.0];

        const viewMatrix = glMatrix.mat4.identity(new Float32Array(16));

        glMatrix.mat4.lookAt(viewMatrix, eye, at, up)

        const fieldOfViewDegrees = parseFloat(inputState.fov!.value);

        const fieldOfView = deg2Rad(fieldOfViewDegrees);

        const angleX = parseFloat(inputState.coords.x!.value);

        const angleY = parseFloat(inputState.coords.y!.value);

        const angleZ = parseFloat(inputState.coords.z!.value);

        const frustumNearBound = parseFloat(inputState.near!.value);

        const frustumFarBound = parseFloat(inputState.far!.value);

        uiState.HUD!.innerHTML = `(${angleX}, ${angleY}, ${angleZ}, ${fieldOfViewDegrees}°, ${frustumNearBound}, ${frustumFarBound})`;

        const projectionMatrix = glMatrix.mat4.perspective(new Float32Array(16), fieldOfView, aspectRatio, frustumNearBound, frustumFarBound);

        if (uiState.enableDebugging) {
            uiState.DEBUG!.innerHTML = `<div>(${inputState.control.isDragging}, ${inputState.control.lastTouchDistance}, ${inputState.control.lastPosition.x}, ${inputState.control.lastPosition.y})</div>`;
            uiState.DEBUG!.innerHTML += `<div>Projection Matrix:<br />${formatMatrix(projectionMatrix)}</div>`;
            uiState.DEBUG!.innerHTML += `<div>View  Matrix:<br />${formatMatrix(viewMatrix)}</div>`;
            uiState.DEBUG!.innerHTML += `<div>World Matrix:<br />${formatMatrix(worldMatrix)}</div>`;
        }

        context.uniformMatrix4fv(worldUniformLocation, false, worldMatrix);

        context.uniformMatrix4fv(viewUniformLocation, false, viewMatrix);

        context.uniformMatrix4fv(projectionUniformLocation, false, projectionMatrix);

        glMatrix.mat4.identity(worldMatrix);

        glMatrix.mat4.rotate(worldMatrix, worldMatrix, angleX, [1, 0, 0]);

        glMatrix.mat4.rotate(worldMatrix, worldMatrix, angleY, [0, 1, 0]);

        glMatrix.mat4.rotate(worldMatrix, worldMatrix, angleZ, [0, 0, 1]);

        context.uniformMatrix4fv(worldUniformLocation, false, worldMatrix);

        context.activeTexture(context.TEXTURE0);

        context.bindTexture(context.TEXTURE_2D, texture);

        context.drawElements(context.TRIANGLES, indices.length, context.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };

    attachEventListeners(context.canvas as HTMLCanvasElement);

    requestAnimationFrame(loop);
} catch (exception) {
    uiState.ERROR!.innerHTML = (exception as Error).message;
}

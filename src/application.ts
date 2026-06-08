import * as glMatrix from 'gl-matrix';

import { Camera } from './camera.js';

import { Context } from './context.js';

import { Debugger } from './debugger.js';

import { Input } from './input.js';

import { Point3D } from './point.js';

import { deg2Rad } from './utils.js';

interface Inputs {
    coordsX: HTMLInputElement;
    coordsY: HTMLInputElement;
    coordsZ: HTMLInputElement;
    fov: HTMLInputElement;
    near: HTMLInputElement;
    far: HTMLInputElement;
}

export class Application {
    private context: Context;

    private camera: Camera;

    private debugger: Debugger;

    private input: Input;

    private inputs: Inputs;

    private worldMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private viewMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private projectionMatrix = glMatrix.mat4.identity(new Float32Array(16));

    public constructor(context: Context) {
        this.context = context;

        this.camera = new Camera({
            minRadius: 1.5,
            maxRadius: 20.0,
            moveSpeed: 0.5,
            sensitivity: 0.1,
            zoomSpeed: 0.5,
        });

        this.debugger = new Debugger('HUD', 'DEBUG', 'error', 'toggleDebugging');

        this.input = new Input(this.context.canvas);

        this.inputs = {
            coordsX: document.getElementById('angleX') as HTMLInputElement,
            coordsY: document.getElementById('angleY') as HTMLInputElement,
            coordsZ: document.getElementById('angleZ') as HTMLInputElement,
            fov: document.getElementById('fieldOfView') as HTMLInputElement,
            near: document.getElementById('nearBound') as HTMLInputElement,
            far: document.getElementById('farBound') as HTMLInputElement,
        };
    }

    public render = (): void => {
        this.camera.update(this.input);

        const eye: Point3D = this.camera.getEyePosition();

        const at: number[] = [0.0, 0.0, 0.0];

        const up: number[] = [0.0, 1.0, 0.0];

        glMatrix.mat4.lookAt(this.viewMatrix, eye.toArray(), at, up);

        const fovDegrees = parseFloat(this.inputs.fov.value);

        const near = parseFloat(this.inputs.near.value);

        const far = parseFloat(this.inputs.far.value);

        const angleX = parseFloat(this.inputs.coordsX.value);

        const angleY = parseFloat(this.inputs.coordsY.value);

        const angleZ = parseFloat(this.inputs.coordsZ.value);

        glMatrix.mat4.perspective(this.projectionMatrix, deg2Rad(fovDegrees), this.context.aspectRatio, near, far);

        glMatrix.mat4.identity(this.worldMatrix);

        glMatrix.mat4.rotate(this.worldMatrix, this.worldMatrix, angleX, [1, 0, 0]);

        glMatrix.mat4.rotate(this.worldMatrix, this.worldMatrix, angleY, [0, 1, 0]);

        glMatrix.mat4.rotate(this.worldMatrix, this.worldMatrix, angleZ, [0, 0, 1]);

        this.context.clear();

        this.context.draw(this.worldMatrix, this.viewMatrix, this.projectionMatrix);

        this.debugger.renderHUD(eye, fovDegrees, near, far);

        if (this.debugger.isDebuggingEnabled) {
            this.debugger.renderInputInfo(this.input.isDragging, this.input.lastTouchDistance, this.input.lastPosition);

            this.debugger.renderMatrices(this.worldMatrix, this.viewMatrix, this.projectionMatrix);
        }

        this.input.flush();

        requestAnimationFrame(() => this.render());
    }
}


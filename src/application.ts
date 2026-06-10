import * as glMatrix from 'gl-matrix';

import { Camera } from './camera.js';

import { Context } from './context.js';

import { Debugger } from './debugger.js';

import { Input } from './input.js';

import { Point3D } from './point.js';

import { deg2Rad } from './utils.js';

export class Application {
    private context: Context;

    private input: Input;

    private camera: Camera = new Camera({
        minRadius: 1.5,
        maxRadius: 20.0,
        moveSpeed: 0.5,
        sensitivity: 0.1,
        zoomSpeed: 0.5,

    });

    private debugger: Debugger = new Debugger('HUD', 'DEBUG', 'error', 'toggleDebugging');

    private worldMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private viewMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private projectionMatrix = glMatrix.mat4.identity(new Float32Array(16));

    public constructor(context: Context) {
        this.context = context;

        this.input = new Input(this.context.canvas);
    }

    public render = (): void => {
        this.camera.update(this.input);

        const eye: Point3D = this.camera.getEyePosition();

        const at: Point3D = new Point3D(0.0, 0.0, 0.0);

        const up: Point3D = new Point3D(0.0, 1.0, 0.0);

        const [angleX, angleY, angleZ] = this.input.rotations;

        const fovDegrees: number = this.input.fieldOfViewDegrees;

        const near: number = this.input.nearBounds;

        const far: number = this.input.farBounds;

        glMatrix.mat4.lookAt(this.viewMatrix, eye.toArray(), at.toArray(), up.toArray());

        glMatrix.mat4.perspective(this.projectionMatrix, deg2Rad(fovDegrees), this.context.aspectRatio, near, far);

        glMatrix.mat4.identity(this.worldMatrix);

        glMatrix.mat4.rotate(this.worldMatrix, this.worldMatrix, angleX, [1, 0, 0]);

        glMatrix.mat4.rotate(this.worldMatrix, this.worldMatrix, angleY, [0, 1, 0]);

        glMatrix.mat4.rotate(this.worldMatrix, this.worldMatrix, angleZ, [0, 0, 1]);

        this.context.clear();

        this.context.draw(this.worldMatrix, this.viewMatrix, this.projectionMatrix);

        this.debugger.renderHUD(eye, at, up, fovDegrees, near, far);

        if (this.debugger.isDebuggingEnabled) {
            this.debugger.renderInputInfo(this.input.isDragging, this.input.lastTouchDistance, this.input.lastPosition);

            this.debugger.renderMatrices(this.worldMatrix, this.viewMatrix, this.projectionMatrix);
        }

        this.input.flush();

        requestAnimationFrame(() => this.render());
    }
}


import * as glMatrix from 'gl-matrix';

import { Camera } from './camera.js';

import { Context } from './context.js';

import { Debugger } from './debugger.js';

import { Input } from './input.js';

import { Point3D } from './point.js';

import { deg2Rad } from './utils.js';

class ApplicationInput {
    private coordsX: HTMLInputElement;

    private coordsY: HTMLInputElement;

    private coordsZ: HTMLInputElement;

    private fov: HTMLInputElement;

    private near: HTMLInputElement;

    private far: HTMLInputElement;

    public constructor() {
        this.coordsX = this.getSlider('angleX');

        this.coordsY = this.getSlider('angleY');

        this.coordsZ = this.getSlider('angleZ');

        this.fov = this.getSlider('fieldOfView');

        this.near = this.getSlider('nearBound');

        this.far = this.getSlider('farBound');
    }

    private getSlider(id: string): HTMLInputElement {
        const element = document.getElementById(id);

        if (!element) throw new Error(`Slider Input Element #${id} was not found in DOM.`);

        return element as HTMLInputElement;
    }

    public get rotations(): [number, number, number] {
        return [
            parseFloat(this.coordsX.value),
            parseFloat(this.coordsY.value),
            parseFloat(this.coordsZ.value)
        ];
    }

    public get fieldOfViewDegrees(): number {
        return parseFloat(this.fov.value);
    }

    public get nearBounds(): number {
        return parseFloat(this.near.value);
    }

    public get farBounds(): number {
        return parseFloat(this.far.value);
    }
}

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

    private appInput: ApplicationInput = new ApplicationInput();

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

        const at: number[] = [0.0, 0.0, 0.0];

        const up: number[] = [0.0, 1.0, 0.0];

        const [angleX, angleY, angleZ] = this.appInput.rotations;

        const fovDegrees: number = this.appInput.fieldOfViewDegrees;

        const near: number = this.appInput.nearBounds;

        const far: number = this.appInput.farBounds;

        glMatrix.mat4.lookAt(this.viewMatrix, eye.toArray(), at, up);

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


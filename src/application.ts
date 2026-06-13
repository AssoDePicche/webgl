import { Camera } from './camera.js';

import { Context } from './context.js';

import { Debugger } from './debugger.js';

import { PointLight } from './light.js';

import { Input } from './input.js';

import { Vector3D } from './vector.js';

export class Application {
    private context: Context;

    private input: Input;

    private camera: Camera;

    private debugger: Debugger = new Debugger('HUD', 'DEBUG', 'error', 'toggleDebugging');

    private light: PointLight;

    public constructor(context: Context) {
        this.context = context;

        this.input = new Input(this.context.canvas);

        this.camera = new Camera({
            minRadius: 1.5,
            maxRadius: 20.0,
            moveSpeed: 0.5,
            sensitivity: 0.1,
            zoomSpeed: 0.5,
        });

        this.light = new PointLight(
            2,
            3,
            0.002,
            new Vector3D(255, 0.09, 0.032)
        );
    }

    public render = (time: number): void => {
        this.camera.update(this.input);

        const [roll, pitch, yaw] = this.input.rotations;

        const fovDegrees: number = this.input.fieldOfViewDegrees;

        const near: number = this.input.nearBounds;

        const far: number = this.input.farBounds;

        this.light.color = this.input.lightColor;

        this.light.update(time);

        this.camera.lookAt(fovDegrees, this.context.aspectRatio, near, far);

        this.camera.rotate(roll, pitch, yaw);

        this.context.clear();

        this.context.draw(this.camera.worldMatrix, this.camera.viewMatrix, this.camera.projectionMatrix, this.light);

        this.debugger.renderHUD(this.camera.eye, this.camera.at, this.camera.up, fovDegrees, near, far);

        if (this.debugger.isDebuggingEnabled) {
            this.debugger.renderInputInfo(this.input.isDragging, this.input.lastTouchDistance, this.input.lastPosition);

            this.debugger.renderMatrices(this.camera.worldMatrix, this.camera.viewMatrix, this.camera.projectionMatrix);
        }

        this.input.flush();

        requestAnimationFrame((time: number) => this.render(time));
    }
}


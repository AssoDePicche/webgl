import { Camera } from './camera.js';

import { Context } from './context.js';

import { Debugger } from './debugger.js';

import { Input } from './input.js';

import { Point3D } from './point.js';

export class Application {
    private context: Context;

    private input: Input;

    private camera: Camera;

    private debugger: Debugger = new Debugger('HUD', 'DEBUG', 'error', 'toggleDebugging');

    private radius: number = 5.0;

    private speed: number = 0.0025;

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
    }

    public render = (time: number): void => {
        this.camera.update(this.input);

        const [roll, pitch, yaw] = this.input.rotations;

        const fovDegrees: number = this.input.fieldOfViewDegrees;

        const near: number = this.input.nearBounds;

        const far: number = this.input.farBounds;

        const theta: number = time * this.speed;

        const lightPosition: Point3D = new Point3D(
            Math.sin(theta) * this.radius,
            2.0,
            Math.cos(theta) * this.radius
        );

        this.camera.lookAt(fovDegrees, this.context.aspectRatio, near, far);

        this.camera.rotate(roll, pitch, yaw);

        this.context.clear();

        this.context.draw(this.camera.worldMatrix, this.camera.viewMatrix, this.camera.projectionMatrix, lightPosition);

        this.debugger.renderHUD(this.camera.eye, this.camera.at, this.camera.up, fovDegrees, near, far);

        if (this.debugger.isDebuggingEnabled) {
            this.debugger.renderInputInfo(this.input.isDragging, this.input.lastTouchDistance, this.input.lastPosition);

            this.debugger.renderMatrices(this.camera.worldMatrix, this.camera.viewMatrix, this.camera.projectionMatrix);
        }

        this.input.flush();

        requestAnimationFrame((time: number) => this.render(time));
    }
}


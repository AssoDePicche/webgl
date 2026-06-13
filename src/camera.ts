import * as glMatrix from 'gl-matrix';

import { Input } from './input.js';

import { Point3D } from './point.js';

import { clamp, deg2Rad } from './utils.js';

export interface CameraSettings {
    minRadius: number;
    maxRadius: number;
    moveSpeed: number;
    sensitivity: number;
    zoomSpeed: number;
}

interface KeyInputEvent {
    triggerKey: string;
    onKeyPress: () => void;
}

export class Camera {
    private phi: number = 0.0;

    private theta: number = 0.0;

    private radius: number = 16.0;

    private settings: CameraSettings;

    private bounds: number = Math.PI / 2.1;

    private _worldMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private _viewMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private _projectionMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private keyInputEvents: KeyInputEvent[];

    public constructor(settings: CameraSettings) {
        this.settings = settings;

        this.keyInputEvents = [
            {
                triggerKey: 'w',
                onKeyPress: () => this.radius -= this.settings.zoomSpeed,
            },
            {
                triggerKey: 'a',
                onKeyPress: () => this.theta -= this.settings.sensitivity,
            },
            {
                triggerKey: 's',
                onKeyPress: () => this.radius += this.settings.zoomSpeed,
            },
            {
                triggerKey: 'd',
                onKeyPress: () => this.theta += this.settings.sensitivity,
            },
        ];
    }

    public update(input: Input): void {
        const dragScale: number = 10; // this.settings.sensitivity;

        if (input.isDragging) {
            this.theta -= deg2Rad(input.deltaX * this.settings.sensitivity * dragScale);

            this.phi += deg2Rad(input.deltaY * this.settings.sensitivity * dragScale);

            this.phi = clamp(this.phi, - this.bounds, this.bounds);
        }

        if (input.deltaZoom !== 0) {
            this.radius -= input.deltaZoom * this.settings.zoomSpeed;
        }

        this.keyInputEvents.forEach(({ triggerKey, onKeyPress }) => {
            if (input.isKeyPressed(triggerKey)) {
                onKeyPress();
            }
        });

        this.radius = clamp(this.radius, this.settings.minRadius, this.settings.maxRadius);
    }

    public get eye(): Point3D {
        return new Point3D(
            this.radius * Math.cos(this.phi) * Math.sin(this.theta),
            this.radius * Math.sin(this.phi),
            this.radius * Math.cos(this.phi) * Math.cos(this.theta)
        );
    }

    public get at(): Point3D {
        return new Point3D(0.0, 0.0, 0.0);
    }

    public get up(): Point3D {
        return new Point3D(0.0, 1.0, 0.0);
    }

    public get projectionMatrix(): glMatrix.mat4 {
        return this._projectionMatrix;
    }

    public get viewMatrix(): glMatrix.mat4 {
        return this._viewMatrix;
    }

    public get worldMatrix(): glMatrix.mat4 {
        return this._worldMatrix;
    }

    public lookAt(fovDegrees: number, aspectRatio: number, near: number, far: number): void {
        glMatrix.mat4.lookAt(this._viewMatrix, this.eye.toArray(), this.at.toArray(), this.up.toArray());

        glMatrix.mat4.perspective(this._projectionMatrix, deg2Rad(fovDegrees), aspectRatio, near, far);
    }

    public rotate(roll: number, pitch: number, yaw: number): void {
        glMatrix.mat4.identity(this._worldMatrix);

        glMatrix.mat4.rotate(this._worldMatrix, this._worldMatrix, roll, [1, 0, 0]);

        glMatrix.mat4.rotate(this._worldMatrix, this._worldMatrix, pitch, [0, 1, 0]);

        glMatrix.mat4.rotate(this._worldMatrix, this._worldMatrix, yaw, [0, 0, 1]);
    }
}

import * as glMatrix from 'gl-matrix';

import { Input } from './input.js';

import { Point3D, Spherical } from './point.js';

import { clamp, deg2Rad } from './utils.js';

export interface CameraSettings {
    aspectRatio: number;
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
    private orbit: Spherical = new Spherical(16, deg2Rad(90), deg2Rad(90));

    private settings: CameraSettings;

    private _at: Point3D = new Point3D(0, 0, 0);

    private _worldMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private _viewMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private _projectionMatrix = glMatrix.mat4.identity(new Float32Array(16));

    private keyInputEvents: KeyInputEvent[];

    public constructor(settings: CameraSettings) {
        this.settings = settings;

        this.keyInputEvents = [
            { triggerKey: 'w', onKeyPress: () => this.zoomIn(this.settings.zoomSpeed) },
            { triggerKey: 'a', onKeyPress: () => this.orbitHorizontal(this.settings.sensitivity) },
            { triggerKey: 's', onKeyPress: () => this.zoomOut(this.settings.zoomSpeed) },
            { triggerKey: 'd', onKeyPress: () => this.orbitHorizontal(-this.settings.sensitivity) },
            { triggerKey: 'i', onKeyPress: () => this._at = this._at.sum(new Point3D(0, this.settings.sensitivity, 0)) },
            { triggerKey: 'j', onKeyPress: () => this._at = this._at.sum(new Point3D(-this.settings.sensitivity, 0, 0)) },
            { triggerKey: 'k', onKeyPress: () => this._at = this._at.sum(new Point3D(0, -this.settings.sensitivity, 0)) },
            { triggerKey: 'l', onKeyPress: () => this._at = this._at.sum(new Point3D(this.settings.sensitivity, 0, 0)) },
        ];
    }

    public update(input: Input): void {
        const dragScale: number = 10; // this.settings.sensitivity;

        if (input.isDragging) {
            this.updateOrbit(
                0,
                deg2Rad(input.deltaX * this.settings.sensitivity * dragScale),
                -deg2Rad(input.deltaY * this.settings.sensitivity * dragScale)
            );
        } else if (input.rotations[0] !== 0 || input.rotations[1] !== 0 || input.rotations[2] !== 0) {
            const [roll, pitch, yaw] = input.rotations;

            this.rotate(roll, pitch, yaw);
        }

        const dRadius: number = input.deltaZoom * this.settings.zoomSpeed;

        if (dRadius > 0) {
            this.zoomIn(dRadius);
        } else {
            this.zoomOut(dRadius);
        }

        this.keyInputEvents.forEach(({ triggerKey, onKeyPress }) => {
            if (input.isKeyPressed(triggerKey)) {
                onKeyPress();
            }
        });

        glMatrix.mat4.lookAt(this._viewMatrix, this.eye.toArray(), this.at.toArray(), this.up.toArray());

        glMatrix.mat4.perspective(this._projectionMatrix, deg2Rad(input.fieldOfViewDegrees), this.settings.aspectRatio, input.nearBounds, input.farBounds);

    }

    public get eye(): Point3D {
        const cartesian: Point3D = this.orbit.cartesian;

        return new Point3D(cartesian.x, cartesian.z, cartesian.y);
    }

    public get at(): Point3D {
        return this._at;
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

    public orbitHorizontal(dTheta: number): void {
        this.updateOrbit(0, dTheta, 0);
    }

    public zoomIn(deltaRadius: number): void {
        this.updateOrbit(-Math.abs(deltaRadius), 0, 0);
    }

    public zoomOut(deltaRadius: number): void {
        this.updateOrbit(Math.abs(deltaRadius), 0, 0);
    }

    private rotate(roll: number, pitch: number, yaw: number): void {
        let radius: number = 16 - deg2Rad(roll);

        let theta: number = deg2Rad(yaw);

        let phi: number = deg2Rad(pitch);

        radius = clamp(radius, this.settings.minRadius, this.settings.maxRadius);

        phi = clamp(phi, 0.01, Math.PI - 0.01);

        this.orbit = new Spherical(radius, theta, phi);
    }

    private updateOrbit(dRadius: number, dTheta: number, dPhi: number): void {
        let radius: number = this.orbit.radius + dRadius;

        let theta: number = this.orbit.theta + dTheta;

        let phi: number = this.orbit.phi + dPhi;

        radius = clamp(radius, this.settings.minRadius, this.settings.maxRadius);

        phi = clamp(phi, 0.01, Math.PI - 0.01);

        this.orbit = new Spherical(radius, theta, phi);
    }
}

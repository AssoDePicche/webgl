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

    private keyInputEvents: KeyInputEvent[] = [
        {
            triggerKey: 'w',
            onKeyPress: () => this.radius -= this.settings.zoomSpeed,
        },
        {
            triggerKey: 'a',
            onKeyPress: () => this.radius += this.settings.zoomSpeed,
        },
        {
            triggerKey: 's',
            onKeyPress: () => this.theta -= this.settings.sensitivity,
        },
        {
            triggerKey: 'd',
            onKeyPress: () => this.theta += this.settings.sensitivity,
        },
    ];

    public constructor(settings: CameraSettings) {
        this.settings = settings;
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

    public getEyePosition(): Point3D {
        return new Point3D(
            this.radius * Math.cos(this.phi) * Math.sin(this.theta),
            this.radius * Math.sin(this.phi),
            this.radius * Math.cos(this.phi) * Math.cos(this.theta)
        );
    }
}

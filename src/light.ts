import { BLACK, type Color } from './color.js';

import { Point3D } from './point.js';

import { Vector3D } from './vector.js';

export class PointLight {
    private _position: Point3D;

    private _color: Color = BLACK;

    public constructor(
        public readonly height: number,
        public readonly radius: number,
        public readonly speed: number,
        public readonly attenuation: Vector3D
    ) {
        this._position = new Point3D(0, height, 3);
    }

    public get color(): Color {
        return this._color;
    }

    public set color(color: Color) {
        this._color = color;
    }

    public get position(): Point3D {
        return this._position;
    }

    public update(time: number): void {
        const theta: number = time * this.speed;

        this._position = new Point3D(
            Math.sin(theta) * this.radius,
            this.height,
            Math.cos(theta) * this.radius
        );
    }
}

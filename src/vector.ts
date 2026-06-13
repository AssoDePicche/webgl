import { Point3D } from './point.js';

export class Vector3D {
    public readonly length: number;

    public readonly x: number;

    public readonly y: number;

    public readonly z: number;

    public constructor(x: number, y: number, z: number) {
        this.x = x;

        this.y = y;

        this.z = z;

        this.length = Math.sqrt(x * x + y * y + z * z);
    }

    public static of(point: Point3D): Vector3D {
        return new Vector3D(point.x, point.y, point.z);
    }

    public dot(vector: Vector3D): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    public normalize(): Vector3D {
        if (this.length === 1) {
            return this;
        }

        return new Vector3D(this.x / this.length, this.y / this.length, this.z / this.length);
    }
}

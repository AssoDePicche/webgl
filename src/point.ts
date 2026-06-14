import { Vector3D } from './vector.js';

export abstract class Point {
    private _x: number;

    private _y: number;

    public constructor(x: number, y: number) {
        this._x = x;

        this._y = y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public euclidian(point: Point): number {
        const dx: number = this.x - point.x;

        const dy: number = this.y - point.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    public toArray(): number[] {
        return [this._x, this._y];
    }
}

export class Point2D extends Point {
    public constructor(x: number, y: number) {
        super(x, y);
    }
}

export class Point3D extends Point2D {
    public static readonly PLANE_XY_NORMAL: Vector3D = new Vector3D(0, 0, 1);

    public static readonly PLANE_XZ_NORMAL: Vector3D = new Vector3D(0, 1, 0);

    public static readonly PLANE_YZ_NORMAL: Vector3D = new Vector3D(1, 0, 0);

    private _z: number;

    public constructor(x: number, y: number, z: number) {
        super(x, y);

        this._z = z;
    }

    public get z(): number {
        return this._z;
    }

    public euclidian(point: Point3D): number {
        const dx: number = this.x - point.x;

        const dy: number = this.y - point.y;

        const dz: number = this.z - point.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    public reflect(planeNormal: Vector3D): Point3D {
        const normal: Vector3D = planeNormal.normalize();

        const dotProduct: number = Vector3D.of(this).dot(normal);

        return new Point3D(
            this.x - 2 * dotProduct * normal.x,
            this.y - 2 * dotProduct * normal.y,
            this.z - 2 * dotProduct * normal.z,
        );
    }

    public spherical(): Spherical {
        const origin: Point3D = new Point3D(0, 0, 0);

        const radius: number = this.euclidian(origin);

        return new Spherical(
            radius,
            Math.atan2(this.y, this.x),
            Math.acos(this.z / radius)
        );
    }

    public toArray(): number[] {
        return [this.x, this.y, this._z];
    }
}

export class Spherical {
    public constructor(
        public readonly radius: number,
        public readonly theta: number,
        public readonly phi: number
    ) { }

    public get cartesian(): Point3D {
        return new Point3D(
            this.radius * Math.sin(this.phi) * Math.cos(this.theta),
            this.radius * Math.sin(this.phi) * Math.sin(this.theta),
            this.radius * Math.cos(this.phi)
        );
    }
}

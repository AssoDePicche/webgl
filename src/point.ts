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

    public toArray(): number[] {
        return [this.x, this.y, this._z];
    }
}

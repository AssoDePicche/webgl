import { Point3D } from './point.js';

import { Quaternion } from './quaternion.js';

import { Vector3D } from './vector.js';

export class Transform {
    private _position: Point3D;

    private _rotation: Quaternion;

    private _scale: Vector3D;

    public constructor(
        position: Point3D = new Point3D(0, 0, 0),
        rotation: Quaternion = new Quaternion(0, 0, 0, 0),
        scale: Vector3D = new Vector3D(1, 1, 1)
    ) {
        this._position = position;

        this._rotation = rotation;

        this._scale = scale;
    }

    public get position(): Point3D {
        return this._position;
    }

    public get rotation(): Quaternion {
        return this._rotation;
    }

    public get scale(): Vector3D {
        return this._scale;
    }
}

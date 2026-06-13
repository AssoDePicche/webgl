import { Point2D, Point3D } from './point.js';

import { Vector3D } from './vector.js';

export class Vertex {
    public static readonly XYZ_FRONT_BOTTOM_LEFT: Point3D = new Point3D(-1, -1, 1);
    public static readonly XYZ_FRONT_BOTTOM_RIGHT: Point3D = new Point3D(1, -1, 1);
    public static readonly XYZ_FRONT_TOP_RIGHT: Point3D = new Point3D(1, 1, 1);
    public static readonly XYZ_FRONT_TOP_LEFT: Point3D = new Point3D(-1, 1, 1);

    public static readonly XYZ_BACK_BOTTOM_LEFT: Point3D = this.XYZ_FRONT_BOTTOM_LEFT.reflect(Point3D.PLANE_XY_NORMAL);
    public static readonly XYZ_BACK_BOTTOM_RIGHT: Point3D = this.XYZ_FRONT_BOTTOM_RIGHT.reflect(Point3D.PLANE_XY_NORMAL);
    public static readonly XYZ_BACK_TOP_RIGHT: Point3D = this.XYZ_FRONT_TOP_RIGHT.reflect(Point3D.PLANE_XY_NORMAL);
    public static readonly XYZ_BACK_TOP_LEFT: Point3D = this.XYZ_FRONT_TOP_LEFT.reflect(Point3D.PLANE_XY_NORMAL);

    public static readonly XYZ_TOP_FRONT_LEFT: Point3D = new Point3D(-1, 1, 1);
    public static readonly XYZ_TOP_FRONT_RIGHT: Point3D = new Point3D(1, 1, 1);
    public static readonly XYZ_TOP_BACK_RIGHT: Point3D = new Point3D(1, 1, -1);
    public static readonly XYZ_TOP_BACK_LEFT: Point3D = new Point3D(-1, 1, -1);

    public static readonly XYZ_BOTTOM_BOTTOM_LEFT: Point3D = this.XYZ_TOP_FRONT_LEFT.reflect(Point3D.PLANE_XZ_NORMAL);
    public static readonly XYZ_BOTTOM_BOTTOM_RIGHT: Point3D = this.XYZ_TOP_FRONT_RIGHT.reflect(Point3D.PLANE_XZ_NORMAL);
    public static readonly XYZ_BOTTOM_TOP_RIGHT: Point3D = this.XYZ_TOP_BACK_RIGHT.reflect(Point3D.PLANE_XZ_NORMAL);
    public static readonly XYZ_BOTTOM_TOP_LEFT: Point3D = this.XYZ_TOP_BACK_LEFT.reflect(Point3D.PLANE_XZ_NORMAL);

    public static readonly XYZ_RIGHT_BOTTOM_LEFT: Point3D = new Point3D(1, -1, 1);
    public static readonly XYZ_RIGHT_BOTTOM_RIGHT: Point3D = new Point3D(1, -1, -1);
    public static readonly XYZ_RIGHT_TOP_RIGHT: Point3D = new Point3D(1, 1, -1);
    public static readonly XYZ_RIGHT_TOP_LEFT: Point3D = new Point3D(1, 1, 1);

    public static readonly XYZ_LEFT_BOTTOM_LEFT: Point3D = this.XYZ_RIGHT_BOTTOM_LEFT.reflect(Point3D.PLANE_YZ_NORMAL);
    public static readonly XYZ_LEFT_BOTTOM_RIGHT: Point3D = this.XYZ_RIGHT_BOTTOM_RIGHT.reflect(Point3D.PLANE_YZ_NORMAL);
    public static readonly XYZ_LEFT_TOP_RIGHT: Point3D = this.XYZ_RIGHT_TOP_RIGHT.reflect(Point3D.PLANE_YZ_NORMAL);
    public static readonly XYZ_LEFT_TOP_LEFT: Point3D = this.XYZ_RIGHT_TOP_LEFT.reflect(Point3D.PLANE_YZ_NORMAL);

    public static readonly UV_BOTTOM_LEFT: Point2D = new Point2D(0, 0);
    public static readonly UV_BOTTOM_RIGHT: Point2D = new Point2D(1, 0);
    public static readonly UV_TOP_RIGHT: Point2D = new Point2D(1, 1);
    public static readonly UV_TOP_LEFT: Point2D = new Point2D(0, 1);

    public constructor(
        public readonly position: Point3D,
        public readonly uv: Point2D
    ) {
    }

    public reflect(planeNormal: Vector3D): Vertex {
        return new Vertex(
            this.position.reflect(planeNormal),
            this.uv
        );
    }

    public toArray(): number[] {
        return [
            ...this.position.toArray(),
            ...this.uv.toArray(),
        ];
    }
}

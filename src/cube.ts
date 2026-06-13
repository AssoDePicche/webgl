import { Point3D } from './point.js';

import { Vector3D } from './vector.js';

import { Vertex } from './vertex.js';

class CubeFace {
    public constructor(
        public readonly bottomLeft: Vertex,
        public readonly bottomRight: Vertex,
        public readonly topRight: Vertex,
        public readonly topLeft: Vertex,
    ) { }

    public normal(): Vector3D {
        const AB: Vector3D = Vector3D.from(this.bottomLeft.position, this.bottomRight.position);

        const AC: Vector3D = Vector3D.from(this.bottomRight.position, this.topRight.position);

        return AB.cross(AC).normalize();
    }

    public reflect(planeNormal: Vector3D): CubeFace {
        return new CubeFace(
            this.bottomLeft.reflect(planeNormal),
            this.bottomRight.reflect(planeNormal),
            this.topRight.reflect(planeNormal),
            this.topLeft.reflect(planeNormal)
        );
    }

    public toArray(): number[] {
        const normal: Vector3D = this.normal();

        const flatVertexWithNormal = (vertex: Vertex): number[] => {
            return [
                vertex.position.x,
                vertex.position.y,
                vertex.position.z,
                normal.x,
                normal.y,
                normal.z,
                vertex.uv.x,
                vertex.uv.y,
            ];
        };

        return [
            ...flatVertexWithNormal(this.bottomLeft),
            ...flatVertexWithNormal(this.bottomRight),
            ...flatVertexWithNormal(this.topRight),
            ...flatVertexWithNormal(this.topLeft),
        ].flat();
    }
}

export class Cube {
    public static readonly FACES: number = 6;
    public static readonly INDICES_PER_FACE: number = 6;
    public static readonly STRIDE: number = 8;
    public static readonly TOTAL_INDICES: number = 36;
    public static readonly TOTAL_VERTICES: number = 24;
    public static readonly VERTICES_PER_FACE: number = 4;

    public static readonly indices: Uint16Array = Cube.createCubeIndices();
    public static readonly vertices: Float32Array = Cube.createCubeVertices();

    private static createCubeIndices(): Uint16Array {
        const createCubeFaceIndices = (faceIndex: number): number[] => {
            const offset = faceIndex * Cube.VERTICES_PER_FACE;

            return [
                offset, offset + 1, offset + 2,
                offset, offset + 2, offset + 3,
            ];
        };

        const indices: number[] = Array.from({ length: Cube.FACES }, (_, faceIndex: number) => createCubeFaceIndices(faceIndex)).flat();

        return new Uint16Array(indices);
    };

    private static createCubeVertices(): Float32Array {
        const frontCubeFace: CubeFace = new CubeFace(
            new Vertex(Vertex.XYZ_FRONT_BOTTOM_LEFT, Vertex.UV_BOTTOM_LEFT),
            new Vertex(Vertex.XYZ_FRONT_BOTTOM_RIGHT, Vertex.UV_BOTTOM_RIGHT),
            new Vertex(Vertex.XYZ_FRONT_TOP_RIGHT, Vertex.UV_TOP_RIGHT),
            new Vertex(Vertex.XYZ_FRONT_TOP_LEFT, Vertex.UV_TOP_LEFT)
        );

        const topCubeFace: CubeFace = new CubeFace(
            new Vertex(Vertex.XYZ_TOP_FRONT_LEFT, Vertex.UV_BOTTOM_LEFT),
            new Vertex(Vertex.XYZ_TOP_FRONT_RIGHT, Vertex.UV_BOTTOM_RIGHT),
            new Vertex(Vertex.XYZ_TOP_BACK_RIGHT, Vertex.UV_TOP_RIGHT),
            new Vertex(Vertex.XYZ_TOP_BACK_LEFT, Vertex.UV_TOP_LEFT)
        );

        const rightCubeFace: CubeFace = new CubeFace(
            new Vertex(Vertex.XYZ_RIGHT_BOTTOM_LEFT, Vertex.UV_BOTTOM_LEFT),
            new Vertex(Vertex.XYZ_RIGHT_BOTTOM_RIGHT, Vertex.UV_BOTTOM_RIGHT),
            new Vertex(Vertex.XYZ_RIGHT_TOP_RIGHT, Vertex.UV_TOP_RIGHT),
            new Vertex(Vertex.XYZ_RIGHT_TOP_LEFT, Vertex.UV_TOP_LEFT)
        );

        const faces: CubeFace[] = [
            frontCubeFace,
            frontCubeFace.reflect(Point3D.PLANE_XY_NORMAL).reflect(Point3D.PLANE_XZ_NORMAL),
            topCubeFace,
            topCubeFace.reflect(Point3D.PLANE_XZ_NORMAL).reflect(Point3D.PLANE_XY_NORMAL),
            rightCubeFace,
            rightCubeFace.reflect(Point3D.PLANE_YZ_NORMAL).reflect(Point3D.PLANE_XY_NORMAL),
        ];

        const vertices: number[] = faces.map((face: CubeFace) => face.toArray()).flat();

        return new Float32Array(vertices);
    }
}

export class Gizmo {
    public static readonly indices: Uint16Array = Gizmo.createGizmoIndices();
    public static readonly vertices: Float32Array = Gizmo.createGizmoVertices();

    private static createGizmoIndices(): Uint16Array {
        const baseCubeIndices = [
            0, 1, 2, 0, 2, 3,  // Front
            4, 5, 6, 4, 6, 7,  // Back
            8, 9, 10, 8, 10, 11, // Top
            12, 13, 14, 12, 14, 15, // Bottom
            16, 17, 18, 16, 18, 19, // Right
            20, 21, 22, 20, 22, 23  // Left
        ];

        const totalIndices = new Uint16Array(108);
        for (let block = 0; block < 3; block++) {
            const indexOffset = block * 36;
            const vertexOffset = block * 24;
            for (let i = 0; i < 36; i++) {
                totalIndices[indexOffset + i] = baseCubeIndices[i]! + vertexOffset;
            }
        }
        return totalIndices;
    }

    private static createGizmoVertices(): Float32Array {
        const vertices: number[] = [];

        const addBox = (scale: number[], shift: number[], axisIndex: number) => {
            const rawPositions = [
                // Front
                [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5],
                // Back
                [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], [0.5, -0.5, -0.5],
                // Top
                [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5],
                // Bottom
                [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5],
                // Right
                [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5],
                // Left
                [-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]
            ];

            const rawNormals = [
                [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1],       // Front
                [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1],   // Back
                [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],       // Top
                [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0],   // Bottom
                [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],       // Right
                [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0]    // Left
            ];

            const rawUVs = [
                [0, 0], [1, 0], [1, 1], [0, 1]
            ];

            for (let i = 0; i < 24; i++) {
                const x = rawPositions[i]![0]! * scale[0]! + shift[0]!;
                const y = rawPositions[i]![1]! * scale[1]! + shift[1]!;
                const z = rawPositions[i]![2]! * scale[2]! + shift[2]!;

                const nx = rawNormals[i]![0]!;
                const ny = rawNormals[i]![1]!;
                const nz = rawNormals[i]![2]!;

                const uvIndex = i % 4;
                const u = (rawUVs[uvIndex]![0]! / 3) + (axisIndex / 3);
                const v = rawUVs[uvIndex]![1]!;

                vertices.push(x, y, z, nx, ny, nz, u, v);
            }
        };

        addBox([0.7, 0.06, 0.06], [0.35, 0.0, 0.0], 0); // X Axis (Red)
        addBox([0.06, 0.7, 0.06], [0.0, 0.35, 0.0], 1); // Y Axis (Green)
        addBox([0.06, 0.06, 0.7], [0.0, 0.0, 0.35], 2); // Z Axis (Blue)

        return new Float32Array(vertices);
    }
}

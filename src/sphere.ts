export class Sphere {
    private constructor(
        public readonly indices: Uint16Array,
        public readonly vertices: Float32Array,
        public readonly stride: number
    ) { }

    public static createSphere(radius: number, latitudeBands: number, longitudeBands: number): Sphere {
        const stride: number = 5;

        const vertices = [];

        const indices = [];

        for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            const theta = (latNumber * Math.PI) / latitudeBands;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                const phi = (longNumber * 2 * Math.PI) / longitudeBands;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                // Normal coordinates (x, y, z unit vector)
                const nx = cosPhi * sinTheta;
                const ny = cosTheta;
                const nz = sinPhi * sinTheta;

                // Position coordinates
                const x = radius * nx;
                const y = radius * ny;
                const z = radius * nz;

                // Texture coordinates (u, v)
                const u = 1 - (longNumber / longitudeBands);
                const v = 1 - (latNumber / latitudeBands);

                // Push matching your interleaved layout structured like your Cube data:
                // [pos.x, pos.y, pos.z, tex.u, tex.v]
                vertices.push(x, y, z, u, v);
            }
        }

        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                const first = (latNumber * (longitudeBands + 1)) + longNumber;
                const second = first + longitudeBands + 1;

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }

        }

        return new Sphere(new Uint16Array(indices), new Float32Array(vertices), stride);
    }
}

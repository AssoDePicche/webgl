import { Cube } from './cube.js';

describe('Cube Geometry Generation', () => {
    it('should have the correct length for vertices and indices', () => {
        expect(Cube.vertices).toHaveLength(Cube.TOTAL_VERTICES * Cube.STRIDE);

        expect(Cube.indices).toHaveLength(Cube.TOTAL_INDICES);
    });

    it('should maintain valid index bounds', () => {
        const maxIndex = (Cube.vertices.length / Cube.STRIDE) - 1;

        Cube.indices.forEach(index => {
            expect(index).toBeGreaterThanOrEqual(0);

            expect(index).toBeLessThanOrEqual(maxIndex);
        });
    });
});

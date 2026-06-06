import { CUBE_GEOMETRY, indices, vertices } from './cube.js';

describe('Cube Geometry Generation', () => {
  it('should have the correct length for vertices and indices', () => {
    expect(vertices).toHaveLength(CUBE_GEOMETRY.TOTAL_VERTICES * CUBE_GEOMETRY.STRIDE);

    expect(indices).toHaveLength(CUBE_GEOMETRY.TOTAL_INDICES);
  });

  it('should maintain valid index bounds', () => {
    const maxIndex = (vertices.length / CUBE_GEOMETRY.STRIDE) - 1;

    indices.forEach(index => {
      expect(index).toBeGreaterThanOrEqual(0);

      expect(index).toBeLessThanOrEqual(maxIndex);
    });
  });
});

import { indices, vertices } from './cube.js';

describe('Cube Geometry Generation', () => {
  const STRIDE = 5;

  const VERTICES_PER_FACE = 4;

  const FACES_COUNT = 6;

  it('should have the correct length for vertices and indices', () => {
    const expectedTotalVertices = VERTICES_PER_FACE * FACES_COUNT;

    expect(vertices).toHaveLength(expectedTotalVertices * STRIDE);

    expect(indices).toHaveLength(FACES_COUNT * 2 * 3);
  });

  it('should maintain valid index bounds', () => {
    const maxIndex = (vertices.length / STRIDE) - 1;

    indices.forEach(index => {
      expect(index).toBeGreaterThanOrEqual(0);

      expect(index).toBeLessThanOrEqual(maxIndex);
    });
  });

  it('should match the exact geometric data snapshot', () => {
    expect(vertices).toMatchSnapshot();

    expect(indices).toMatchSnapshot();
  });
});

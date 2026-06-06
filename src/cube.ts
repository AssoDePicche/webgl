// X, Y, Z, U, V
export const vertices = [
  // Front Face (Looking straight at +Z)
  -1.0, -1.0,  1.0,   0, 0, // 0: Bottom-Left
   1.0, -1.0,  1.0,   1, 0, // 1: Bottom-Right
   1.0,  1.0,  1.0,   1, 1, // 2: Top-Right
  -1.0,  1.0,  1.0,   0, 1, // 3: Top-Left

  // Back Face (Looking straight at -Z - Fixed Winding and UVs)
   1.0, -1.0, -1.0,   0, 0, // 4: Bottom-Left (from back perspective)
  -1.0, -1.0, -1.0,   1, 0, // 5: Bottom-Right
  -1.0,  1.0, -1.0,   1, 1, // 6: Top-Right
   1.0,  1.0, -1.0,   0, 1, // 7: Top-Left

  // Top Face (Looking straight down at +Y)
  -1.0,  1.0,  1.0,   0, 0, // 8: Front-Left
   1.0,  1.0,  1.0,   1, 0, // 9: Front-Right
   1.0,  1.0, -1.0,   1, 1, // 10: Back-Right
  -1.0,  1.0, -1.0,   0, 1, // 11: Back-Left

  // Bottom Face (Looking straight up at -Y)
  -1.0, -1.0, -1.0,   0, 0, // 12: Back-Left
   1.0, -1.0, -1.0,   1, 0, // 13: Back-Right
   1.0, -1.0,  1.0,   1, 1, // 14: Front-Right
  -1.0, -1.0,  1.0,   0, 1, // 15: Front-Left

  // Right Face (Looking straight at +X)
   1.0, -1.0,  1.0,   0, 0, // 16: Front-Bottom
   1.0, -1.0, -1.0,   1, 0, // 17: Back-Bottom
   1.0,  1.0, -1.0,   1, 1, // 18: Back-Top
   1.0,  1.0,  1.0,   0, 1, // 19: Front-Top

  // Left Face (Looking straight at -X)
  -1.0, -1.0, -1.0,   0, 0, // 20: Back-Bottom
  -1.0, -1.0,  1.0,   1, 0, // 21: Front-Bottom
  -1.0,  1.0,  1.0,   1, 1, // 22: Front-Top
  -1.0,  1.0, -1.0,   0, 1, // 23: Back-Top
];

export const CUBE_GEOMETRY = Object.freeze({
  FACES: 6,
  INDICES_PER_FACE: 6,
  STRIDE: 5,
  TOTAL_INDICES: 36,
  TOTAL_VERTICES: 24,
  VERTICES_PER_FACE: 4,
});

const createCubeIndices = () => {
  const createFaceIndices = (faceIndex) => {
    const offset = faceIndex * CUBE_GEOMETRY.VERTICES_PER_FACE;

    return [
      offset, offset + 1, offset + 2,
      offset, offset + 2, offset + 3,
    ];
  };

  const indices = Array.from({ length: CUBE_GEOMETRY.FACES }, (_, faceIndex) => createFaceIndices(faceIndex)).flat();

  return new Uint16Array(indices);
};

export const indices = createCubeIndices();

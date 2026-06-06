// X, Y, Z, U, V
export const vertices = [
  // Front Face
  -1.0, -1.0,  1.0,   0, 0, // 0: Bottom-Left
   1.0, -1.0,  1.0,   1, 0, // 1: Bottom-Right
   1.0,  1.0,  1.0,   1, 1, // 2: Top-Right
  -1.0,  1.0,  1.0,   0, 1, // 3: Top-Left

  // Back Face
  -1.0, -1.0, -1.0,   1, 0, // 4: Bottom-Left (Flipped U for wrapping)
  -1.0,  1.0, -1.0,   1, 1, // 5: Top-Left
   1.0,  1.0, -1.0,   0, 1, // 6: Top-Right
   1.0, -1.0, -1.0,   0, 0, // 7: Bottom-Right

  // Top Face
  -1.0,  1.0,  1.0,   0, 0, // 8: Front-Left
   1.0,  1.0,  1.0,   1, 0, // 9: Front-Right
   1.0,  1.0, -1.0,   1, 1, // 10: Back-Right
  -1.0,  1.0, -1.0,   0, 1, // 11: Back-Left

  // Bottom Face
  -1.0, -1.0, -1.0,   0, 0, // 12: Back-Left
   1.0, -1.0, -1.0,   1, 0, // 13: Back-Right
   1.0, -1.0,  1.0,   1, 1, // 14: Front-Right
  -1.0, -1.0,  1.0,   0, 1, // 15: Front-Left

  // Right Face
   1.0, -1.0,  1.0,   0, 0, // 16: Front-Bottom
   1.0, -1.0, -1.0,   1, 0, // 17: Back-Bottom
   1.0,  1.0, -1.0,   1, 1, // 18: Back-Top
   1.0,  1.0,  1.0,   0, 1, // 19: Front-Top

  // Left Face
  -1.0, -1.0, -1.0,   0, 0, // 20: Back-Bottom
  -1.0, -1.0,  1.0,   1, 0, // 21: Front-Bottom
  -1.0,  1.0,  1.0,   1, 1, // 22: Front-Top
  -1.0,  1.0, -1.0,   0, 1, // 23: Back-Top
];

const CUBE_GEOMETRY = Object.freeze({
  FACES: 6,
  INDICES_PER_FACE: 6,
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

  return Array.from({ length: CUBE_GEOMETRY.FACES }, (_, faceIndex) => createFaceIndices(faceIndex)).flat();
};

export const indices = createCubeIndices();

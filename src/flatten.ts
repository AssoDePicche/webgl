// Helper type guards to check structural signatures
function isVector(v: any): boolean {
  return v && typeof v.length === 'number' && (v.length === 2 || v.length === 3 || v.length === 4) && typeof v[0] === 'number';
}

function isMatrix(v: any): boolean {
  return v && typeof v.length === 'number' && v[0] && typeof v[0].length === 'number' && v.length === v[0].length;
}

export function flatten(v: any): Float32Array {
  if (isVector(v)) {
    const floats = new Float32Array(v.length);
    for (let i = 0; i < v.length; i++) {
      floats[i] = v[i];
    }
    return floats;
  }
  
  if (isMatrix(v)) {
    const floats = new Float32Array(v.length * v.length);
    for (let i = 0; i < v.length; i++) {
      // Fixed: 'let j' ensures j doesn't leak into the global scope
      for (let j = 0; j < v.length; j++) {
        floats[i * v.length + j] = v[j][i];
      }
    }
    return floats;
  }

  // Fallback for arrays of vectors/arrays
  if (v && v.length > 0 && v[0] && typeof v[0].length === 'number') {
    const floats = new Float32Array(v.length * v[0].length);
    for (let i = 0; i < v.length; i++) {
      for (let j = 0; j < v[0].length; j++) {
        floats[i * v[0].length + j] = v[i][j];
      }
    }
    return floats;
  }

  // Fallback if a flat array or Float32Array was passed directly
  return v instanceof Float32Array ? v : new Float32Array(v);
}

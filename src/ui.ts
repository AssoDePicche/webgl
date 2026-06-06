import * as glMatrix from 'gl-matrix';

import { flatten } from './flatten.js';

export const formatMatrix = (matrix: glMatrix.mat4 | Float32Array | number[]) => {
  const array = flatten(matrix);

  let buffer = '<table>';

  for (let index = 0; index < array.length; index += 4) {
    buffer += '<tr>';

    array.slice(index, index + 4).forEach((cell: number) => {
      buffer += '<td>';

      buffer += cell.toFixed(2);

      buffer += '</td>';
    });

    buffer += '</tr>';
  }
  
  buffer += '</table>';

  return buffer;
};

export const uiState = {
  HUD: document.getElementById('HUD'),
  DEBUG: document.getElementById('DEBUG'),
  ERROR: document.getElementById('error'),
  enableDebugging: false,
};

const toggleDebugging = document.getElementById('toggleDebugging');

uiState.DEBUG!.innerHTML = '';

toggleDebugging!.innerHTML = 'Show Debugging';

toggleDebugging!.addEventListener('click', () => {
  uiState.enableDebugging = !uiState.enableDebugging;

  toggleDebugging!.innerHTML = uiState.enableDebugging ? 'Hide Debugging' : 'Show Debugging';

  if (!uiState.enableDebugging) {
    uiState.DEBUG!.innerHTML = '';
  }
});

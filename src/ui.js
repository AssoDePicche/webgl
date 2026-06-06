export const formatMatrix = (matrix) => {
  const array = (matrix.length !== 16) ? flatten(matrix) : matrix;

  let buffer = '<table>';

  for (let index = 0; index < array.length; index += 4) {
    buffer += '<tr>';

    array.slice(index, index + 4).forEach((cell) => {
      buffer += '<td>';

      buffer += cell.toFixed(2);

      buffer += '</td>';
    });

    buffer += '</tr>';
  }
  
  buffer += '</table>';

  return buffer;
};

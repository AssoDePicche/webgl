const vertexShaderSourceCode = [
  "precision mediump float;",
  "attribute vec2 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "void main() {",
  "fragColor = vertColor;",
  "gl_Position = vec4(vertPosition, 0.0, 1.0);",
  "}",
].join("\n");

const fragmentShaderSourceCode = [
  "precision mediump float;",
  "varying vec3 fragColor;",
  "void main() {",
  "gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n");

const canvas = document.getElementById("canvas");

const context = canvas.getContext("webgl");

if (!context) {
  console.log("WebGL Not Supported, trying experimental-webgl");

  context = canvas.getContext("experimental-webgl");
}

if (!context) {
  console.log("Your Browser Does Not Support WebGL");
}

context.clearColor(0, 0, 0, 1);

context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

const vertexShader = context.createShader(context.VERTEX_SHADER);

const fragmentShader = context.createShader(context.FRAGMENT_SHADER);

context.shaderSource(vertexShader, vertexShaderSourceCode);

context.compileShader(vertexShader);

if (!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
  console.error("Error Compiling Vertex Shader: ", context.getShaderInfoLog(vertexShader));
}

context.shaderSource(fragmentShader, fragmentShaderSourceCode);

context.compileShader(fragmentShader);

if (!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)) {
  console.error("Error Compiling Fragment Shader: ", context.getShaderInfoLog(fragmentShader));
}

const program = context.createProgram();

context.attachShader(program, vertexShader);

context.attachShader(program, fragmentShader);

context.linkProgram(program);

if (!context.getProgramParameter(program, context.LINK_STATUS)) {
  console.error("Error Linking Program: ", context.getProgramInfoLog(program));
}

context.validateProgram(program);

if (!context.getProgramParameter(program, context.VALIDATE_STATUS)) {
  console.error("Error Validating Program: ", context.getProgramInfoLog(program));
}

const triangleVertices = [
  0.0, 0.5, 1.0, 1.0, 1.0,
  -0.5, -0.5, 0.7, 0.0, 1.0,
  0.5, -0.5, 0.1, 1.0, 0.6,
];

const triangleVerticesBuffer = context.createBuffer();

context.bindBuffer(context.ARRAY_BUFFER, triangleVerticesBuffer);

context.bufferData(context.ARRAY_BUFFER, new Float32Array(triangleVertices), context.STATIC_DRAW);

const positionAttributeLocation = context.getAttribLocation(program, "vertPosition");

const colorAttributeLocation = context.getAttribLocation(program, "vertColor");

context.vertexAttribPointer(
  positionAttributeLocation,
  2,
  context.FLOAT,
  context.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT,
  0
);

context.vertexAttribPointer(
  colorAttributeLocation,
  3,
  context.FLOAT,
  context.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT,
  2 * Float32Array.BYTES_PER_ELEMENT
);

context.enableVertexAttribArray(positionAttributeLocation);

context.enableVertexAttribArray(colorAttributeLocation);

context.useProgram(program);

context.drawArrays(context.TRIANGLES, 0, 3);

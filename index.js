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

const getGraphicsContext = () => {
  const canvas = document.getElementById("canvas");

  const context = canvas.getContext("webgl");

  if (!context) {
    console.log("WebGL Not Supported, trying experimental-webgl");

    context = canvas.getContext("experimental-webgl");
  }

  if (!context) {
    console.log("Your Browser Does Not Support WebGL");

    throw Error("Your Browser Does Not Support WebGL");
  }

  return context;
}

const createShader = (context, source, shaderType) => {
  const shader = context.createShader(shaderType);

  context.shaderSource(shader, source);

  context.compileShader(shader);

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    console.error("Error Compiling Shader: ", context.getShaderInfoLog(shader));
  }

  return shader;
};

const setupAttribute = (context, program, attribute, size, offset) => {
  const attributeLocation = context.getAttribLocation(program, attribute);

  context.vertexAttribPointer(
    attributeLocation,
    size,
    context.FLOAT,
    context.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    offset * Float32Array.BYTES_PER_ELEMENT
  );

  context.enableVertexAttribArray(attributeLocation);
};

const clearBackground = (context, red, green, blue, alpha) => {
  context.clearColor(red, green, blue, alpha);

  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
};

const linkProgram = (context, program) => {
  context.linkProgram(program);

  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    console.error("Error Linking Program: ", context.getProgramInfoLog(program));
  }

  context.validateProgram(program);

  if (!context.getProgramParameter(program, context.VALIDATE_STATUS)) {
    console.error("Error Validating Program: ", context.getProgramInfoLog(program));
  }
};

const context = getGraphicsContext();

clearBackground(context, 0, 0, 0, 1);

const vertexShader = createShader(context, vertexShaderSourceCode, context.VERTEX_SHADER);

const fragmentShader = createShader(context, fragmentShaderSourceCode, context.FRAGMENT_SHADER);

const program = context.createProgram();

context.attachShader(program, vertexShader);

context.attachShader(program, fragmentShader);

linkProgram(context, program);

const triangleVertices = [
  0.0, 0.25, 1.0, 1.0, 1.0,
  -0.25, -0.25, 0.7, 0.0, 1.0,
  0.25, -0.25, 0.1, 1.0, 0.6,
];

const triangleVerticesBuffer = context.createBuffer();

context.bindBuffer(context.ARRAY_BUFFER, triangleVerticesBuffer);

context.bufferData(context.ARRAY_BUFFER, new Float32Array(triangleVertices), context.STATIC_DRAW);

setupAttribute(context, program, "vertPosition", 2, 0);

setupAttribute(context, program, "vertColor", 3, 2);

context.useProgram(program);

context.drawArrays(context.TRIANGLES, 0, 3);

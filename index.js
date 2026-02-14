const vertexShaderSourceCode = [
  "precision mediump float;",
  "attribute vec3 vertPosition;",
  "attribute vec2 vertTextureCoord;",
  "uniform mat4 mWorld;",
  "uniform mat4 mView;",
  "uniform mat4 mProjection;",
  "varying vec2 fragTextureCoord;",
  "void main() {",
  "fragTextureCoord = vertTextureCoord;",
  "gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);",
  "}",
].join("\n");

const fragmentShaderSourceCode = [
  "precision mediump float;",
  "varying vec2 fragTextureCoord;",
  "uniform sampler2D sampler;",
  "void main() {",
  "gl_FragColor = texture2D(sampler, fragTextureCoord);",
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

  context.enable(context.DEPTH_TEST);

  context.enable(context.CULL_FACE);

  context.frontFace(context.CCW);

  context.cullFace(context.BACK);

  return context;
}

const createBuffer = (context, data, type) => {
  const buffer = context.createBuffer();

  context.bindBuffer(type, buffer);

  context.bufferData(type, data, context.STATIC_DRAW);
};

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

const deg2Rad = (degrees) => degrees * (Math.PI / 180);

const context = getGraphicsContext();

clearBackground(context, 0, 0, 0, 1);

const vertexShader = createShader(context, vertexShaderSourceCode, context.VERTEX_SHADER);

const fragmentShader = createShader(context, fragmentShaderSourceCode, context.FRAGMENT_SHADER);

const program = context.createProgram();

context.attachShader(program, vertexShader);

context.attachShader(program, fragmentShader);

linkProgram(context, program);

// X, Y, Z, U, V
const vertices = [
// Top
  -1.0, 1.0, -1.0,   0, 0,
  -1.0, 1.0, 1.0,    0, 1,
   1.0, 1.0, 1.0,     1, 1,
   1.0, 1.0, -1.0,    1, 0,

// Left
  -1.0, 1.0, 1.0,    0, 0,
  -1.0, -1.0, 1.0,   1, 0,
  -1.0, -1.0, -1.0,  1, 1,
  -1.0, 1.0, -1.0,   0, 1,

// Right
   1.0, 1.0, 1.0,    1, 1,
   1.0, -1.0, 1.0,   0, 1,
   1.0, -1.0, -1.0,  0, 0,
   1.0, 1.0, -1.0,   1, 0,

// Front
   1.0, 1.0, 1.0,    1, 1,
   1.0, -1.0, 1.0,    1, 0,
  -1.0, -1.0, 1.0,    0, 0,
  -1.0, 1.0, 1.0,    0, 1,

// Back
   1.0, 1.0, -1.0,    0, 0,
   1.0, -1.0, -1.0,    0, 1,
  -1.0, -1.0, -1.0,    1, 1,
  -1.0, 1.0, -1.0,    1, 0,

// Bottom
  -1.0, -1.0, -1.0,   1, 1,
  -1.0, -1.0, 1.0,    1, 0,
   1.0, -1.0, 1.0,     0, 0,
   1.0, -1.0, -1.0,    0, 1,
];

const indices = [
// Top
0, 1, 2,
0, 2, 3,

// Left
5, 4, 6,
6, 4, 7,

// Right
8, 9, 10,
8, 10, 11,

// Front
13, 12, 14,
15, 14, 12,

// Back
16, 17, 18,
16, 18, 19,

// Bottom
21, 20, 22,
22, 20, 23
];

createBuffer(context, new Float32Array(vertices), context.ARRAY_BUFFER);

createBuffer(context, new Uint16Array(indices), context.ELEMENT_ARRAY_BUFFER);

setupAttribute(context, program, "vertPosition", 3, 0);

setupAttribute(context, program, "vertTextureCoord", 2, 3);

const texture = context.createTexture();
const image = new Image();
image.crossOrigin = "anonymous";
image.src="crate.svg";
image.onload = () => {
context.bindTexture(context.TEXTURE_2D, texture);
context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
context.bindTexture(context.TEXTURE_2D, null);
}

context.useProgram(program);

const worldUniformLocation = context.getUniformLocation(program, "mWorld");

const worldMatrix = glMatrix.mat4.identity(new Float32Array(16));

const viewUniformLocation = context.getUniformLocation(program, "mView");

const viewMatrix = glMatrix.mat4.lookAt(new Float32Array(16), [0,0,-8], [0,0,0], [0,1,0]);

const projectionUniformLocation = context.getUniformLocation(program, "mProjection");

const fieldOfView = deg2Rad(45);

const aspectRatio = canvas.width / canvas.height;

const frustumNearBound = 0.1;

const frustumFarBound = 1000.0;

const projectionMatrix = glMatrix.mat4.perspective(new Float32Array(16), fieldOfView, aspectRatio, frustumNearBound, frustumFarBound);

context.uniformMatrix4fv(worldUniformLocation, context.FALSE, worldMatrix);

context.uniformMatrix4fv(viewUniformLocation, context.FALSE, viewMatrix);

context.uniformMatrix4fv(projectionUniformLocation, context.FALSE, projectionMatrix);

var xRotationMatrix = new Float32Array(16);

var yRotationMatrix = new Float32Array(16);

var angle = 0;

const identityMatrix = glMatrix.mat4.identity(new Float32Array(16));

const loop = () => {
  angle = performance.now() / 1000 / 6 * 2 * Math.PI;

  glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);

  glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 2, [1, 0, 0]);

  glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);

  context.uniformMatrix4fv(worldUniformLocation, context.FALSE, worldMatrix);

  clearBackground(context, 0, 0, 0, 1);

  context.bindTexture(context.TEXTURE_2D, texture);

  context.activeTexture(context.TEXTURE0);

  context.drawElements(context.TRIANGLES, indices.length, context.UNSIGNED_SHORT, 0);

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);

export const getGraphicsContext = () => {
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

export const createBuffer = (context, data, type) => {
  const buffer = context.createBuffer();

  context.bindBuffer(type, buffer);

  context.bufferData(type, data, context.STATIC_DRAW);
};

export const createShader = (context, source, shaderType) => {
  const shader = context.createShader(shaderType);

  context.shaderSource(shader, source);

  context.compileShader(shader);

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    console.error("Error Compiling Shader: ", context.getShaderInfoLog(shader));
  }

  return shader;
};

export const setupAttribute = (context, program, attribute, size, offset) => {
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

export const clearBackground = (context, red, green, blue, alpha) => {
  context.clearColor(red, green, blue, alpha);

  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
};

export const linkProgram = (context, program) => {
  context.linkProgram(program);

  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    console.error("Error Linking Program: ", context.getProgramInfoLog(program));
  }

  context.validateProgram(program);

  if (!context.getProgramParameter(program, context.VALIDATE_STATUS)) {
    console.error("Error Validating Program: ", context.getProgramInfoLog(program));
  }
};

export const deg2Rad = (degrees) => degrees * (Math.PI / 180);

export const createTexture = (context, URL) => {
  const texture = context.createTexture();

  const image = new Image();

  image.crossOrigin = "anonymous";

  image.src = URL;

  image.onload = () => {
    context.bindTexture(context.TEXTURE_2D, texture);

    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);

    context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);

    context.bindTexture(context.TEXTURE_2D, null);
  }

  return texture;
};

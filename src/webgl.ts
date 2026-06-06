export const resizeCanvasToDisplaySize = (context) => {
  const devicePixelRatio = window.devicePixelRatio || 1;

  const width = Math.floor(context.canvas.clientWidth * devicePixelRatio) || 640;

  const height = Math.floor(context.canvas.clientHeight * devicePixelRatio) || 480;

  if (context.canvas.width !== width || context.canvas.height !== height) {
    context.canvas.width = width;

    context.canvas.height = height;

    context.viewport(0, 0, width, height);
  }
};

export const getGraphicsContext = () => {
  const canvas = document.getElementById("canvas");

  const context = canvas.getContext("webgl");

  if (!context) {
    console.log("WebGL Not Supported, trying experimental-webgl");

    const newContext = canvas.getContext("experimental-webgl");
    
    if (!newContext) {
      console.log("Your Browser Does Not Support WebGL");

      throw Error("Your Browser Does Not Support WebGL");
    }
  }


  context.enable(context.DEPTH_TEST);

  context.enable(context.CULL_FACE);

  context.frontFace(context.CCW);

  context.cullFace(context.BACK);

  resizeCanvasToDisplaySize(context);

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

export const createTexture = (context, URL) => {
  return new Promise((resolve, reject) => {
    const texture = context.createTexture();

    context.bindTexture(context.TEXTURE_2D, texture);

    context.texImage2D(
      context.TEXTURE_2D,
      0,
      context.RGBA,
      1,
      1,
      0,
      context.RGBA,
      context.UNSIGNED_BYTE,
      new Uint8Array([200, 200, 200, 255])
    );

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);

    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);

    resolve(texture);

    const image = new Image();

    image.crossOrigin = 'anonymous';

    image.src = URL;

    image.onload = () => {
      context.bindTexture(context.TEXTURE_2D, texture);

      context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);

      context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);

      context.bindTexture(context.TEXTURE_2D, null);
    }

    image.onerror = (error) => {
      console.error(`Failed to load texture image: ${URL}`);
    };
  });
};

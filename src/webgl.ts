import type { Color } from './color.js';

export const resizeCanvasToDisplaySize = (context: WebGLRenderingContext) => {
  const devicePixelRatio = window.devicePixelRatio || 1;

  const canvas: HTMLCanvasElement = context.canvas as HTMLCanvasElement;

  const width = Math.floor(canvas.clientWidth * devicePixelRatio) || 640;

  const height = Math.floor(canvas.clientHeight * devicePixelRatio) || 480;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;

    canvas.height = height;

    context.viewport(0, 0, width, height);
  }
};

export const getGraphicsContext = (): WebGLRenderingContext => {
  const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    throw new Error('Canvas not found');
  }

  const context = canvas.getContext('webgl'); 

  if (!context) {
    throw new Error('Your Browser Does Not Support WebGL');
  }

  context.enable(context.DEPTH_TEST);

  context.enable(context.CULL_FACE);

  context.frontFace(context.CCW);

  context.cullFace(context.BACK);

  resizeCanvasToDisplaySize(context);

  return context;
}

export const createBuffer = (context: WebGLRenderingContext, data: BufferSource, type: number) => {
  const buffer = context.createBuffer();

  context.bindBuffer(type, buffer);

  context.bufferData(type, data, context.STATIC_DRAW);
};

export const createShader = (context: WebGLRenderingContext, source: string, shaderType: number): WebGLShader => {
  const shader = context.createShader(shaderType);

  if (!shader) {
    throw new Error('Error Creating Shader');
  }

  context.shaderSource(shader, source);

  context.compileShader(shader);

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    const infoLog = context.getShaderInfoLog(shader);

    throw new Error(`Error Compiling Shader: ${infoLog || 'Unknown Error'} `);
  }

  return shader;
};

export const setupAttribute = (context: WebGLRenderingContext, program: WebGLProgram, attribute: string, size: number, offset: number) => {
  const attributeLocation = context.getAttribLocation(program, attribute);

  context.vertexAttribPointer(
    attributeLocation,
    size,
    context.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    offset * Float32Array.BYTES_PER_ELEMENT
  );

  context.enableVertexAttribArray(attributeLocation);
};

export const clearBackground = (context: WebGLRenderingContext, color: Color) => {
  const { red, green, blue, alpha } = color;

  context.clearColor(red, green, blue, alpha);

  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
};

export const linkProgram = (context: WebGLRenderingContext, program: WebGLProgram) => {
  context.linkProgram(program);

  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    console.error('Error Linking Program: ', context.getProgramInfoLog(program));
  }

  context.validateProgram(program);

  if (!context.getProgramParameter(program, context.VALIDATE_STATUS)) {
    console.error('Error Validating Program: ', context.getProgramInfoLog(program));
  }
};

export const createTexture = (context: WebGLRenderingContext, URL: string): Promise<WebGLTexture> => {
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

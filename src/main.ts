import { getFileContents } from './fs.js';

import { Application } from './application.js';

import { Context } from './context.js';

const vertexShaderSourceCode: string = await getFileContents('vertex.glsl');

const fragmentShaderSourceCode: string = await getFileContents('fragment.glsl');

const textureSource: string = 'crate.svg';

try {
    const context: Context = new Context('canvas', vertexShaderSourceCode, fragmentShaderSourceCode, textureSource);

    const application: Application = new Application(context);

    requestAnimationFrame((time: number) => application.render(time));
} catch (exception: unknown) {
    console.error(exception);
}

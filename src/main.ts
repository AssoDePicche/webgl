import { getFileContents } from './fs.js';

import { Application } from './application.js';

import { Context } from './context.js';

const vertexShaderSourceCode: string = await getFileContents('vertex.glsl');

const fragmentShaderSourceCode: string = await getFileContents('fragment.glsl');

const textureSource: string = 'https://as2.ftcdn.net/jpg/01/99/14/99/1000_F_199149981_RG8gciij11WKAQ5nKi35Xx0ovesLCRaU.jpg';

try {
    const context: Context = new Context('canvas', vertexShaderSourceCode, fragmentShaderSourceCode, textureSource);

    const application: Application = new Application(context);

    requestAnimationFrame(() => application.render());
} catch (exception: unknown) {
    console.error(exception);
}

import { getFileContents } from './fs.js';

import { Application } from './application.js';

import { Entity, EntityFactory } from './entity.js';

import { Context } from './context.js';

const vertexShaderSourceCode: string = await getFileContents('vertex.glsl');

const fragmentShaderSourceCode: string = await getFileContents('fragment.glsl');

try {
    const context: Context = new Context('canvas', vertexShaderSourceCode, fragmentShaderSourceCode);

    const factory: EntityFactory = new EntityFactory(context);

    const entities: Entity[] = [
        factory.createSphere('planet.jpg'),
    ];

    const application: Application = new Application(context, entities);

    requestAnimationFrame((time: number) => application.render(time));
} catch (exception: unknown) {
    console.error(exception);
}

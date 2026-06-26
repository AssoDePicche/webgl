import { Program } from './program.js';

import { Texture } from './texture.js';

export class Material {
    public constructor(
        public readonly program: Program,
        public readonly texture: Texture
    ) { }

    public apply(): void {
        this.program.use();

        this.texture.activate(0);
    }
}

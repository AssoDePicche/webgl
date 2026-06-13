import { Program } from './program.js';

export class Material {
    public constructor(
        public readonly program: Program
    ) { }

    public apply(context: WebGLRenderingContext): void {
        this.program.use();
    }
}

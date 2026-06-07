import { Mesh } from './mesh.js';

import { Program } from './program.js';

export class Application {
    private context: WebGLRenderingContext;

    private mesh: Mesh;

    private program: Program;

    public constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

        if (!canvas) {
            throw new Error();
        }

        const context = canvas.getContext('webgl2');

        if (!context) {
            throw new Error();
        }

        this.context = context;

        const vertexSource = 'vertex.glsl';

        const fragmentSource = 'fragment.glsl';

        this.mesh = new Mesh(this.context, [
            0.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0
        ]);

        this.program = new Program(this.context, vertexSource, fragmentSource);
    }

    public render() {
        this.context.clearColor(0.0, 0.0, 0.0, 1.0);

        this.context.clear(this.context.COLOR_BUFFER_BIT);

        this.program.use();

        const posAttrLocation = this.program.getAttribLocation('aPosition');

        this.mesh.bind(posAttrLocation, 3);

        this.mesh.draw();

        requestAnimationFrame(() => this.render());
    }
}


import * as glMatrix from 'gl-matrix';

import { Cube } from './cube.js';

import { Mesh } from './mesh.js';

import { Program } from './program.js';

import { Texture } from './texture.js';

export class Context {
    public readonly context: WebGLRenderingContext;;

    public readonly mesh: Mesh;

    public readonly program: Program;

    public readonly texture: Texture;

    private worldLocation!: WebGLUniformLocation | null;

    private viewLocation!: WebGLUniformLocation | null;

    private projectionLocation!: WebGLUniformLocation | null;

    public constructor(canvasId: string, vertexSource: string, fragmentSource: string, textureSource: string) {
        this.context = this.getGraphicsContext(canvasId);

        this.resizeCanvasToDisplaySize(window.devicePixelRatio);

        this.mesh = new Mesh(this.context, Cube.indices, Cube.vertices);

        this.program = new Program(this.context, vertexSource, fragmentSource);

        this.texture = new Texture(this.context, textureSource);

        this.program.use();

        this.worldLocation = this.program.getUniformLocation('u_World');

        this.viewLocation = this.program.getUniformLocation('u_View');

        this.projectionLocation = this.program.getUniformLocation('u_Projection');

        const aPosition: number = this.program.getAttribLocation('aPosition');

        this.mesh.bind(aPosition, 3, Cube.STRIDE);

        const aTextureCoordinates: number = this.program.getAttribLocation('aTextureCoordinates');

        this.texture.bind(aTextureCoordinates, 2, Cube.STRIDE, 3);
    }

    public clear(): void {
        this.context.clearColor(0.0, 0.0, 0.0, 1.0);

        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    }

    public draw(world: glMatrix.mat4, view: glMatrix.mat4, projection: glMatrix.mat4): void {
        this.context.uniformMatrix4fv(this.worldLocation, false, world);
        this.context.uniformMatrix4fv(this.viewLocation, false, view);
        this.context.uniformMatrix4fv(this.projectionLocation, false, projection);

        this.texture.activate();
        this.mesh.draw(Cube.indices.length, this.context.UNSIGNED_SHORT, 0);
    }

    public get aspectRatio(): number {
        const canvas = this.context.canvas as HTMLCanvasElement;

        return canvas.width / canvas.height;
    }

    public get canvas(): HTMLCanvasElement {
        return this.context.canvas as HTMLCanvasElement;
    }

    private getGraphicsContext(canvasId: string): WebGLRenderingContext {
        const canvas: HTMLCanvasElement | null = document.getElementById(canvasId) as HTMLCanvasElement;

        if (!canvas) {
            throw new Error(`Canvas Element With Id '${canvasId}' Not Found`);
        }

        const context = canvas.getContext('webgl') as WebGLRenderingContext;

        if (!context) {
            throw new Error('Your Browser Does Not Support WebGL');
        }

        context.enable(context.DEPTH_TEST);

        context.enable(context.CULL_FACE);

        context.frontFace(context.CCW);

        context.cullFace(context.BACK);

        return context;
    };

    private resizeCanvasToDisplaySize(pixelRatio: number = 1, fallbackWidth: number = 640, fallbackHeight: number = 480): void {
        const width: number = Math.floor((this.context.canvas as HTMLCanvasElement).clientWidth * pixelRatio) || fallbackWidth;

        const height: number = Math.floor((this.context.canvas as HTMLCanvasElement).clientHeight * pixelRatio) || fallbackHeight;

        if ((this.context.canvas as HTMLCanvasElement).width !== width || (this.context.canvas as HTMLCanvasElement).height !== height) {
            (this.context.canvas as HTMLCanvasElement).width = width;

            (this.context.canvas as HTMLCanvasElement).height = height;

            this.context.viewport(0, 0, width, height);
        }
    }
}

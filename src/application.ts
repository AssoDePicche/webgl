import * as glMatrix from 'gl-matrix';

import { Camera } from './camera.js';

import { Debugger } from './debugger.js';

import * as Cube from './cube.js';

import { Input } from './input.js';

import { Mesh } from './mesh.js';

import { Point3D } from './point.js';

import { Program } from './program.js';

import { Texture } from './texture.js';

import { clamp, deg2Rad } from './utils.js';

interface Inputs {
    coordsX: HTMLInputElement;
    coordsY: HTMLInputElement;
    coordsZ: HTMLInputElement;
    fov: HTMLInputElement;
    near: HTMLInputElement;
    far: HTMLInputElement;
}

export class Application {
    private context: WebGLRenderingContext;

    private mesh: Mesh;

    private program: Program;

    private texture: Texture;

    private camera: Camera;

    private debugger: Debugger;

    private input: Input;

    private inputs: Inputs;

    public constructor(canvasId: string, vertexSource: string, fragmentSource: string, textureSource: string) {
        this.context = this.getGraphicsContext(canvasId);

        this.camera = new Camera({
            minRadius: 1.5,
            maxRadius: 20.0,
            moveSpeed: 0.5,
            sensitivity: 0.1,
            zoomSpeed: 0.5,
        });

        this.debugger = new Debugger('HUD', 'DEBUG', 'error', 'toggleDebugging');

        this.input = new Input(this.context.canvas! as HTMLCanvasElement);

        this.inputs = {
            coordsX: document.getElementById('angleX') as HTMLInputElement,
            coordsY: document.getElementById('angleY') as HTMLInputElement,
            coordsZ: document.getElementById('angleZ') as HTMLInputElement,
            fov: document.getElementById('fieldOfView') as HTMLInputElement,
            near: document.getElementById('nearBound') as HTMLInputElement,
            far: document.getElementById('farBound') as HTMLInputElement,
        };

        this.resizeCanvasToDisplaySize(window.devicePixelRatio);

        this.mesh = new Mesh(this.context, Cube.indices, new Float32Array(Cube.vertices));

        this.program = new Program(this.context, vertexSource, fragmentSource);

        this.texture = new Texture(this.context, textureSource);

        this.program.use();

        const aPosition: number = this.program.getAttribLocation('aPosition');

        this.mesh.bind(aPosition, 3, Cube.CUBE_GEOMETRY.STRIDE);

        const textureCoordinates: number = this.program.getAttribLocation('textureCoordinates');

        this.texture.bind(textureCoordinates, 2, Cube.CUBE_GEOMETRY.STRIDE, 3);
    }

    public render = (): void => {
        this.camera.update(this.input);

        this.context.clearColor(0.0, 0.0, 0.0, 1.0);

        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

        const worldMatrix: glMatrix.mat4 = glMatrix.mat4.identity(new Float32Array(16));

        const aspectRatio: number = (this.context.canvas as HTMLCanvasElement).width / (this.context.canvas as HTMLCanvasElement).height;

        const eye: Point3D = this.camera.getEyePosition();

        const at: number[] = [0.0, 0.0, 0.0];

        const up: number[] = [0.0, 1.0, 0.0];

        const viewMatrix: glMatrix.mat4 = glMatrix.mat4.identity(new Float32Array(16));

        glMatrix.mat4.lookAt(viewMatrix, eye.toArray(), at, up);

        const fovDegrees = parseFloat(this.inputs.fov.value);

        const near = parseFloat(this.inputs.near.value);

        const far = parseFloat(this.inputs.far.value);

        const angleX = parseFloat(this.inputs.coordsX.value);

        const angleY = parseFloat(this.inputs.coordsY.value);

        const angleZ = parseFloat(this.inputs.coordsZ.value);

        const projectionMatrix: glMatrix.mat4 = glMatrix.mat4.perspective(new Float32Array(16), deg2Rad(fovDegrees), aspectRatio, near, far);

        glMatrix.mat4.identity(worldMatrix);

        glMatrix.mat4.rotate(worldMatrix, worldMatrix, angleX, [1, 0, 0]);

        glMatrix.mat4.rotate(worldMatrix, worldMatrix, angleY, [0, 1, 0]);

        glMatrix.mat4.rotate(worldMatrix, worldMatrix, angleZ, [0, 0, 1]);

        this.setUniformMatrix4fv('mWorld', worldMatrix);

        this.setUniformMatrix4fv('mView', viewMatrix);

        this.setUniformMatrix4fv('mProjection', projectionMatrix);

        this.debugger.renderHUD(eye, fovDegrees, near, far);

        if (this.debugger.isDebuggingEnabled) {
            this.debugger.renderInputInfo(this.input.isDragging, this.input.lastTouchDistance, this.input.lastPosition);

            this.debugger.renderMatrices(worldMatrix, viewMatrix, projectionMatrix);
        }

        this.texture.activate();

        this.mesh.draw(Cube.indices.length, this.context.UNSIGNED_SHORT);

        this.input.flush();

        requestAnimationFrame(() => this.render());
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

    private setUniformMatrix4fv(uniform: string, matrix: glMatrix.mat4): void {
        const uniformLocation: WebGLUniformLocation | null = this.program.getUniformLocation(uniform);

        this.context.uniformMatrix4fv(uniformLocation, false, matrix);
    }
}


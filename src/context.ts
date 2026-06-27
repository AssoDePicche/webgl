import * as glMatrix from 'gl-matrix';

import { Entity } from './entity.js';

import { PointLight } from './light.js';

import { Program } from './program.js';

export class Context {
    public readonly context: WebGLRenderingContext;;

    public readonly program: Program;

    private worldLocation!: WebGLUniformLocation | null;

    private viewLocation!: WebGLUniformLocation | null;

    private projectionLocation!: WebGLUniformLocation | null;

    private lightAttenuationLocation!: WebGLUniformLocation | null;

    private lightColorLocation!: WebGLUniformLocation | null;

    private lightPositionLocation!: WebGLUniformLocation | null;

    public constructor(canvasId: string, vertexSource: string, fragmentSource: string) {
        this.context = this.getGraphicsContext(canvasId);

        this.resizeCanvasToDisplaySize(window.devicePixelRatio);

        this.program = new Program(this.context, vertexSource, fragmentSource);

        this.worldLocation = this.program.getUniformLocation('u_World');

        this.viewLocation = this.program.getUniformLocation('u_View');

        this.projectionLocation = this.program.getUniformLocation('u_Projection');

        this.lightAttenuationLocation = this.program.getUniformLocation('u_LightAttenuation');

        this.lightColorLocation = this.program.getUniformLocation('u_LightColor');

        this.lightPositionLocation = this.program.getUniformLocation('u_LightPosition');
    }

    public clear(): void {
        this.context.clearColor(0.0, 0.0, 0.0, 1.0);

        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    }

    public setupScene(view: glMatrix.mat4, projection: glMatrix.mat4, light: PointLight): void {
        this.context.uniformMatrix4fv(this.viewLocation, false, view);

        this.context.uniformMatrix4fv(this.projectionLocation, false, projection);

        this.context.uniform3fv(this.lightAttenuationLocation, light.attenuation.toArray());

        this.context.uniform3fv(this.lightColorLocation, [light.color.red, light.color.green, light.color.blue]);

        this.context.uniform3fv(this.lightPositionLocation, light.position.toArray());
    }

    public draw(entity: Entity): void {
        entity.material.apply();

        this.context.uniformMatrix4fv(this.worldLocation, false, entity.world());

        const uTextureLoc = entity.material.program.getUniformLocation('u_Texture');

        this.context.uniform1i(uTextureLoc, 0);

        const aNormal = entity.material.program.getAttribLocation('aNormal');

        const aPosition = entity.material.program.getAttribLocation('aPosition');

        const aTextureCoordinates = entity.material.program.getAttribLocation('aTextureCoordinates');

        entity.mesh.bind(aPosition, aNormal, aTextureCoordinates)

        entity.mesh.draw(this.context.UNSIGNED_SHORT, 0);
    }

    public get aspectRatio(): number {
        const canvas = this.context.canvas as HTMLCanvasElement;

        return canvas.width / canvas.height;
    }

    public get canvas(): HTMLCanvasElement {
        return this.context.canvas as HTMLCanvasElement;
    }

    public drawGizmo(gizmoEntity: Entity, viewMatrix: glMatrix.mat4, gizmoSize: number): void {
        const originalWidth: number = this.canvas.width;

        const originalHeight: number = this.canvas.height;

        this.context.viewport(0, 0, gizmoSize, gizmoSize);

        this.context.clear(this.context.DEPTH_BUFFER_BIT);

        const rotationView = glMatrix.mat4.create();

        glMatrix.mat4.copy(rotationView, viewMatrix);

        rotationView[12] = 0; // Clear X translation

        rotationView[13] = 0; // Clear Y translation

        rotationView[14] = -4; // Step back slightly on Z so the gizmo is in front of the camera

        const gizmoProj = glMatrix.mat4.create();

        glMatrix.mat4.perspective(gizmoProj, Math.PI / 4, 1, 0.1, 10.0);

        this.context.uniformMatrix4fv(this.viewLocation, false, rotationView);

        this.context.uniformMatrix4fv(this.projectionLocation, false, gizmoProj);

        this.draw(gizmoEntity);

        this.context.viewport(0, 0, originalWidth, originalHeight);
    }

    private getGraphicsContext(canvasId: string): WebGLRenderingContext {
        const canvas: HTMLCanvasElement | null = document.getElementById(canvasId) as HTMLCanvasElement;

        if (!canvas) {
            throw new Error(`Canvas Element With Id '${canvasId}' Not Found`);
        }

        const context = canvas.getContext('webgl') as WebGLRenderingContext;

        const extension: OES_standard_derivatives | null = context.getExtension('OES_standard_derivatives');

        if (!extension) {
            throw new Error('OES_standard_derivatives is not supported on this platform, Bump Mapping May Fail');
        }

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

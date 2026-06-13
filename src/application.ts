import { Camera } from './camera.js';

import { Context } from './context.js';

import { Cube } from './cube.js';

import { Debugger } from './debugger.js';

import { Entity } from './entity.js';

import { Material } from './material.js';

import { Mesh } from './mesh.js';

import { PointLight } from './light.js';

import { Input } from './input.js';

import { Point3D } from './point.js';

import { Sphere } from './sphere.js';

import { Texture } from './texture.js';

import { Transform } from './transform.js';

import { Vector3D } from './vector.js';

export class Application {
    private context: Context;

    private input: Input;

    private camera: Camera;

    private debugger: Debugger = new Debugger('HUD', 'DEBUG', 'error', 'toggleDebugging');

    private entities: Entity[] = [];

    private light: PointLight;

    public constructor(context: Context) {
        this.context = context;

        this.input = new Input(this.context.canvas);

        this.camera = new Camera({
            minRadius: 1.5,
            maxRadius: 20.0,
            moveSpeed: 0.5,
            sensitivity: 0.1,
            zoomSpeed: 0.5,
        });

        this.entities.push(
            new Entity(
                new Material(this.context.program, new Texture(this.context.context, 'crate.svg')),
                new Mesh(this.context.context, Cube.indices, Cube.vertices),
                new Transform()
            )
        );

        const sphere: Sphere = Sphere.createSphere(1, 30, 30);

        const offset: Point3D = new Point3D(-3, 0, 0);

        this.entities.push(
            new Entity(
                new Material(this.context.program, new Texture(this.context.context, '')),
                new Mesh(this.context.context, sphere.indices, sphere.vertices),
                new Transform(offset)
            )
        );

        this.light = new PointLight(
            2,
            3,
            0.002,
            new Vector3D(255, 0.09, 0.032)
        );
    }

    public render = (time: number): void => {
        this.camera.update(this.input);

        const [roll, pitch, yaw] = this.input.rotations;

        const fovDegrees: number = this.input.fieldOfViewDegrees;

        const near: number = this.input.nearBounds;

        const far: number = this.input.farBounds;

        this.light.color = this.input.lightColor;

        this.light.update(time);

        this.camera.lookAt(fovDegrees, this.context.aspectRatio, near, far);

        this.camera.rotate(roll, pitch, yaw);

        this.context.clear();

        this.context.setupScene(this.camera.viewMatrix, this.camera.projectionMatrix, this.light);;

        for (const entity of this.entities) {
            this.context.draw(entity);
        }

        this.debugger.renderHUD(this.camera.eye, this.camera.at, this.camera.up, fovDegrees, near, far);

        if (this.debugger.isDebuggingEnabled) {
            this.debugger.renderInputInfo(this.input.isDragging, this.input.lastTouchDistance, this.input.lastPosition);

            this.debugger.renderMatrices(this.camera.worldMatrix, this.camera.viewMatrix, this.camera.projectionMatrix);
        }

        this.input.flush();

        requestAnimationFrame((time: number) => this.render(time));
    }
}


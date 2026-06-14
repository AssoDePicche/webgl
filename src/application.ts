import { Camera } from './camera.js';

import { Context } from './context.js';

import { Debugger } from './debugger.js';

import { Entity, EntityFactory } from './entity.js';

import { PointLight } from './light.js';

import { Input } from './input.js';

import { Point3D } from './point.js';

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
            aspectRatio: this.context.aspectRatio,
            minRadius: 1.5,
            maxRadius: 20.0,
            moveSpeed: 0.5,
            sensitivity: 0.1,
            zoomSpeed: 0.5,
        });

        const factory: EntityFactory = new EntityFactory(this.context);

        this.entities.push(
            factory.createCube('crate.svg'),
            factory.createSphere('', new Point3D(-3, 0, 0)),
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

        this.light.color = this.input.lightColor;

        this.light.update(time);

        this.context.clear();

        this.context.setupScene(this.camera.viewMatrix, this.camera.projectionMatrix, this.light);;

        for (const entity of this.entities) {
            this.context.draw(entity);
        }

        this.debugger.renderHUD(this.camera.eye, this.camera.at, this.camera.up, this.input.fieldOfViewDegrees, this.input.nearBounds, this.input.farBounds, this.light.position);

        this.debugger.renderInputInfo(this.input.isDragging, this.input.lastTouchDistance, this.input.lastPosition);

        this.debugger.renderMatrices(this.camera.worldMatrix, this.camera.viewMatrix, this.camera.projectionMatrix);

        this.input.flush();

        requestAnimationFrame((time: number) => this.render(time));
    }
}


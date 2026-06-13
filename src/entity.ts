import * as glMatrix from 'gl-matrix';

import { Context } from './context.js';

import { Cube } from './cube.js';

import { Material } from './material.js';

import { Mesh } from './mesh.js';

import { Point3D } from './point.js';

import { Sphere } from './sphere.js';

import { Texture } from './texture.js';

import { Transform } from './transform.js';

export class Entity {
    public constructor(
        public readonly material: Material,
        public readonly mesh: Mesh,
        public readonly transform: Transform,
    ) { }

    public world(): glMatrix.mat4 {
        const matrix: glMatrix.mat4 = glMatrix.mat4.create();

        const rotation: glMatrix.quat = glMatrix.quat.fromValues(
            this.transform.rotation.x,
            this.transform.rotation.y,
            this.transform.rotation.z,
            this.transform.rotation.w
        );

        const position: glMatrix.vec3 = glMatrix.vec3.fromValues(
            this.transform.position.x,
            this.transform.position.y,
            this.transform.position.z
        );

        const scale: glMatrix.vec3 = glMatrix.vec3.fromValues(
            this.transform.scale.x,
            this.transform.scale.y,
            this.transform.scale.z
        );

        glMatrix.mat4.fromRotationTranslationScale(matrix, rotation, position, scale);

        return matrix;
    }
}

export class EntityFactory {
    public constructor(private context: Context) { }

    public createCube(textureSource: string): Entity {
        return this.createEntity(textureSource, Cube.indices, Cube.vertices);
    }

    public createSphere(textureSource: string, offset: Point3D = new Point3D(0, 0, 0)): Entity {
        const sphere: Sphere = Sphere.createSphere(1, 30, 30);

        return this.createEntity(textureSource, sphere.indices, sphere.vertices, offset);
    }

    private createEntity(textureSource: string, indices: Uint16Array, vertices: Float32Array, offset: Point3D = new Point3D(0, 0, 0)): Entity {
        const texture: Texture = new Texture(this.context.context, textureSource);

        const material: Material = new Material(this.context.program, texture);

        const mesh: Mesh = new Mesh(this.context.context, indices, vertices);

        const transform: Transform = new Transform(offset);

        return new Entity(material, mesh, transform);
    }
}

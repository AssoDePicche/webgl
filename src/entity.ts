import * as glMatrix from 'gl-matrix';

import { Material } from './material.js';

import { Mesh } from './mesh.js';

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

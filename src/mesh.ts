export class Mesh {
    private context: WebGLRenderingContext;

    private vertices: number[];

    private buffer: WebGLBuffer;

    constructor(context: WebGLRenderingContext, vertices: number[]) {
        this.context = context;

        this.vertices = vertices;

        this.buffer = context.createBuffer();

        context.bindBuffer(context.ARRAY_BUFFER, this.buffer);

        context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
    }

    bind(attributeLocation: number, numComponents: number) {
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffer);

        this.context.vertexAttribPointer(
            attributeLocation,
            numComponents,
            this.context.FLOAT,
            false,
            0,
            0
        );

        this.context.enableVertexAttribArray(attributeLocation);
    }

    draw(primitiveType = this.context.TRIANGLES) {
        this.context.drawArrays(primitiveType, 0, this.vertices.length / 3);
    }
}

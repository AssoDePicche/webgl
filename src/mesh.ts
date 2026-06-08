export class Mesh {
    private context: WebGLRenderingContext;

    private indexBuffer: WebGLBuffer;

    private vertexBuffer: WebGLBuffer;

    constructor(context: WebGLRenderingContext, indices: Uint16Array, vertices: Float32Array) {
        this.context = context;

        this.indexBuffer = this.context.createBuffer();

        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, indices, this.context.STATIC_DRAW);

        this.vertexBuffer = this.context.createBuffer();

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer);

        this.context.bufferData(this.context.ARRAY_BUFFER, vertices, this.context.STATIC_DRAW);
    }

    public bind(attributeLocation: number, numComponents: number, stride: number = 0, offset: number = 0): void {
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer);

        this.context.vertexAttribPointer(
            attributeLocation,
            numComponents,
            this.context.FLOAT,
            false,
            stride * Float32Array.BYTES_PER_ELEMENT,
            offset * Float32Array.BYTES_PER_ELEMENT
        );

        this.context.enableVertexAttribArray(attributeLocation);
    }

    public draw(count: number, type: number, offset: number = 0): void {
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.context.drawElements(this.context.TRIANGLES, count, type, offset);
    }
}

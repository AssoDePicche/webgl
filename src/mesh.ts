export class Mesh {
    public readonly elementCount: number;

    private context: WebGLRenderingContext;

    private indexBuffer: WebGLBuffer;

    private vertexBuffer: WebGLBuffer;

    constructor(
        context: WebGLRenderingContext,
        indices: Uint16Array,
        vertices: Float32Array,
    ) {
        this.context = context;

        this.elementCount = indices.length;

        this.indexBuffer = this.context.createBuffer();

        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, indices, this.context.STATIC_DRAW);

        this.vertexBuffer = this.context.createBuffer();

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer);

        this.context.bufferData(this.context.ARRAY_BUFFER, vertices, this.context.STATIC_DRAW);
    }

    public bind(positionLocation: number, normalLocation: number, uvLocation: number): void {
        const stride: number = 8;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer);

        this.bindAttribute(positionLocation, 3, stride, 0);

        this.bindAttribute(normalLocation, 3, stride, 3);

        this.bindAttribute(uvLocation, 2, stride, 6);
    }

    public draw(type: number, offset: number = 0): void {
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.context.drawElements(this.context.TRIANGLES, this.elementCount, type, offset);
    }

    private bindAttribute(attributeLocation: number, numComponents: number, stride: number, offset: number): void {
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
}

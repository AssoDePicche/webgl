export class Texture {
    private context: WebGLRenderingContext;

    private texture: WebGLTexture;

    public constructor(context: WebGLRenderingContext, source: string) {
        this.context = context;

        this.texture = this.context.createTexture();

        const colorSpace = this.context.RGBA;

        const bindingPoint = this.context.TEXTURE_2D;

        const fallbackColor = new Uint8Array([200, 200, 200, 255]);

        const colorDepth = this.context.UNSIGNED_BYTE;

        this.context.bindTexture(bindingPoint, this.texture);

        this.context.texImage2D(bindingPoint, 0, colorSpace, 1, 1, 0, colorSpace, colorDepth, fallbackColor);

        this.context.texParameteri(bindingPoint, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);

        this.context.texParameteri(bindingPoint, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);

        this.context.texParameteri(bindingPoint, this.context.TEXTURE_MIN_FILTER, this.context.LINEAR);

        this.context.texParameteri(bindingPoint, this.context.TEXTURE_MAG_FILTER, this.context.LINEAR);

        const image = new Image();

        image.crossOrigin = 'anonymous';

        const external: boolean = source.startsWith('http://') || source.startsWith('https://');

        const proxy: string = external ? source : `${import.meta.env.BASE_URL}` + source.replace(/^\//, '');

        image.src = proxy;

        image.onload = () => {
            this.context.bindTexture(bindingPoint, this.texture);

            this.context.pixelStorei(this.context.UNPACK_FLIP_Y_WEBGL, true);

            this.context.texImage2D(bindingPoint, 0, colorSpace, colorSpace, colorDepth, image);

            this.context.bindTexture(bindingPoint, null);
        };

        image.onerror = (error: unknown) => {
            console.error(`Failed To Load Texture Image '${source}: '`, error);
        };
    }

    public bind(attributeLocation: number, numComponents: number, stride: number = 0, offset: number = 0): void {
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

    public activate(): void {
        this.context.activeTexture(this.context.TEXTURE0);

        this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    }
}

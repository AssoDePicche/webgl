export class Texture {
    private context: WebGLRenderingContext;

    private texture: WebGLTexture;

    public constructor(context: WebGLRenderingContext, source: string | HTMLCanvasElement) {
        this.context = context;

        this.texture = this.context.createTexture();

        const colorSpace: number = this.context.RGBA;

        const bindingPoint: number = this.context.TEXTURE_2D;

        const fallbackColor: Uint8Array = new Uint8Array([200, 200, 200, 255]);

        const colorDepth: number = this.context.UNSIGNED_BYTE;

        this.context.bindTexture(bindingPoint, this.texture);

        this.context.texImage2D(bindingPoint, 0, colorSpace, 1, 1, 0, colorSpace, colorDepth, fallbackColor);

        this.context.texParameteri(bindingPoint, this.context.TEXTURE_WRAP_S, this.context.CLAMP_TO_EDGE);

        this.context.texParameteri(bindingPoint, this.context.TEXTURE_WRAP_T, this.context.CLAMP_TO_EDGE);

        this.context.texParameteri(bindingPoint, this.context.TEXTURE_MIN_FILTER, this.context.LINEAR);

        this.context.texParameteri(bindingPoint, this.context.TEXTURE_MAG_FILTER, this.context.LINEAR);

        if (source instanceof HTMLCanvasElement) {
            this.uploadTexture(source);
        } else {

            const image = new Image();

            image.crossOrigin = 'anonymous';

            const external: boolean = source.startsWith('http://') || source.startsWith('https://');

            const proxy: string = external ? source : `${import.meta.env.BASE_URL}` + source.replace(/^\//, '');

            image.src = proxy;

            image.onload = () => this.uploadTexture(image);

            image.onerror = (error: unknown) => {
                console.error(`Failed To Load Texture Image '${source}: '`, error);
            };
        }
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

    public activate(textureUnitIndex: number): void {
        this.context.activeTexture(this.context.TEXTURE0 + textureUnitIndex);

        this.context.bindTexture(this.context.TEXTURE_2D, this.texture);
    }

    public static generateBumpMap(context: WebGLRenderingContext, source: string, strength: number = 2.0): Texture {
        const img = new Image();

        img.crossOrigin = 'anonymous';

        const external = source.startsWith('http://') || source.startsWith('https://');

        img.src = external ? source : `${import.meta.env.BASE_URL || ''}` + source.replace(/^\//, '');

        const canvas = document.createElement('canvas');

        img.onload = () => {
            canvas.width = img.width;

            canvas.height = img.height;

            const context = canvas.getContext('2d')!;

            context.drawImage(img, 0, 0);

            const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

            const data = imgData.data;

            const width = canvas.width;

            const height = canvas.height;

            const output = context.createImageData(width, height);

            const outData = output.data;

            const getGray = (x: number, y: number): number => {
                const index: number = (Math.min(Math.max(x, 0), width - 1) + Math.min(Math.max(y, 0), height - 1) * width) * 4;

                let color: number = 0;

                for (let offset: number = 0; offset < 3; ++offset) {
                    color += data[index + offset] ?? 0;
                }

                return color / 3.0;
            };

            for (let y = 0; y < height; ++y) {
                for (let x = 0; x < width; ++x) {
                    const tl = getGray(x - 1, y - 1); const t = getGray(x, y - 1); const tr = getGray(x + 1, y - 1);
                    const l = getGray(x - 1, y); const r = getGray(x + 1, y);
                    const bl = getGray(x - 1, y + 1); const b = getGray(x, y + 1); const br = getGray(x + 1, y + 1);

                    const dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
                    const dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);

                    const nx = -dX * strength;
                    const ny = -dY * strength;
                    const nz = 255.0;

                    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

                    const idx = (x + y * width) * 4;
                    outData[idx] = ((nx / len) * 0.5 + 0.5) * 255;
                    outData[idx + 1] = ((ny / len) * 0.5 + 0.5) * 255;
                    outData[idx + 2] = ((nz / len) * 0.5 + 0.5) * 255;
                    outData[idx + 3] = 255;
                }
            }

            context.putImageData(output, 0, 0);
        };

        return new Texture(context, canvas);
    }

    private uploadTexture(source: HTMLCanvasElement | HTMLImageElement): void {
        const colorSpace: number = this.context.RGBA;

        const bindingPoint: number = this.context.TEXTURE_2D;

        const colorDepth: number = this.context.UNSIGNED_BYTE;

        this.context.bindTexture(bindingPoint, this.texture);

        this.context.pixelStorei(this.context.UNPACK_FLIP_Y_WEBGL, true);

        this.context.texImage2D(bindingPoint, 0, colorSpace, colorSpace, colorDepth, source);

        this.context.bindTexture(bindingPoint, null);
    }
}

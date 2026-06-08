export class Program {
    private context: WebGLRenderingContext;

    private program: WebGLProgram;

    public constructor(context: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
        this.context = context;

        this.program = this.createProgram(vertexSource, fragmentSource);
    }

    public getUniformLocation(name: string): WebGLUniformLocation | null {
        return this.context.getUniformLocation(this.program, name);
    }

    public setUniformMatrix4(name: string, matrix: number[], transpose: boolean = false): void {
        const location: WebGLUniformLocation | null = this.context.getUniformLocation(this.program, name);

        this.context.uniformMatrix4fv(location, transpose, matrix);
    }

    public use(): void {
        this.context.useProgram(this.program);
    }

    public getAttribLocation(attribute: string): number {
        return this.context.getAttribLocation(this.program, attribute);
    }

    private createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
        const vertexShader: WebGLShader = this.loadShader(this.context.VERTEX_SHADER, vertexSource);

        const fragmentShader: WebGLShader = this.loadShader(this.context.FRAGMENT_SHADER, fragmentSource);

        const program: WebGLProgram = this.context.createProgram();

        if (!program) {
            throw new Error('Could Not Create WebGL Program');
        }

        this.context.attachShader(program, vertexShader);

        this.context.attachShader(program, fragmentShader);

        this.context.linkProgram(program);

        if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
            const infoLog = this.context.getProgramInfoLog(program);

            throw new Error(`Program Linking Error: ${infoLog ?? 'Unknown Error'}`);
        }

        this.context.detachShader(program, vertexShader);

        this.context.detachShader(program, fragmentShader);

        this.context.deleteShader(vertexShader);

        this.context.deleteShader(fragmentShader);

        return program;
    }

    private loadShader(type: number, source: string): WebGLShader {
        const shader: WebGLShader | null = this.context.createShader(type);

        if (!shader) {
            throw new Error('Could not create shader');
        }

        this.context.shaderSource(shader, source);

        this.context.compileShader(shader);

        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            const infoLog = this.context.getShaderInfoLog(shader);

            this.context.deleteShader(shader);

            throw new Error(`Shader Compilation Error: ${infoLog ?? 'Unknown Error'}`);
        }

        return shader;
    }
}

export class Program {
    private context: WebGLRenderingContext;

    private program: WebGLProgram;

    public constructor(context: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
        this.context = context;

        this.program = this.createProgram(vertexSource, fragmentSource);
    }

    public setUniformMatrix4(name: string, matrix: number[]) {
        const location = this.context.getUniformLocation(this.program, name);

        this.context.uniformMatrix4fv(location, false, matrix);
    }

    public use() {
        this.context.useProgram(this.program);
    }

    public getAttribLocation(attribute: string) {
        return this.context.getAttribLocation(this.program, attribute);
    }

    private createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
        const vertexShader = this.loadShader(this.context.VERTEX_SHADER, vertexSource);

        const fragmentShader = this.loadShader(this.context.FRAGMENT_SHADER, fragmentSource);

        const program = this.context.createProgram();

        this.context.attachShader(program, vertexShader);

        this.context.attachShader(program, fragmentShader);

        if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
            const infoLog = this.context.getProgramInfoLog(program);

            throw new Error(`Program Linking Error: ${infoLog ?? 'Unknown Error'}`);
        }

        return program;
    }

    private loadShader(type: number, source: string): WebGLShader {
        const shader = this.context.createShader(type);

        if (!shader) {
            throw new Error('Could not create shader');
        }

        this.context.shaderSource(shader, source);

        this.context.compileShader(shader);

        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            this.context.deleteShader(shader);

            const infoLog = this.context.getShaderInfoLog(shader);

            throw new Error(`Shader Compilation Error: ${infoLog ?? 'Unknown Error'}`);
        }

        return shader;
    }
}

import { ErrorHandler } from '../utils/error-handler.js';
import { ResourceManager } from '../audio/resource-manager.js';

export class WebGLRenderer {
    constructor(gl, shaderManager) {
        this.gl = gl;
        this.shaderManager = shaderManager;
        this.vertexBuffer = null;
    }

    initialize() {
        this.createVertexBuffer();
    }

    createVertexBuffer() {
        try {
            const vertices = new Float32Array([
                -1, -1,
                 1, -1,
                -1,  1,
                 1,  1
            ]);
            
            this.vertexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
            
            const resourceManager = ResourceManager.getInstance();
            resourceManager.registerWebGLResource(this.vertexBuffer, 'buffer');
            
            console.log('Vertex buffer created and initialized');
        } catch (error) {
            console.error('Error creating vertex buffer:', error);
            ErrorHandler.handleError(error, 'Create Vertex Buffer', false);
        }
    }

    render(audioData) {
        try {
            const currentProgram = this.shaderManager.getCurrentProgram();
            if (!currentProgram) {
                ErrorHandler.logWarning('No shader program available for rendering', 'Render');
                return;
            }

            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.useProgram(currentProgram);

            if (this.vertexBuffer) {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            } else {
                this.createVertexBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            }

            const positionLocation = this.gl.getAttribLocation(currentProgram, 'a_position');
            this.gl.enableVertexAttribArray(positionLocation);
            this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

            const uniforms = this.shaderManager.getUniforms();
            
            const timeLocation = this.gl.getUniformLocation(currentProgram, 'u_time');
            const resolutionLocation = this.gl.getUniformLocation(currentProgram, 'u_resolution');
            const audioDataLocation = this.gl.getUniformLocation(currentProgram, 'u_audioData');

            if (timeLocation) this.gl.uniform1f(timeLocation, uniforms.u_time);
            if (resolutionLocation) this.gl.uniform2fv(resolutionLocation, uniforms.u_resolution);
            if (audioDataLocation) this.gl.uniform1fv(audioDataLocation, uniforms.u_audioData);

            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        } catch (error) {
            console.error('Error in render:', error);
            ErrorHandler.handleError(error, 'Render', false);
        }
    }

    cleanup() {
        try {
            if (this.vertexBuffer) {
                const resourceManager = ResourceManager.getInstance();
                resourceManager.unregisterWebGLResource(this.vertexBuffer);
                this.gl.deleteBuffer(this.vertexBuffer);
                this.vertexBuffer = null;
            }
            console.log('WebGL resources cleaned up');
        } catch (error) {
            console.error('Error cleaning up WebGL resources:', error);
            ErrorHandler.handleError(error, 'Cleanup WebGL Resources', false);
        }
    }

    getVertexBuffer() {
        return this.vertexBuffer;
    }
}

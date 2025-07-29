import { ErrorHandler } from '../utils/error-handler.js';
import { ResourceManager } from '../audio/resource-manager.js';

export class ShaderManager {
    constructor(gl) {
        this.gl = gl;
        this.shaderPrograms = {};
        this.uniforms = {
            base: { u_time: 0, u_resolution: [0, 0], u_audioData: new Float32Array(256) },
            spectrum: { u_time: 0, u_resolution: [0, 0], u_audioData: new Float32Array(256) },
            waves: { u_time: 0, u_resolution: [0, 0], u_audioData: new Float32Array(256) }
        };
        this.currentShader = 'base';
    }

    async loadShaders() {
        try {
            const shaderNames = ['base', 'spectrum', 'waves'];
            
            for (const name of shaderNames) {
                console.log(`Loading shaders for: ${name}`);
                const vertexShader = await this.loadShader(`shaders/${name}.vert`, 'vertex');
                const fragmentShader = await this.loadShader(`shaders/${name}.frag`, 'fragment');
                
                if (!vertexShader || !fragmentShader) {
                    if (name !== 'base') {
                        const baseVertex = await this.loadShader('shaders/base.vert', 'vertex');
                        const baseFragment = await this.loadShader('shaders/base.frag', 'fragment');
                        if (baseVertex && baseFragment) {
                            this.shaderPrograms[name] = this.createProgram(baseVertex, baseFragment);
                            console.log(`Fallback to base shader for: ${name}`);
                        }
                    }
                    ErrorHandler.logWarning(`Failed to load shaders for ${name}`, 'Load Shaders');
                    continue;
                }
                
                this.shaderPrograms[name] = this.createProgram(vertexShader, fragmentShader);
                
                if (this.shaderPrograms[name]) {
                    const resourceManager = ResourceManager.getInstance();
                    resourceManager.registerWebGLResource(this.shaderPrograms[name], 'program');
                    console.log(`Successfully loaded shader: ${name}`);
                }
            }
            
            console.log('Available shaders:', Object.keys(this.shaderPrograms));
        } catch (error) {
            ErrorHandler.handleError(error, 'Load Shaders', true);
        }
    }

    async loadShader(path, type) {
        try {
            const response = await fetch(path);
            const source = await response.text();
            
            const shader = this.gl.createShader(
                type === 'vertex' ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER
            );
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
                ErrorHandler.logWarning(`Shader compilation error: ${this.gl.getShaderInfoLog(shader)}`, 'Load Shader');
                return null;
            }
            
            const resourceManager = ResourceManager.getInstance();
            resourceManager.registerWebGLResource(shader, 'shader');
            
            return shader;
        } catch (error) {
            console.error('Error loading shader:', error);
            ErrorHandler.handleError(error, `Load Shader (${path})`, false);
            return null;
        }
    }

    createProgram(vertexShader, fragmentShader) {
        try {
            const program = this.gl.createProgram();
            this.gl.attachShader(program, vertexShader);
            this.gl.attachShader(program, fragmentShader);
            this.gl.linkProgram(program);
            
            if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                console.error('Program linking error:', this.gl.getProgramInfoLog(program));
                ErrorHandler.logWarning(`Program linking error: ${this.gl.getProgramInfoLog(program)}`, 'Create Program');
                return null;
            }
            
            return program;
        } catch (error) {
            console.error('Error creating program:', error);
            ErrorHandler.handleError(error, 'Create Program', false);
            return null;
        }
    }

    getShaderProgram(name) {
        return this.shaderPrograms[name];
    }

    setCurrentShader(name) {
        this.currentShader = name;
    }

    getCurrentShader() {
        return this.currentShader;
    }

    getCurrentProgram() {
        return this.shaderPrograms[this.currentShader];
    }

    updateUniforms(resolution, audioData) {
        this.uniforms[this.currentShader].u_resolution = resolution;
        this.uniforms[this.currentShader].u_audioData = audioData;
        this.uniforms[this.currentShader].u_time += 0.016;
    }

    getUniforms() {
        return this.uniforms[this.currentShader];
    }

    updateResolution(resolution) {
        for (const shaderName in this.uniforms) {
            this.uniforms[shaderName].u_resolution = resolution;
        }
    }
}

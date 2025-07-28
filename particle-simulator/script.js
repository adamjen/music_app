document.addEventListener('DOMContentLoaded', function() {
    // Get canvas and context
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('WebGL not supported in your browser!');
        return;
    }

    // Set up shaders (to be implemented)
    const vertexShaderSrc = `
        attribute vec3 aPosition;
        attribute float aPointSize;

        void main() {
            gl_PointSize = aPointSize;
            gl_Position = vec4(aPosition, 1.0);
        }
    `;

    const fragmentShaderSrc = `
        precision mediump float;

        uniform vec3 uColor;
        varying float vPointSize;

        void main() {
            gl_FragColor = vec4(uColor, 1.0);
        }
    `;

    // Initialize shaders and program
    function initShaders() {
        const vertexShader = compileShader(gl, vertexShaderSrc, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Failed to link shader program:', gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        gl.useProgram(shaderProgram);
        return shaderProgram;
    }

    // Compile shader
    function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Error compiling ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader:`, gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    // Particle class
    const BOUNDS = 2.5; // Extend bounds to give particles more room

    class Particle {
        constructor(x, y) {
            this.position = [x, y, 0];
            this.velocity = [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 0];
            this.mass = Math.random() * 1.0 + 0.1;
            this.charge = Math.random() > 0.5 ? 1 : -1; // Random charge
            this.color = [Math.random(), Math.random(), Math.random()];
        }

        update(dt, gravity) {
            // Apply gravity
            this.velocity[1] += gravity * dt;

            // Update position based on velocity
            for (let i = 0; i < 3; i++) {
                this.position[i] += this.velocity[i] * dt;
            }

            // Boundary collision with damping to prevent infinite bouncing
            const bounceFactor = 0.95; // Add some energy loss on collision

            if (this.position[1] > BOUNDS) { // Top boundary
                this.position[1] = BOUNDS;
                this.velocity[1] *= -bounceFactor;
            } else if (this.position[1] < -BOUNDS) { // Bottom boundary
                this.position[1] = -BOUNDS;
                this.velocity[1] *= -bounceFactor;
            }

            if (this.position[0] > BOUNDS) { // Right boundary
                this.position[0] = BOUNDS;
                this.velocity[0] *= -bounceFactor;
            } else if (this.position[0] < -BOUNDS) { // Left boundary
                this.position[0] = -BOUNDS;
                this.velocity[0] *= -bounceFactor;
            }
        }
    }

    // Simulation parameters
    const params = {
        particleCount: 500,
        gravity: -9.8,
        shaderEffect: 'none',
        particles: []
    };

    // Initialize particles
    function initParticles() {
        params.particles = [];
        for (let i = 0; i < params.particleCount; i++) {
            const x = (Math.random() - 0.5) * 2;
            const y = (Math.random() - 0.5) * 2;
            params.particles.push(new Particle(x, y));
        }
    }

    // Create buffers and upload particle data
    function createBuffers() {
        if (!params.shaderProgram) return;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positions = params.particles.flatMap(p => p.position);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(params.shaderProgram, 'aPosition');
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);
    }

    // Render frame
    function render() {
        if (!params.shaderProgram) return;

        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        createBuffers();

        const uColor = gl.getUniformLocation(params.shaderProgram, 'uColor');
        if (uColor) {
            // Average color of all particles
            const avgColor = [
                params.particles.reduce((sum, p) => sum + p.color[0], 0) / params.particleCount,
                params.particles.reduce((sum, p) => sum + p.color[1], 0) / params.particleCount,
                params.particles.reduce((sum, p) => sum + p.color[2], 0) / params.particleCount
            ];
            gl.uniform3f(uColor, avgColor[0], avgColor[1], avgColor[2]);
        }

        // Draw particles as points
        gl.drawArrays(gl.POINTS, 0, params.particleCount);
    }

    // Animation loop
    let lastTime = 0;
    function animate(time) {
        if (!lastTime) lastTime = time; // Initialize on first frame

        const dt = (time - lastTime) / 1000; // Delta time in seconds
        lastTime = time;

        // Cap at approximately 60fps (~16.7ms)
        const clampedDt = Math.min(dt, 0.03);

        // Update physics
        for (const particle of params.particles) {
            particle.update(clampedDt, params.gravity);
        }

        render();
        requestAnimationFrame(animate);
    }

    // Set up UI controls
    document.getElementById('shaderEffect').addEventListener('change', function() {
        params.shaderEffect = this.value;

        if (params.shaderProgram) {
            gl.deleteProgram(params.shaderProgram); // Delete old program

            // Load appropriate shaders based on effect selection
            let vertexShaderSrc, fragmentShaderSrc;
            switch (this.value) {
                case 'glow':
                    vertexShaderSrc = `
                        attribute vec3 aPosition;
                        void main() {
                            gl_PointSize = 5.0;
                            gl_Position = vec4(aPosition, 1.0);
                        }
                    `;

                    fragmentShaderSrc = `
                        precision mediump float;
                        uniform vec3 uColor;
                        void main() {
                            // Glow effect by adding bloom
                            float glowFactor = length(gl_PointCoord.xy - vec2(0.5));
                            float intensity = 1.0 / (glowFactor * 4.0 + 0.1);
                            gl_FragColor = vec4(uColor.rgb * intensity, 1.0);
                        }
                    `;
                    break;

                case 'none':
                default:
                    vertexShaderSrc = `
                        attribute vec3 aPosition;
                        void main() {
                            gl_PointSize = 5.0;
                            gl_Position = vec4(aPosition, 1.0);
                        }
                    `;

                    fragmentShaderSrc = `
                        precision mediump float;
                        uniform vec3 uColor;
                        void main() {
                            gl_FragColor = vec4(uColor.rgb, 1.0);
                        }
                    `;
            }

            // Initialize new shaders
            const vertexShader = compileShader(gl, vertexShaderSrc, gl.VERTEX_SHADER);
            const fragmentShader = compileShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER);

            params.shaderProgram = gl.createProgram();
            gl.attachShader(params.shaderProgram, vertexShader);
            gl.attachShader(params.shaderProgram, fragmentShader);
            gl.linkProgram(params.shaderProgram);

            if (!gl.getProgramParameter(params.shaderProgram, gl.LINK_STATUS)) {
                console.error('Failed to link shader program:', gl.getProgramInfoLog(params.shaderProgram));
                params.shaderProgram = null;
            } else {
                gl.useProgram(params.shaderProgram);
            }
        }

        // Recreate buffers and re-render with new shaders
        if (params.shaderProgram) {
            createBuffers();
            render();
        }
    });

    document.getElementById('gravity').addEventListener('input', function() {
        params.gravity = parseFloat(this.value);
    });

    document.getElementById('resetButton').addEventListener('click', initParticles);

    // Initialize everything
    function initialize() {
        // Set WebGL viewport to match canvas size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);

        params.shaderProgram = initShaders();
        if (!params.shaderProgram) return;

        // Update particle count and initialize
        params.particleCount = parseInt(document.getElementById('particleCount').value);
        params.gravity = parseFloat(document.getElementById('gravity').value);

        initParticles();

        render(); // Initial render
        requestAnimationFrame(animate); // Start animation loop
    }

    initialize();
});

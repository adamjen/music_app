/**
 * ResourceManager - Manages audio nodes and WebGL resources to prevent memory leaks
 */
export class ResourceManager {
    constructor() {
        this.audioNodes = new Set();
        this.webglResources = new Set();
        this.sourceNodes = new Map(); // Track source nodes with their creation time
    }

    /**
     * Get singleton instance
     * @returns {ResourceManager}
     */
    static getInstance() {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    /**
     * Register an audio node for tracking
     * @param {AudioNode} node - The audio node to track
     */
    registerAudioNode(node) {
        if (node) {
            this.audioNodes.add(node);
            console.log('Registered audio node:', node.constructor.name);
        }
    }

    /**
     * Unregister an audio node (when it's no longer needed)
     * @param {AudioNode} node - The audio node to unregister
     */
    unregisterAudioNode(node) {
        if (node && this.audioNodes.has(node)) {
            // Disconnect the node before removing it
            try {
                if (typeof node.disconnect === 'function') {
                    node.disconnect();
                }
                this.audioNodes.delete(node);
                console.log('Unregistered audio node:', node.constructor.name);
            } catch (error) {
                console.error('Error disconnecting audio node:', error);
            }
        }
    }

    /**
     * Register a WebGL resource for tracking
     * @param {WebGLObject} resource - The WebGL resource to track
     * @param {string} type - Type of WebGL resource (buffer, texture, program, etc.)
     */
    registerWebGLResource(resource, type) {
        if (resource) {
            this.webglResources.add({ resource, type });
            console.log('Registered WebGL resource:', type);
        }
    }

    /**
     * Unregister a WebGL resource (when it's no longer needed)
     * @param {WebGLObject} resource - The WebGL resource to unregister
     */
    unregisterWebGLResource(resource) {
        if (resource) {
            // Find and remove the resource
            for (const item of this.webglResources) {
                if (item.resource === resource) {
                    this.webglResources.delete(item);
                    console.log('Unregistered WebGL resource:', item.type);
                    break;
                }
            }
        }
    }

    /**
     * Register a source node for tracking
     * @param {AudioBufferSourceNode} sourceNode - The source node to track
     */
    registerSourceNode(sourceNode) {
        if (sourceNode) {
            const timestamp = Date.now();
            this.sourceNodes.set(sourceNode, timestamp);
            this.registerAudioNode(sourceNode);
            console.log('Registered source node');
        }
    }

    /**
     * Unregister a source node
     * @param {AudioBufferSourceNode} sourceNode - The source node to unregister
     */
    unregisterSourceNode(sourceNode) {
        if (sourceNode && this.sourceNodes.has(sourceNode)) {
            this.sourceNodes.delete(sourceNode);
            this.unregisterAudioNode(sourceNode);
            console.log('Unregistered source node');
        }
    }

    /**
     * Clean up old source nodes that are no longer needed
     */
    cleanupOldSourceNodes() {
        const now = Date.now();
        const maxAge = 60000; // 1 minute

        for (const [sourceNode, timestamp] of this.sourceNodes.entries()) {
            if (now - timestamp > maxAge) {
                this.unregisterSourceNode(sourceNode);
            }
        }
    }

    /**
     * Disconnect all registered audio nodes
     */
    disconnectAllAudioNodes() {
        console.log('Disconnecting all audio nodes...');
        for (const node of this.audioNodes) {
            try {
                if (typeof node.disconnect === 'function') {
                    node.disconnect();
                }
            } catch (error) {
                console.error('Error disconnecting audio node:', error);
            }
        }
        this.audioNodes.clear();
        this.sourceNodes.clear();
        console.log('All audio nodes disconnected');
    }

    /**
     * Delete all registered WebGL resources
     * @param {WebGLRenderingContext} gl - WebGL context for deleting resources
     */
    deleteAllWebGLResources(gl) {
        if (!gl) return;

        console.log('Deleting all WebGL resources...');
        for (const item of this.webglResources) {
            try {
                switch (item.type) {
                    case 'buffer':
                        gl.deleteBuffer(item.resource);
                        break;
                    case 'texture':
                        gl.deleteTexture(item.resource);
                        break;
                    case 'program':
                        gl.deleteProgram(item.resource);
                        break;
                    case 'shader':
                        gl.deleteShader(item.resource);
                        break;
                    case 'framebuffer':
                        gl.deleteFramebuffer(item.resource);
                        break;
                    case 'renderbuffer':
                        gl.deleteRenderbuffer(item.resource);
                        break;
                    default:
                        console.warn('Unknown WebGL resource type:', item.type);
                }
            } catch (error) {
                console.error(`Error deleting WebGL ${item.type}:`, error);
            }
        }
        this.webglResources.clear();
        console.log('All WebGL resources deleted');
    }

    /**
     * Clean up all resources
     * @param {WebGLRenderingContext} gl - WebGL context for deleting resources
     */
    cleanupAll(gl) {
        console.log('Cleaning up all resources...');
        this.disconnectAllAudioNodes();
        this.deleteAllWebGLResources(gl);
        console.log('All resources cleaned up');
    }

    /**
     * Get the number of tracked resources
     * @returns {Object} Count of different types of resources
     */
    getResourceCounts() {
        return {
            audioNodes: this.audioNodes.size,
            webglResources: this.webglResources.size,
            sourceNodes: this.sourceNodes.size
        };
    }
}

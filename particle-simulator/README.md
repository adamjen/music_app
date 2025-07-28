# Interactive Particle Simulator

## Project Overview

The Interactive Particle Simulator is a web-based application that demonstrates realistic particle physics simulations with customizable parameters. This project leverages modern web technologies including WebGL, GLSL shaders, and JavaScript to create an interactive and visually stunning experience.

### Key Features:
- Realistic physics simulation (gravity, collisions)
- Customizable particles (mass, charge, velocity)
- Shader-based rendering for smooth visuals
- Interactive controls for real-time parameter modification

## Getting Started

To run the project locally:

1. Clone this repository
2. Navigate to the `particle-simulator` directory
3. Open `index.html` in a WebGL-compatible browser

## Project Structure

```
particle-simulator/
├── index.html          # Main entry point
├── style.css           # Styling
├── script.js            # Core simulation logic
├── shaders/             # GLSL shader files
│   ├── vertex.glsl      # Vertex shader
│   └── fragment.glsl   # Fragment shader
└── README.md            # Project documentation
```

## Controls

- **Particle Count**: Adjust the number of particles in the simulation
- **Gravity**: Change the gravitational force affecting particles
- **Shader Effect**: Select different visual effects (glow, trails)
- **Reset Simulation**: Restart the particle simulation

## Development

### Prerequisites

- Modern web browser with WebGL support
- Basic understanding of JavaScript and WebGL

### Built With

- HTML5/CSS3 for structure and styling
- JavaScript (ES6) for simulation logic
- WebGL 1.0 for rendering
- GLSL shaders for custom visual effects

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

1. Add support for custom force fields
2. Implement particle clustering algorithms
3. Develop a particle editor UI
4. Add multi-player collaboration features

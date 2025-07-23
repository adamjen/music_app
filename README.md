# Interactive Music Visualizer Project

Welcome to the Interactive Music Visualizer project! This repository contains a web-based application that creates dynamic visualizations synchronized with audio in real-time using WebGL shaders and the Web Audio API.

## Project Overview

The Interactive Music Visualizer transforms music into captivating visual patterns. It analyzes the audio frequency spectrum and generates responsive light patterns using WebGL shaders.

### Key Features

- **Real-Time Audio Analysis**: Using Web Audio API
- **Dynamic Light Patterns**: React to music frequency spectrum
- **Customizable Visual Styles**: Adjustable shader parameters
- **User Input Support**: Upload audio files or stream radio

## Table of Contents

- [Getting Started](#getting-started)
  - [Technical Requirements](#technical-requirements)
  - [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Shared Resources](#shared-resources)
  - [Code Style Guide](docs/style-guide.md)
  - [Common Components](docs/components.md)
  - [Utility Functions](docs/utils.md)
- [Contributing](#contributing)

## Getting Started

### Technical Requirements

All projects require a modern web browser with support for:
- HTML5
- CSS3 (with animations)
- JavaScript ES6+
- WebGL capabilities

- Specific APIs or services

### Setup Instructions

1. Clone this repository:
   ```
   git clone https://github.com/adamjen/music_app.git
   ```
2. Navigate to the music-visualizer directory:
   ```
   cd music-visualizer
   ```
3. Open index.html in a modern web browser with WebGL support:
   ```
   open index.html  # or double-click on the file in your file explorer
   ```

Note: This project does not require npm or any build tools as it uses only standard web APIs available in modern browsers.

## Project Structure

```
music-visualizer/
├── index.html          # Main entry point
├── style.css           # Styling
├── script.js            # Core visualization logic
├── audio/               # Audio processing modules
│   ├── analyzer.js       # Audio frequency analysis
│   └── loader.js        # Audio file loading
└── shaders/             # GLSL shader files
    ├── base.glsl         # Base visual effects
    ├── spectrum.glsl     # Frequency spectrum visualization
    └── waves.glsl        # Waveform visualization

## Shared Resources

### Code Style Guide

[View Guide](docs/style-guide.md)

Consistent coding standards across all projects:
- Indentation and formatting rules
- Naming conventions
- Commenting guidelines

### Common Components

[View Components](docs/components.md)

Reusable UI components used across multiple projects:
- Button variations
- Input fields
- Modals and popups
- Data visualizations

### Utility Functions

[View Utils](docs/utils.md)

Common helper functions for all projects:
- Math utilities (vector operations, noise generation)
- DOM manipulation helpers
- Animation utilities
- Data processing functions

## Contributing

We welcome contributions to improve these projects! Please follow our [contribution guidelines](CONTRIBUTING.md) when submitting pull requests.

---
© 2025

All rights reserved.

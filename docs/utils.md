# Utility Functions Library

Common helper functions used across multiple projects for efficiency and code reuse.

## Math Utilities

### Vector Operations

```javascript
/**
 * Add two vectors
 * @param {Array} vecA - First vector [x, y, z]
 * @param {Array} vecB - Second vector [x, y, z]
 * @returns {Array} Resulting vector
 */
function vectorAdd(vecA, vecB) {
  return [vecA[0] + vecB[0], vecA[1] + vecB[1], vecA[2] + vecB[2]];
}

/**
 * Calculate vector magnitude
 * @param {Array} vec - Input vector [x, y, z]
 * @returns {Number} Magnitude of the vector
 */
function vectorMagnitude(vec) {
  return Math.sqrt(Math.pow(vec[0], 2) +
                  Math.pow(vec[1], 2) +
                  Math.pow(vec[2], 2));
}
```

### Noise Generation

```javascript
/**
 * Generate Perlin noise value at a point
 * @param {Number} x - X coordinate
 * @param {Number} y - Y coordinate
 * @param {Number} seed - Random seed for reproducibility
 * @returns {Number} Noise value between 0 and 1
 */
function perlinNoise(x, y, seed) {
  // Implementation of Perlin noise algorithm
}
```

## DOM Manipulation Helpers

### Element Creation

```javascript
/**
 * Create an HTML element with optional attributes
 * @param {String} tag - Tag name (e.g., 'div', 'span')
 * @param {Object} [attributes={}] - Key-value pairs of attributes
 * @returns {Element} Created DOM element
 */
function createElement(tag, attributes = {}) {
  const elem = document.createElement(tag);

  for (const key in attributes) {
    if (key === 'style') {
      Object.assign(elem.style, attributes[key]);
    } else {
      elem.setAttribute(key, attributes[key]);
    }
  }

  return elem;
}
```

### Event Handling

```javascript
/**
 * Add event listener with options
 * @param {Element} elem - DOM element
 * @param {String} eventType - Event type (e.g., 'click', 'mouseover')
 * @param {Function} handler - Event handler function
 * @param {Object} [options={}] - EventListenerOptions object
 */
function addEventListener(elem, eventType, handler, options = {}) {
  elem.addEventListener(eventType, handler, options);
}
```

## Animation Utilities

### Easing Functions

```javascript
/**
 * Linear easing function (no acceleration)
 * @param {Number} t - Time from start (0 to 1)
 * @returns {Number} Eased value
 */
function easeLinear(t) {
  return t;
}

/**
 * Ease-in-out quadratic easing function
 * @param {Number} t - Time from start (0 to 1)
 * @returns {Number} Eased value
 */
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
```

### Animation Loop

```javascript
/**
 * Create an animation loop with timestamp tracking
 * @param {Function} updateFunc - Function to call on each frame
 * @returns {Object} Object containing start and stop methods
 */
function createAnimationLoop(updateFunc) {
  let lastTime = 0;
  let isRunning = false;

  function animate(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = currentTime - lastTime;

    updateFunc(deltaTime);
    lastTime = currentTime;

    if (isRunning) requestAnimationFrame(animate);
  }

  return {
    start: () => {
      isRunning = true;
      requestAnimationFrame(animate);
    },
    stop: () => {
      isRunning = false;
    }
  };
}
```

## Data Processing Functions

### Array Utilities

```javascript
/**
 * Shuffle an array randomly (Fisher-Yates algorithm)
 * @param {Array} array - Input array
 * @returns {Array} Randomized array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Sample N unique items from an array
 * @param {Array} array - Input array
 * @param {Number} n - Number of items to sample
 * @returns {Array} Array of sampled items
 */
function sampleFromArray(array, n) {
  const shuffled = shuffleArray([...array]);
  return shuffled.slice(0, n);
}
```

### Object Utilities

```javascript
/**
 * Deep merge two objects with recursive merging
 * @param {Object} target - Target object
 * @param {Object} source - Source object to merge into target
 * @returns {Object} Merged object
 */
function deepMerge(target, source) {
  const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach(key => {
    if (isObject(source[key]) && key in target) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });

  return target;
}
```

## Utility Functions Usage

These utility functions are designed to be imported and used across different projects. Each function follows the same coding standards outlined in our [style guide](style-guide.md).

Example usage:

```javascript
import { vectorAdd, vectorMagnitude } from './utils/math.js';
import { createElement, addEventListener } from './utils/dom.js';
```

By maintaining a shared library of utility functions, we ensure consistency across projects and reduce code duplication.

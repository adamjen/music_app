## Task 3: Implement CSS Styling

**Description**: Create basic CSS styles for the music visualizer interface.

**Requirements**:
- Set up basic page layout and styling
- Style the canvas element to fill available space
- Add styles for audio source controls
- Include responsive design considerations
- Ensure visual consistency with project style guide

**Acceptance Criteria**:
- Canvas element fills viewport appropriately
- Audio controls are styled consistently
- Basic responsive behavior (works on different screen sizes)
- CSS follows project style guide conventions

**Example CSS Structure**:
```css
/* Base styles */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #121212; /* Dark theme */
  color: white;
}

#controls {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Audio controls styling */
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}

/* Canvas styling */
canvas {
  display: block;
  width: 100%;
  height: calc(100vh - 80px);
}

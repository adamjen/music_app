## Task 2: Implement HTML Structure

**Description**: Create the basic HTML structure with proper document setup and links to CSS/JS files.

**Requirements**:
- Set up a basic HTML5 document structure
- Include meta tags for responsive design
- Link to `style.css` in the head section
- Link to `script.js` at the end of body section
- Create a canvas element with id="visualizer"
- Add controls for audio source selection (upload vs radio)

**Acceptance Criteria**:
- Valid HTML5 structure
- Canvas element exists for visualization
- Basic CSS and JS files are properly linked
- Controls exist for selecting audio sources

**Example HTML Structure**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Music Visualizer</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="controls">
    <!-- Audio source controls will go here -->
  </div>

  <canvas id="visualizer"></canvas>

  <script src="script.js"></script>
</body>
</html>

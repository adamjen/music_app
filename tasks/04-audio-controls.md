## Task 4: Implement Audio Controls

**Description**: Add UI elements and functionality for selecting audio sources.

**Requirements**:
- Create a file input for uploading audio files
- Create a button to toggle between local files and radio stream
- Add event listeners to handle control changes
- Update the visualizer to switch between different audio sources

**Acceptance Criteria**:
- File input works for selecting audio files
- Radio button toggles between local and streaming sources
- Controls are properly styled and integrated into the UI
- JavaScript handles source switching correctly

**Example Implementation**:
```html
<!-- In HTML (add this to #controls div) -->
<input type="file" id="audioFileInput" accept="audio/*">
<button id="radioButton">Switch to Radio</button>
```

```javascript
// In script.js
document.getElementById('radioButton').addEventListener('click', function() {
  // Toggle between file input and radio stream
  const isRadio = !this.dataset.isRadio || this.dataset.isRadio === 'false';
  this.textContent = isRadio ? 'Switch to Local File' : 'Switch to Radio';
  this.dataset.isRadio = isRadio;

  if (isRadio) {
    // Implement radio stream logic
    console.log('Switching to radio stream');
  } else {
    // Enable file input
    document.getElementById('audioFileInput').disabled = false;
  }
});
